import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getInventory = asyncHandler(async (req, res, next) => {
  const { search, filterType, page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build where clause based on search and stock type
  const whereClause = {
    product: {
      deletedAt: null
    }
  };

  if (search) {
    whereClause.product = {
      deletedAt: null,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    };
  }

  if (filterType === 'LOW_STOCK') {
    // currentStock <= reorderLevel && currentStock > 0
    whereClause.currentStock = {
      gt: 0
    };
    whereClause.AND = [
      {
        currentStock: {
          lte: prisma.inventory.fields.reorderLevel
        }
      }
    ];
  } else if (filterType === 'OUT_OF_STOCK') {
    whereClause.currentStock = 0;
  }

  // Note: Prisma 5 doesn't easily support raw field comparison without raw query or manual filters if fields differ
  // Let's load the data, and if a filter is set, we do it in memory or query with prisma.
  // Wait, let's fetch all records if they aren't huge, or construct a where clause.
  // Since we want standard behavior, we can fetch all records matching deletedAt: null, and filter/paginate in memory or query safely.
  // Actually, to make it fast and support pagination natively, we can fetch inventory with product information:
  const allInventory = await prisma.inventory.findMany({
    where: {
      product: {
        deletedAt: null,
        OR: search ? [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } }
        ] : undefined
      }
    },
    include: {
      product: {
        include: {
          category: { select: { title: true } }
        }
      }
    },
    orderBy: { currentStock: 'asc' }
  });

  // Filter in memory for precise reorderLevel logic
  let filtered = allInventory;
  if (filterType === 'LOW_STOCK') {
    filtered = allInventory.filter(item => item.currentStock <= item.reorderLevel && item.currentStock > 0);
  } else if (filterType === 'OUT_OF_STOCK') {
    filtered = allInventory.filter(item => item.currentStock === 0);
  }

  const total = filtered.length;
  const paginatedInventory = filtered.slice(skip, skip + limitNum);

  res.status(200).json(new ApiResponse('Inventory retrieved successfully', {
    inventory: paginatedInventory,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  }));
});

export const adjustStock = asyncHandler(async (req, res, next) => {
  const { productId, quantity, type, notes } = req.body;

  if (!productId || quantity === undefined || !type) {
    return next(new ApiError(400, 'Missing adjust parameters (productId, quantity, type)'));
  }

  const qtyInt = parseInt(quantity);
  if (isNaN(qtyInt)) {
    return next(new ApiError(400, 'Adjustment quantity must be an integer'));
  }

  const validTypes = ['PURCHASE', 'BILL', 'STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT'];
  if (!validTypes.includes(type)) {
    return next(new ApiError(400, `Invalid transaction type. Allowed: ${validTypes.join(', ')}`));
  }

  const result = await prisma.$transaction(async (tx) => {
    const inventory = await tx.inventory.findUnique({
      where: { productId }
    });

    if (!inventory) {
      throw new ApiError(404, 'Product inventory profile not found');
    }

    const newStock = inventory.currentStock + qtyInt;
    if (newStock < 0) {
      throw new ApiError(400, `Transaction rejected. Resulting stock level (${newStock}) cannot be negative.`);
    }

    const updated = await tx.inventory.update({
      where: { productId },
      data: {
        currentStock: newStock,
        lastUpdatedBy: req.user.id
      },
      include: {
        product: { select: { name: true, sku: true } }
      }
    });

    await tx.inventoryTransaction.create({
      data: {
        inventoryId: inventory.id,
        type,
        quantity: qtyInt,
        notes: notes || `Manual stock adjustment of ${qtyInt} units.`,
        userId: req.user.id
      }
    });

    return updated;
  });

  res.status(200).json(new ApiResponse('Stock levels adjusted successfully', { inventory: result }));
});

