import prisma from './src/lib/prisma.js';

async function main() {
  console.log('Warmup connection first...');
  await prisma.product.count({ where: { deletedAt: null } });

  console.log('Testing Batch 1...');
  let start = Date.now();
  try {
    const [totalCategories, totalProducts, allInventory] = await Promise.all([
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.$queryRaw`
        SELECT 
          i."currentStock",
          i."reorderLevel",
          pp."purchasePrice"
        FROM "Inventory" i
        JOIN "Product" p ON i."productId" = p.id
        LEFT JOIN "ProductPricing" pp ON p.id = pp."productId"
        WHERE p."deletedAt" IS NULL
      `
    ]);
    console.log('Batch 1 took (ms):', Date.now() - start);
    console.log('Loaded inventory items:', allInventory.length);

    console.log('Testing Batch 2...');
    start = Date.now();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [todaySalesData, monthlySalesData, outstandingData] = await Promise.all([
      prisma.bill.aggregate({
        _sum: { grandTotal: true },
        where: { deletedAt: null, createdAt: { gte: startOfToday } }
      }),
      prisma.bill.aggregate({
        _sum: { grandTotal: true },
        where: { deletedAt: null, createdAt: { gte: startOfMonth } }
      }),
      prisma.bill.aggregate({
        _sum: { grandTotal: true },
        where: { deletedAt: null, paymentStatus: { in: ['PENDING', 'PARTIAL'] } }
      })
    ]);
    console.log('Batch 2 took (ms):', Date.now() - start);

    console.log('Testing Batch 3...');
    start = Date.now();
    const [totalBills, paidBillsCount, recentBills, recentActivity] = await Promise.all([
      prisma.bill.count({ where: { deletedAt: null } }),
      prisma.bill.count({ where: { deletedAt: null, paymentStatus: 'PAID' } }),
      prisma.bill.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.inventoryTransaction.findMany({
        include: {
          inventory: {
            include: {
              product: { select: { name: true, sku: true } }
            }
          },
          user: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);
    console.log('Batch 3 took (ms):', Date.now() - start);
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
