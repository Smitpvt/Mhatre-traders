import { sendInvoiceEmail } from '../utils/mailer.js';
import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

export const getBills = asyncHandler(async (req, res, next) => {
  const { search, paymentStatus, billType, page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const whereClause = {
    deletedAt: null
  };

  if (search) {
    whereClause.OR = [
      { invoiceNumber: { contains: search, mode: 'insensitive' } },
      { customerName: { contains: search, mode: 'insensitive' } },
      { customerPhone: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (paymentStatus) {
    whereClause.paymentStatus = paymentStatus;
  }

  if (billType) {
    whereClause.billType = billType;
  }

  const [bills, total] = await Promise.all([
    prisma.bill.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    }),
    prisma.bill.count({ where: whereClause })
  ]);

  res.status(200).json(new ApiResponse('Bills retrieved successfully', {
    bills,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  }));
});

export const getBillById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bill = await prisma.bill.findFirst({
    where: { id, deletedAt: null },
    include: {
      user: { select: { name: true } },
      items: true
    }
  });

  if (!bill) {
    return next(new ApiError(404, 'Invoice not found'));
  }

  res.status(200).json(new ApiResponse('Invoice retrieved successfully', { bill }));
});

export const createBill = asyncHandler(async (req, res, next) => {
  const {
    customerName,
    customerPhone,
    customerGst,
    billingAddress,
    deliveryAddress,
    placeOfSupply,
    billType,
    paymentMode,
    paymentStatus,
    gstCalculationMode,
    discount,
    notes,
    transportDetails,
    items,
    customerEmail,
    sendEmail
  } = req.body;

  if (!customerName || !customerPhone || !billingAddress || !billType || !paymentMode || !items || items.length === 0) {
    return next(new ApiError(400, 'Missing invoice required attributes (customerName, phone, billingAddress, billType, paymentMode, items)'));
  }

  const currentYear = new Date().getFullYear();

  // Run transaction to allocate sequential counter and save records
  const resultBill = await prisma.$transaction(async (tx) => {
    // 1. Allocate counter
    let counter = await tx.invoiceCounter.findUnique({
      where: { year: currentYear }
    });

    if (!counter) {
      counter = await tx.invoiceCounter.create({
        data: { year: currentYear, currentNumber: 0 }
      });
    }

    const nextNumber = counter.currentNumber + 1;
    await tx.invoiceCounter.update({
      where: { year: currentYear },
      data: { currentNumber: nextNumber }
    });

    const paddedNumber = String(nextNumber).padStart(5, '0');
    const invoiceNumber = `MT-${currentYear}-${paddedNumber}`;

    // 2. Validate and map items - Batch fetch all products at once to eliminate N+1 database lookups
    const productIds = items.map(item => item.productId);
    const dbProducts = await tx.product.findMany({
      where: {
        id: { in: productIds },
        deletedAt: null
      },
      include: { pricing: true, inventory: true }
    });

    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    const billItemsData = [];
    let calculatedSubtotal = 0;
    let calculatedGstAmount = 0;

    for (const item of items) {
      const { productId, size, quantity, unitPrice, discount: itemDiscount, gstRate } = item;
      
      const product = productMap.get(productId);

      if (!product) {
        throw new ApiError(404, `Product SKU with ID "${productId}" not found`);
      }

      const qtyVal = parseInt(quantity);
      if (qtyVal <= 0) {
        throw new ApiError(400, `Invalid quantity for SKU: ${product.name}`);
      }

      // Check stock limits
      if (product.inventory.currentStock < qtyVal) {
        throw new ApiError(400, `Stock short. SKU "${product.name}" only contains ${product.inventory.currentStock} units.`);
      }

      // pricing parameters
      const originalGstRate = gstRate !== undefined ? parseFloat(gstRate) : parseFloat(product.pricing.gstRate || 0);
      const defaultRate = parseFloat(product.pricing.defaultBillingRate || 0);
      const chosenRate = unitPrice !== undefined ? parseFloat(unitPrice) : defaultRate;

      // Calculate discount amount from percentage
      const discPercent = itemDiscount ? parseFloat(itemDiscount) : 0;
      const grossAmount = chosenRate * qtyVal;
      const lineDisc = grossAmount * (discPercent / 100);

      let lineSubtotal = 0;
      let lineGst = 0;
      let lineTotal = 0;

      if (billType === 'NON_GST') {
        lineSubtotal = grossAmount - lineDisc;
        lineGst = 0;
        lineTotal = lineSubtotal;
      } else {
        // GST Invoice calculations
        if (gstCalculationMode === 'INCLUSIVE') {
          lineTotal = grossAmount - lineDisc;
          lineSubtotal = lineTotal / (1 + (originalGstRate / 100));
          lineGst = lineTotal - lineSubtotal;
        } else {
          // EXCLUSIVE mode
          lineSubtotal = grossAmount - lineDisc;
          lineGst = lineSubtotal * (originalGstRate / 100);
          lineTotal = lineSubtotal + lineGst;
        }
      }

      calculatedSubtotal += lineSubtotal;
      calculatedGstAmount += lineGst;

      const formattedProductName = size && size.trim() !== '' 
        ? `${product.name} (${size.trim()})` 
        : product.name;

      billItemsData.push({
        productId,
        productName: formattedProductName,
        sku: product.sku,
        hsnCode: product.pricing.hsnCode || '',
        unit: product.unit,
        quantity: qtyVal,
        unitPrice: chosenRate,
        defaultBillingRate: defaultRate,
        discount: lineDisc,
        gstRate: billType === 'NON_GST' ? 0 : originalGstRate,
        gstAmount: lineGst,
        subtotal: lineSubtotal,
        finalLineTotal: lineTotal
      });

      // 3. Deduct stock levels
      const nextStockVal = product.inventory.currentStock - qtyVal;
      await tx.inventory.update({
        where: { productId },
        data: { currentStock: nextStockVal, lastUpdatedBy: req.user.id }
      });

      // 4. Log Inventory Audit logs
      await tx.inventoryTransaction.create({
        data: {
          inventoryId: product.inventory.id,
          type: 'BILL',
          quantity: -qtyVal,
          referenceDocument: invoiceNumber,
          notes: `Deducted automatically via bill checkout: ${invoiceNumber}`,
          userId: req.user.id
        }
      });
    }

    const flatDiscount = discount ? parseFloat(discount) : 0;
    const finalBeforeRound = (calculatedSubtotal + calculatedGstAmount) - flatDiscount;
    const grandTotal = Math.round(finalBeforeRound);
    const roundOff = grandTotal - finalBeforeRound;

    // 5. Save Bill record
    const bill = await tx.bill.create({
      data: {
        invoiceNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        customerGst: customerGst || null,
        billingAddress,
        deliveryAddress: deliveryAddress || billingAddress,
        placeOfSupply: placeOfSupply || 'State',
        billType,
        paymentMode,
        paymentStatus: paymentStatus || 'PENDING',
        gstCalculationMode: gstCalculationMode || 'EXCLUSIVE',
        subtotal: calculatedSubtotal,
        discount: flatDiscount,
        gstAmount: calculatedGstAmount,
        roundOff,
        grandTotal,
        notes: notes || '',
        transportDetails: transportDetails || '',
        userId: req.user.id,
        items: {
          create: billItemsData
        }
      },
      include: {
        items: true
      }
    });

    return bill;
  }, {
    maxWait: 10000,
    timeout: 30000
  });

  if (sendEmail && customerEmail) {
    try {
      const settings = await prisma.setting.findMany();
      const pdfBuffer = await generateInvoicePdfBuffer(resultBill, settings);
      await sendInvoiceEmail(customerEmail, resultBill.invoiceNumber, pdfBuffer);
    } catch (err) {
      console.error('Failed to send invoice email after bill creation:', err);
    }
  }

  res.status(201).json(new ApiResponse('Invoice generated successfully', { bill: resultBill }));
});