export const getInventoryHistory = asyncHandler(async (req, res, next) => {
  const { productId, page = 1, limit = 20 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const whereClause = {};
  if (productId) {
    whereClause.inventory = { productId };
  }

  const [history, total] = await Promise.all([
    prisma.inventoryTransaction.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true } },
        inventory: {
          include: {
            product: { select: { name: true, sku: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    }),
    prisma.inventoryTransaction.count({ where: whereClause })
  ]);

  res.status(200).json(new ApiResponse('Inventory history logs retrieved', {
    history,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  }));
});

export const updateInventory = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { currentStock, reorderLevel, unit, increaseStock, reduceStock } = req.body;

  const result = await prisma.$transaction(async (tx) => {
    const inventory = await tx.inventory.findUnique({
      where: { productId },
      include: { product: true }
    });

    if (!inventory) {
      throw new ApiError(404, 'Product inventory profile not found');
    }

    let updatedStock = inventory.currentStock;
    let adjustmentNotes = '';
    let adjustmentQty = 0;

    if (currentStock !== undefined) {
      const parsedStock = parseInt(currentStock);
      if (!isNaN(parsedStock) && parsedStock !== inventory.currentStock) {
        adjustmentQty = parsedStock - inventory.currentStock;
        updatedStock = parsedStock;
        adjustmentNotes = `Direct stock level overwrite from ${inventory.currentStock} to ${parsedStock}`;
      }
    }

    if (increaseStock !== undefined) {
      const parsedInc = parseInt(increaseStock);
      if (!isNaN(parsedInc) && parsedInc > 0) {
        adjustmentQty = parsedInc;
        updatedStock += parsedInc;
        adjustmentNotes = `Increased stock by ${parsedInc} units`;
      }
    } else if (reduceStock !== undefined) {
      const parsedDec = parseInt(reduceStock);
      if (!isNaN(parsedDec) && parsedDec > 0) {
        adjustmentQty = -parsedDec;
        updatedStock -= parsedDec;
        adjustmentNotes = `Reduced stock by ${parsedDec} units`;
      }
    }

    if (updatedStock < 0) {
      throw new ApiError(400, `Resulting stock level (${updatedStock}) cannot be negative.`);
    }

    // 1. Update Inventory
    const updatedInventory = await tx.inventory.update({
      where: { productId },
      data: {
        currentStock: updatedStock,
        reorderLevel: reorderLevel !== undefined ? parseInt(reorderLevel) : undefined,
        lastUpdatedBy: req.user.id
      },
      include: {
        product: true
      }
    });

    // 2. Update Product unit if provided
    if (unit !== undefined) {
      await tx.product.update({
        where: { id: productId },
        data: { unit }
      });
    }

    // 3. Log transaction if stock changed
    if (adjustmentQty !== 0) {
      await tx.inventoryTransaction.create({
        data: {
          inventoryId: inventory.id,
          type: adjustmentQty > 0 ? 'STOCK_IN' : 'STOCK_OUT',
          quantity: adjustmentQty,
          notes: adjustmentNotes || 'Manual stock update',
          userId: req.user.id
        }
      });
    }

    return updatedInventory;
  });

  res.status(200).json(new ApiResponse('Inventory updated successfully', { inventory: result }));
});

export const recordPurchase = asyncHandler(async (req, res, next) => {
  const { productId, manualProductName, manualProductUnit, quantity, supplierName, unitPrice, totalPrice, transactionDate } = req.body;

  if ((!productId && !manualProductName) || quantity === undefined || !supplierName || unitPrice === undefined || totalPrice === undefined) {
    return next(new ApiError(400, 'Missing purchase parameters (must provide Product or Manual Name)'));
  }

  const qtyInt = parseInt(quantity);
  if (isNaN(qtyInt) || qtyInt <= 0) {
    return next(new ApiError(400, 'Purchase quantity must be a positive integer'));
  }

  const result = await prisma.$transaction(async (tx) => {
    let inventoryId = null;
    let updatedInventory = null;

    if (productId) {
      const inventory = await tx.inventory.findUnique({
        where: { productId }
      });

      if (!inventory) {
        throw new ApiError(404, 'Product inventory profile not found');
      }

      inventoryId = inventory.id;
      const newStock = inventory.currentStock + qtyInt;

      updatedInventory = await tx.inventory.update({
        where: { productId },
        data: {
          currentStock: newStock,
          lastUpdatedBy: req.user.id
        },
        include: {
          product: { select: { name: true, sku: true } }
        }
      });
    }

    const transaction = await tx.inventoryTransaction.create({
      data: {
        inventoryId,
        type: 'PURCHASE',
        quantity: qtyInt,
        notes: `Purchase from ${supplierName}`,
        userId: req.user.id,
        supplierName,
        unitPrice: parseFloat(unitPrice),
        totalPrice: parseFloat(totalPrice),
        transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
        manualProductName: !productId ? manualProductName : null,
        manualProductUnit: manualProductUnit || 'PIECE'
      }
    });

    return { inventory: updatedInventory, transaction };
  });

  res.status(201).json(new ApiResponse('Purchase recorded successfully', result));
});
