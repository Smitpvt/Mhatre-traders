import prisma from '../lib/prisma.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Batch 1: Catalog sizes and physical inventory
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

  let totalInventoryValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalInventoryItems = 0;

  allInventory.forEach(item => {
    const stock = item.currentStock;
    const reorder = item.reorderLevel;
    const purchaseCost = parseFloat(item.purchasePrice || 0);

    totalInventoryValue += stock * purchaseCost;
    totalInventoryItems += stock;

    if (stock === 0) {
      outOfStockCount++;
    } else if (stock <= reorder) {
      lowStockCount++;
    }
  });

  // Batch 2: Sales ledger filters aggregates
  const [todaySalesData, monthlySalesData, outstandingData, monthlyPurchasesData] = await Promise.all([
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
    }),
    prisma.inventoryTransaction.aggregate({
      _sum: { totalPrice: true },
      where: { type: 'PURCHASE', transactionDate: { gte: startOfMonth } }
    })
  ]);
  const todaySales = parseFloat(todaySalesData._sum.grandTotal || 0);
  const monthlySales = parseFloat(monthlySalesData._sum.grandTotal || 0);
  const outstandingPayments = parseFloat(outstandingData._sum.grandTotal || 0);
  const monthlyPurchases = parseFloat(monthlyPurchasesData._sum.totalPrice || 0);

  // Batch 3: Counts and recent documents lists
  const [totalBills, paidBillsCount, recentBills, recentActivity, recentPurchases] = await Promise.all([
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
    }),
    prisma.inventoryTransaction.findMany({
      where: { type: 'PURCHASE' },
      include: {
        inventory: {
          include: {
            product: { select: { name: true, sku: true, unit: true } }
          }
        },
        user: { select: { name: true } }
      },
      orderBy: { transactionDate: 'desc' },
      take: 5
    })
  ]);

  res.status(200).json(new ApiResponse('Dashboard statistics retrieved successfully', {
    totalCategories,
    totalProducts,
    totalInventoryValue,
    totalInventoryItems,
    lowStockCount,
    outOfStockCount,
    todaySales,
    monthlySales,
    outstandingPayments,
    monthlyPurchases,
    totalBills,
    paidBillsCount,
    recentBills,
    recentActivity,
    recentPurchases
  }));
});
