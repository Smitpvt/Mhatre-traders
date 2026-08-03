import fs from 'fs';
const file = './src/controllers/billing.controller.js';
let content = fs.readFileSync(file, 'utf8');

const generatePdfCode = 
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
      doc.text(\\\Phone: \\\ | Email: \\\\\\, 40, 82);
      doc.font('Helvetica-Bold').text(\\\GSTIN: \\\\\\, 40, 92);

      doc.rect(340, 40, 215, 60).strokeColor(gridColor).stroke();
      doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text('TAX INVOICE', 350, 48);
      doc.fontSize(8).font('Helvetica');
      doc.text(\\\Invoice No: \\\\\\, 350, 60);
      doc.text(\\\Date: \\\\\\, 350, 72);
      doc.text(\\\Place of Supply: \\\\\\, 350, 84);

      doc.moveTo(40, 115).lineTo(555, 115).strokeColor(gridColor).stroke();

      doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Billed To (Customer):', 40, 125);
      doc.font('Helvetica').fontSize(8).fillColor('#1E1E1B');
      doc.text(bill.customerName, 40, 137);
      doc.text(\\\Mobile: \\\\\\, 40, 147);
      if (bill.customerGst) doc.font('Helvetica-Bold').text(\\\GSTIN: \\\\\\, 40, 157).font('Helvetica');
      doc.text(\\\Address: \\\\\\, 40, 167, { width: 230 });

      doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Delivery Site Address:', 340, 125);
      doc.font('Helvetica').fontSize(8);
      doc.text(bill.customerName, 340, 137);
      doc.text(\\\Address: \\\\\\, 340, 147, { width: 215 });

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
        doc.text(\\\\\\%\\\, 425, yPos + 6, { width: 30, align: 'right' });
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
      doc.text(\\\Bank Name: \\\\\\, 40, summaryY + 12);
      doc.text(\\\Account No: \\\\\\, 40, summaryY + 22);
      doc.text(\\\IFSC Code: \\\\\\, 40, summaryY + 32);
      doc.text(\\\Branch: \\\\\\, 40, summaryY + 42);

      const amountWords = numberToWords(Math.round(parseFloat(bill.grandTotal)));
      doc.font('Helvetica-Bold').text(\\\Total In Words:\\\, 40, summaryY + 60);
      doc.font('Helvetica').text(\\\INR \\\\\\, 40, summaryY + 70, { width: 250 });

      const rightColumnX = 380;
      let totalRowsY = summaryY;

      const drawTotalRow = (label, value, isBold = false) => {
        doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica').text(label, rightColumnX, totalRowsY);
        doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica').text(value, 505, totalRowsY, { width: 45, align: 'right' });
        totalRowsY += 12;
      };

      drawTotalRow('Subtotal:', parseFloat(bill.subtotal).toFixed(2));
      if (parseFloat(bill.discount) > 0) {
        drawTotalRow('Flat Discount:', \\\-\\\\\\);
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
      drawTotalRow('Grand Total:', \\\?\\\\\\, true);

      doc.fontSize(7).font('Helvetica-Bold');
      doc.text(\\\PAYMENT MODE: \\\\\\, rightColumnX, totalRowsY + 10);
      doc.text(\\\PAYMENT STATUS: \\\\\\, rightColumnX, totalRowsY + 20);

      const footerY = 515;
      doc.moveTo(40, footerY).lineTo(555, footerY).strokeColor(gridColor).stroke();
      
      doc.fontSize(7).font('Helvetica').fillColor('#676767');
      doc.text('Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.', 40, footerY + 8, { width: 300 });

      doc.fillColor(primaryColor);
      doc.font('Helvetica-Bold').text(\\\For \\\\\\, 380, footerY + 8, { width: 175, align: 'right' });
      doc.font('Helvetica').fontSize(6).text('Authorized Signatory', 380, footerY + 45, { width: 175, align: 'right' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
;

const startMarker = "export const getBillPdf = asyncHandler(async (req, res, next) => {";
const getBillPdfStartIdx = content.indexOf(startMarker);
const beforeGetBillPdf = content.substring(0, getBillPdfStartIdx);
let rest = content.substring(getBillPdfStartIdx);

const endMarker = "  doc.end();\n});";
const endIdx = rest.indexOf(endMarker) + endMarker.length;
const afterGetBillPdf = rest.substring(endIdx);

const newGetBillPdf = \\

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
  res.setHeader('Content-Disposition', \\\ttachment; filename=Invoice_\.pdf\\\);
  res.send(pdfBuffer);
});\;

const finalContent = beforeGetBillPdf + newGetBillPdf + afterGetBillPdf;

if (finalContent.includes("import { sendInvoiceEmail }")) {
  console.log("Already imported");
} else {
  const importStatement = "import { sendInvoiceEmail } from '../utils/mailer.js';\n";
  fs.writeFileSync(file, importStatement + finalContent);
}

console.log("PDF logic refactored successfully.");
