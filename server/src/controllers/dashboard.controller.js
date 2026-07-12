import prisma from '../lib/prisma.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Run all 12 independent database queries parallelly in a single Promise.all block
  const [
    totalCategories,
    totalProducts,
    allInventory,
    todaySalesData,
    monthlySalesData,
    outstandingData,
    monthlyPurchasesData,
    totalBills,
    paidBillsCount,
    recentBills,
    recentActivity,
    recentPurchases
  ] = await Promise.all([
    // Catalog size check
    prisma.category.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null } }),
    
    // Core physical inventory pricing lookup
    prisma.$queryRaw`
      SELECT 
        i."currentStock",
        i."reorderLevel",
        pp."purchasePrice"
      FROM "Inventory" i
      JOIN "Product" p ON i."productId" = p.id
      LEFT JOIN "ProductPricing" pp ON p.id = pp."productId"
      WHERE p."deletedAt" IS NULL
    `,

    // Daily Sales aggregate
    prisma.bill.aggregate({
      _sum: { grandTotal: true },
      where: { deletedAt: null, createdAt: { gte: startOfToday } }
    }),

    // Monthly Sales aggregate
    prisma.bill.aggregate({
      _sum: { grandTotal: true },
      where: { deletedAt: null, createdAt: { gte: startOfMonth } }
    }),

    // Outstanding Payments aggregate
    prisma.bill.aggregate({
      _sum: { grandTotal: true },
      where: { deletedAt: null, paymentStatus: { in: ['PENDING', 'PARTIAL'] } }
    }),

    // Monthly Purchases aggregate
    prisma.inventoryTransaction.aggregate({
      _sum: { totalPrice: true },
      where: { type: 'PURCHASE', transactionDate: { gte: startOfMonth } }
    }),

    // Total Invoices counter
    prisma.bill.count({ where: { deletedAt: null } }),

    // Total Paid Invoices counter
    prisma.bill.count({ where: { deletedAt: null, paymentStatus: 'PAID' } }),

    // Recent Invoice documents
    prisma.bill.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),

    // Recent Inventory operations log
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

    // Recent Vendor Supplier purchases log
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

  // Process core physical inventory parameters in-memory
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

  const todaySales = parseFloat(todaySalesData._sum.grandTotal || 0);
  const monthlySales = parseFloat(monthlySalesData._sum.grandTotal || 0);
  const outstandingPayments = parseFloat(outstandingData._sum.grandTotal || 0);
  const monthlyPurchases = parseFloat(monthlyPurchasesData._sum.totalPrice || 0);

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
