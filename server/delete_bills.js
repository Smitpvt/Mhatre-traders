import prisma from './src/lib/prisma.js';

async function main() {
  const result = await prisma.bill.deleteMany({});
  console.log('Deleted bills:', result.count);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
