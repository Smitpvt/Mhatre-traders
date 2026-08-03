const fs = require('fs');
let content = fs.readFileSync('./src/controllers/billing.controller.js', 'utf8');

// 2. Destructure customerEmail and sendEmail
content = content.replace(
  /    transportDetails,\r?\n    items\r?\n  } = req\.body;/g,
  '    transportDetails,\n    items,\n    customerEmail,\n    sendEmail\n  } = req.body;'
);

// 3. Add to tx.bill.create data object
content = content.replace(
  /        customerPhone,\r?\n        customerGst: customerGst \|\| null,\r?\n        billingAddress,/g,
  '        customerPhone,\n        customerEmail: customerEmail || null,\n        customerGst: customerGst || null,\n        billingAddress,'
);

fs.writeFileSync('./src/controllers/billing.controller.js', content);
console.log('Regex replacements done');
