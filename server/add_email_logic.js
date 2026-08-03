import fs from 'fs';
const file = './src/controllers/billing.controller.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add fields to req.body destructuring
content = content.replace(
  "    items\n  } = req.body;",
  "    items,\n    customerEmail,\n    sendEmail\n  } = req.body;"
);

// 2. Add customerEmail to bill creation
content = content.replace(
  "        customerPhone,\n        customerGst:",
  "        customerPhone,\n        customerEmail: customerEmail || null,\n        customerGst:"
);

// 3. Add email sending logic before response
const emailLogic =   if (sendEmail && customerEmail) {
    try {
      const settings = await prisma.setting.findMany();
      const pdfBuffer = await generateInvoicePdfBuffer(resultBill, settings);
      await sendInvoiceEmail(customerEmail, resultBill.invoiceNumber, pdfBuffer);
    } catch (err) {
      console.error('Failed to send invoice email after bill creation:', err);
    }
  }

  res.status(201).json(new ApiResponse('Invoice generated successfully', { bill: resultBill }));;

content = content.replace(
  "  res.status(201).json(new ApiResponse('Invoice generated successfully', { bill: resultBill }));",
  emailLogic
);

fs.writeFileSync(file, content);
console.log("Email logic added successfully");
