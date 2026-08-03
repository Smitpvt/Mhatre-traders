import prisma from './src/lib/prisma.js';
import { generateInvoicePdfBuffer } from './src/controllers/billing.controller.js';

async function test() {
  const bill = await prisma.bill.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });
  
  if (!bill) {
    console.log('No bills found');
    return;
  }
  
  console.log('Testing with bill:', bill.invoiceNumber);
  
  const settings = await prisma.setting.findMany();
  
  try {
    const buffer = await generateInvoicePdfBuffer(bill, settings);
    console.log('PDF generated successfully, size:', buffer.length);
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
}

test().catch(console.error).finally(() => process.exit(0));