export const updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  const validStatuses = ['PENDING', 'PARTIAL', 'PAID'];
  if (!validStatuses.includes(paymentStatus)) {
    return next(new ApiError(400, 'Invalid payment status parameter'));
  }

  const bill = await prisma.bill.findFirst({
    where: { id, deletedAt: null }
  });

  if (!bill) {
    return next(new ApiError(404, 'Invoice not found'));
  }

  const updated = await prisma.bill.update({
    where: { id },
    data: { paymentStatus }
  });

  res.status(200).json(new ApiResponse('Payment status updated', { bill: updated }));
});

// Helper to convert number to text words
const numberToWords = (num) => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only' : 'Only';
  return str.trim();
};


export const generateInvoicePdfBuffer = (bill, settings) => {
  return new Promise((resolve, reject) => {
    try {
      const getSetting = (key, fallback) => {
        const s = settings.find(item => item.key === key);
        return s ? s.value : fallback;
      };

      const companyName = getSetting('company_name', 'Mhatre Traders');
      const companyLegal = getSetting('company_legal_name', 'Mhatre Traders Private Limited');
      const companyAddress = getSetting('company_address', 'Alibag, Raigad, Maharashtra');
      const companyPhone = getSetting('company_phone', '');
      const companyEmail = getSetting('company_email', '');
      const companyGst = getSetting('company_gstin', '');
      const bankName = getSetting('bank_name', '');
      const bankAcc = getSetting('bank_account_number', '');
      const bankIfsc = getSetting('bank_ifsc', '');
      const bankBranch = getSetting('bank_branch', '');

      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const primaryColor = '#1E1E1B';
      const accentColor = '#B56A45';
      const gridColor = '#ECE7DF';

      doc.font('Helvetica-Bold').fontSize(16).fillColor(accentColor).text(companyName.toUpperCase(), 40, 45);
      doc.font('Helvetica').fontSize(8).fillColor('#676767');
      doc.text(companyLegal, 40, 62);
      doc.text(companyAddress, 40, 72);
      doc.text(`Phone: ${companyPhone} | Email: ${companyEmail}`, 40, 82);
      doc.font('Helvetica-Bold').text(`GSTIN: ${companyGst}`, 40, 92);

      doc.rect(340, 40, 215, 60).strokeColor(gridColor).stroke();
      doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('TAX INVOICE', 350, 48);
      doc.fontSize(8).font('Helvetica');
      doc.text(`Invoice No: ${bill.invoiceNumber}`, 350, 60);
      doc.text(`Date: ${new Date(bill.createdAt).toLocaleDateString('en-IN')}`, 350, 72);
      doc.text(`Place of Supply: ${bill.placeOfSupply}`, 350, 84);

      doc.moveTo(40, 115).lineTo(555, 115).strokeColor(gridColor).stroke();

      doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Billed To (Customer):', 40, 125);
      doc.font('Helvetica').fontSize(8).fillColor('#1E1E1B');
      doc.text(bill.customerName, 40, 137);
      doc.text(`Mobile: ${bill.customerPhone}`, 40, 147);
      if (bill.customerGst) doc.font('Helvetica-Bold').text(`GSTIN: ${bill.customerGst}`, 40, 157).font('Helvetica');
      doc.text(`Address: ${bill.billingAddress}`, 40, 167, { width: 230 });

      doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Delivery Site Address:', 340, 125);
      doc.font('Helvetica').fontSize(8);
      doc.text(bill.customerName, 340, 137);
      doc.text(`Address: ${bill.deliveryAddress || bill.billingAddress}`, 340, 147, { width: 215 });

      doc.moveTo(40, 205).lineTo(555, 205).strokeColor(gridColor).stroke();

      let yPos = 215;
      
      doc.rect(40, yPos, 515, 20).fill('#1E1E1B');
      doc.fillColor('#FCFBF8').font('Helvetica-Bold').fontSize(8);
      doc.text('S.N.', 45, yPos + 6, { width: 20 });
      doc.text('Product Name', 70, yPos + 6, { width: 145 });
      doc.text('HSN', 220, yPos + 6, { width: 45 });
      doc.text('Unit', 270, yPos + 6, { width: 35 });
      doc.text('Rate', 310, yPos + 6, { width: 45, align: 'right' });
      doc.text('Qty', 360, yPos + 6, { width: 25, align: 'right' });
      doc.text('Disc', 390, yPos + 6, { width: 30, align: 'right' });
      doc.text('GST %', 425, yPos + 6, { width: 30, align: 'right' });
      doc.text('GST Amt', 460, yPos + 6, { width: 40, align: 'right' });
      doc.text('Total', 505, yPos + 6, { width: 45, align: 'right' });

      yPos += 20;

      doc.fillColor(primaryColor).font('Helvetica').fontSize(7.5);
      bill.items.forEach((item, index) => {
        if (index % 2 === 1) {
          doc.rect(40, yPos, 515, 20).fill('#FCFBF8');
          doc.fillColor(primaryColor);
        }
        
        doc.text(String(index + 1), 45, yPos + 6);
        doc.text(item.productName.substring(0, 32), 70, yPos + 6, { width: 145 });
        doc.text(item.hsnCode || 'N/A', 220, yPos + 6);
        doc.text(item.unit, 270, yPos + 6);
        doc.text(parseFloat(item.unitPrice).toFixed(2), 310, yPos + 6, { width: 45, align: 'right' });
        doc.text(String(item.quantity), 360, yPos + 6, { width: 25, align: 'right' });
        doc.text(parseFloat(item.discount).toFixed(2), 390, yPos + 6, { width: 30, align: 'right' });
        doc.text(`${parseFloat(item.gstRate).toFixed(1)}%`, 425, yPos + 6, { width: 30, align: 'right' });
        doc.text(parseFloat(item.gstAmount).toFixed(2), 460, yPos + 6, { width: 40, align: 'right' });
        doc.text(parseFloat(item.finalLineTotal).toFixed(2), 505, yPos + 6, { width: 45, align: 'right' });

        yPos += 20;
      });

      doc.rect(40, 215, 515, yPos - 215).strokeColor(gridColor).stroke();

      doc.fillColor(primaryColor);
      doc.fontSize(8);

      const summaryY = yPos + 10;
      
      doc.font('Helvetica-Bold').text('Bank Account Information (For Transfers):', 40, summaryY);
      doc.font('Helvetica');
      doc.text(`Bank Name: ${bankName}`, 40, summaryY + 12);
      doc.text(`Account No: ${bankAcc}`, 40, summaryY + 22);
      doc.text(`IFSC Code: ${bankIfsc}`, 40, summaryY + 32);
      doc.text(`Branch: ${bankBranch}`, 40, summaryY + 42);

      const amountWords = numberToWords(Math.round(parseFloat(bill.grandTotal)));
      doc.font('Helvetica-Bold').text(`Total In Words:`, 40, summaryY + 60);
      doc.font('Helvetica').text(`INR ${amountWords}`, 40, summaryY + 70, { width: 250 });

      const rightColumnX = 380;
      let totalRowsY = summaryY;

      const drawTotalRow = (label, value, isBold = false) => {
        doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica').text(label, rightColumnX, totalRowsY);
        doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica').text(value, 505, totalRowsY, { width: 45, align: 'right' });
        totalRowsY += 12;
      };

      drawTotalRow('Subtotal:', parseFloat(bill.subtotal).toFixed(2));
      if (parseFloat(bill.discount) > 0) {
        drawTotalRow('Flat Discount:', `-${parseFloat(bill.discount).toFixed(2)}`);
      }
      if (bill.billType === 'GST') {
        drawTotalRow('GST Total:', parseFloat(bill.gstAmount).toFixed(2));
        drawTotalRow('CGST (Split):', (parseFloat(bill.gstAmount) / 2).toFixed(2));
        drawTotalRow('SGST (Split):', (parseFloat(bill.gstAmount) / 2).toFixed(2));
      }
      if (parseFloat(bill.roundOff) !== 0) {
        drawTotalRow('Round Off:', parseFloat(bill.roundOff).toFixed(2));
      }
      totalRowsY += 3;
      doc.moveTo(rightColumnX, totalRowsY).lineTo(550, totalRowsY).strokeColor(gridColor).stroke();
      totalRowsY += 5;
      drawTotalRow('Grand Total:', `₹${parseFloat(bill.grandTotal).toFixed(2)}`, true);

      doc.fontSize(7).font('Helvetica-Bold');
      doc.text(`PAYMENT MODE: ${bill.paymentMode}`, rightColumnX, totalRowsY + 10);
      doc.text(`PAYMENT STATUS: ${bill.paymentStatus}`, rightColumnX, totalRowsY + 20);

      const footerY = 515;
      doc.moveTo(40, footerY).lineTo(555, footerY).strokeColor(gridColor).stroke();
      
      doc.fontSize(7).font('Helvetica').fillColor('#676767');
      doc.text('Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.', 40, footerY + 8, { width: 300 });

      doc.fillColor(primaryColor);
      doc.font('Helvetica-Bold').text(`For ${companyLegal.toUpperCase()}`, 380, footerY + 8, { width: 175, align: 'right' });
      doc.font('Helvetica').fontSize(6).text('Authorized Signatory', 380, footerY + 45, { width: 175, align: 'right' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};


export const getBillPdf = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bill = await prisma.bill.findFirst({
    where: { id, deletedAt: null },
    include: { items: true }
  });

  if (!bill) {
    return next(new ApiError(404, 'Invoice not found'));
  }

  const settings = await prisma.setting.findMany();
  
  const pdfBuffer = await generateInvoicePdfBuffer(bill, settings);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Invoice_${bill.invoiceNumber}.pdf`);
  res.send(pdfBuffer);
});

export const exportBillsExcel = asyncHandler(async (req, res, next) => {
  const { mode = 'master', includeDeleted } = req.query;

  // mode === 'new' or includeDeleted === 'false' => Active bills only (New Sheet Mode)
  // mode === 'master' or includeDeleted === 'true' => All bills (Master Sheet with soft-deleted history)
  const isNewSheetMode = mode === 'new' || includeDeleted === 'false';
  const whereClause = isNewSheetMode ? { deletedAt: null } : {};

  const bills = await prisma.bill.findMany({
    where: whereClause,
    include: {
      user: { select: { name: true } },
      items: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const sheetTitle = isNewSheetMode ? 'New Active Bills Ledger' : 'Master Bills Ledger';
  const fileNamePrefix = isNewSheetMode ? 'Mhatre_Traders_New_Bills_Ledger' : 'Mhatre_Traders_Master_Bills_Ledger';

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Mhatre Traders Billing System';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetTitle, {
    views: [{ showGridLines: true }]
  });

  // Define Columns
  worksheet.columns = [
    { header: 'Invoice No', key: 'invoiceNumber', width: 18 },
    { header: 'Invoice Date', key: 'createdAt', width: 16 },
    { header: 'Customer Name', key: 'customerName', width: 24 },
    { header: 'Customer Phone', key: 'customerPhone', width: 16 },
    { header: 'Customer Email', key: 'customerEmail', width: 24 },
    { header: 'Bill Type', key: 'billType', width: 12 },
    { header: 'Payment Mode', key: 'paymentMode', width: 16 },
    { header: 'Payment Status', key: 'paymentStatus', width: 16 },
    { header: 'Subtotal (₹)', key: 'subtotal', width: 14 },
    { header: 'Discount (₹)', key: 'discount', width: 14 },
    { header: 'GST Amount (₹)', key: 'gstAmount', width: 14 },
    { header: 'Grand Total (₹)', key: 'grandTotal', width: 16 },
    { header: 'Items Purchased', key: 'itemsSummary', width: 45 },
    { header: 'Billed By', key: 'userName', width: 20 }
  ];

  // Header row styling
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB56A45' } // Brand color accent
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  let grandTotalSum = 0;

  // Add bill rows (all records formatted standard and uniform)
  bills.forEach((bill) => {
    const itemsSummary = bill.items
      ? bill.items.map(i => `${i.productName} (x${i.quantity} @ ₹${parseFloat(i.unitPrice).toFixed(2)})`).join(', ')
      : '';

    const subtotalVal = parseFloat(bill.subtotal || 0);
    const discountVal = parseFloat(bill.discount || 0);
    const gstVal = parseFloat(bill.gstAmount || 0);
    const grandTotalVal = parseFloat(bill.grandTotal || 0);

    grandTotalSum += grandTotalVal;

    const row = worksheet.addRow({
      invoiceNumber: bill.invoiceNumber,
      createdAt: new Date(bill.createdAt).toLocaleDateString('en-IN'),
      customerName: bill.customerName,
      customerPhone: bill.customerPhone,
      customerEmail: bill.customerEmail || '-',
      billType: bill.billType,
      paymentMode: bill.paymentMode,
      paymentStatus: bill.paymentStatus,
      subtotal: subtotalVal,
      discount: discountVal,
      gstAmount: gstVal,
      grandTotal: grandTotalVal,
      itemsSummary,
      userName: bill.user?.name || 'Admin'
    });

    row.height = 22;
    row.alignment = { vertical: 'middle' };

    // Format number columns
    row.getCell('subtotal').numberFormat = '₹#,##0.00';
    row.getCell('discount').numberFormat = '₹#,##0.00';
    row.getCell('gstAmount').numberFormat = '₹#,##0.00';
    row.getCell('grandTotal').numberFormat = '₹#,##0.00';
  });

  // Summary footer row
  worksheet.addRow({});
  const totalRow = worksheet.addRow({
    invoiceNumber: 'GRAND TOTAL',
    grandTotal: grandTotalSum
  });
  totalRow.height = 24;
  totalRow.getCell('invoiceNumber').font = { bold: true };
  totalRow.getCell('grandTotal').font = { bold: true, color: { argb: 'FFB56A45' } };
  totalRow.getCell('grandTotal').numberFormat = '₹#,##0.00';

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${fileNamePrefix}_${new Date().toISOString().split('T')[0]}.xlsx`
  );

  await workbook.xlsx.write(res);
  res.end();
});

export const deleteBill = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bill = await prisma.bill.findFirst({
    where: { id, deletedAt: null }
  });

  if (!bill) {
    return next(new ApiError(404, 'Invoice not found'));
  }

  // Soft delete from database so historical Excel export retains the deleted records
  await prisma.bill.update({
    where: { id },
    data: { deletedAt: new Date() }
  });

  res.status(200).json(
    new ApiResponse('Invoice deleted successfully', null)
  );
});