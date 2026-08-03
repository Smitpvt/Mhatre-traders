const fs = require('fs');
let content = fs.readFileSync('./src/controllers/billing.controller.js', 'utf8');

// 1. Add sendInvoiceEmail import if not exists
if (!content.includes('sendInvoiceEmail')) {
  content = "import { sendInvoiceEmail } from '../utils/mailer.js';\n" + content;
}

// 2. Destructure customerEmail and sendEmail
content = content.replace(
  '    transportDetails,\n    items\n  } = req.body;',
  '    transportDetails,\n    items,\n    customerEmail,\n    sendEmail\n  } = req.body;'
);

// 3. Add to tx.bill.create data object
content = content.replace(
  '        customerPhone,\n        customerGst: customerGst || null,\n        billingAddress,',
  '        customerPhone,\n        customerEmail: customerEmail || null,\n        customerGst: customerGst || null,\n        billingAddress,'
);

// 4. Add email sending logic at the end of createBill
const emailLogic = `  if (sendEmail && customerEmail) {
    try {
      const settings = await prisma.setting.findMany();
      const pdfBuffer = await generateInvoicePdfBuffer(resultBill, settings);
      await sendInvoiceEmail(customerEmail, resultBill.invoiceNumber, pdfBuffer);
    } catch (err) {
      console.error('Failed to send invoice email after bill creation:', err);
    }
  }

  res.status(201).json(new ApiResponse('Invoice generated successfully', { bill: resultBill }));`;

content = content.replace(
  "  res.status(201).json(new ApiResponse('Invoice generated successfully', { bill: resultBill }));",
  emailLogic
);

fs.writeFileSync('./src/controllers/billing.controller.js', content);
console.log('Fixed email logic successfully');
