import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { slugify } from './category.controller.js';

const parseNumber = (val, fallback = 0) => {
  if (val === undefined || val === null || val === '' || val === 'NaN') return fallback;
  const num = Number(val);
  return Number.isNaN(num) ? fallback : num;
};

const parseIntNumber = (val, fallback = 0) => {
  if (val === undefined || val === null || val === '' || val === 'NaN') return fallback;
  const num = parseInt(val, 10);
  return Number.isNaN(num) ? fallback : num;
};

export const getProducts = asyncHandler(async (req, res, next) => {
  const { search, categoryId, status, page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const whereClause = {
    deletedAt: null
  };

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { title: { contains: search, mode: 'insensitive' } } }
    ];
  }

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  if (status) {
    whereClause.status = status;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: {
        category: { select: { id: true, title: true, slug: true } },
        images: { where: { deletedAt: null }, orderBy: { displayOrder: 'asc' } },
        pricing: true,
        inventory: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    }),
    prisma.product.count({ where: whereClause })
  ]);

  res.status(200).json(new ApiResponse('Products retrieved successfully', {
    products,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  }));
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const {
    sku,
    name,
    brand,
    description,
    unit,
    status,
    featured,
    specifications,
    applications,
    categoryId,
    purchasePrice,
    sellingPrice,
    defaultBillingRate,
    gstRate,
    hsnCode,
    currentStock,
    reorderLevel,
    seoTitle,
    seoDescription,
    seoKeywords
  } = req.body;

  if (!sku || !name || !unit || !categoryId) {
    return next(new ApiError(400, 'Missing required product parameters (sku, name, unit, categoryId)'));
  }

  const slug = slugify(name);

  // Validate unique SKU and slug
  const duplicate = await prisma.product.findFirst({
    where: {
      OR: [
        { sku },
        { slug }
      ],
      deletedAt: null
    }
  });

  if (duplicate) {
    return next(new ApiError(400, `Product SKU/Name collision detected. SKU or Title "${name}" is already taken.`));
  }

  // Parse JSON arrays/objects from multipart form payloads
  let specsObj = {};
  if (specifications) {
    specsObj = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
  }
  
  let appsArr = [];
  if (applications) {
    appsArr = typeof applications === 'string' ? JSON.parse(applications) : applications;
  }

  // Upload files to Cloudinary if they exist
  const imageUrls = [];
  if (req.files && req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      const uploadResult = await uploadToCloudinary(req.files[i].buffer, 'products');
      imageUrls.push({
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        displayOrder: i,
        isPrimary: i === 0
      });
    }
  }

  const initialStock = parseIntNumber(currentStock, 0);

  // Execute nested transaction write
  const product = await prisma.$transaction(async (tx) => {
    const newProduct = await tx.product.create({
      data: {
        sku,
        slug,
        name,
        brand: brand || null,
        description: description || '',
        unit,
        status: status || 'DRAFT',
        featured: featured === 'true' || featured === true,
        specifications: specsObj,
        applications: appsArr,
        categoryId,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
        createdById: req.user.id,
        updatedById: req.user.id,
        images: {
          create: imageUrls
        },
        pricing: {
          create: {
            purchasePrice: parseNumber(purchasePrice, 0),
            sellingPrice: parseNumber(sellingPrice, 0),
            defaultBillingRate: parseNumber(defaultBillingRate, 0),
            gstRate: parseNumber(gstRate, 18.00),
            hsnCode: hsnCode || ''
          }
        },
        inventory: {
          create: {
            currentStock: initialStock,
            reorderLevel: parseIntNumber(reorderLevel, 5),
            lastUpdatedBy: req.user.id
          }
        }
      },
      include: {
        pricing: true,
        inventory: true,
        images: true
      }
    });

    // Create audit log for initial stock creation
    if (initialStock > 0) {
      await tx.inventoryTransaction.create({
        data: {
          inventoryId: newProduct.inventory.id,
          type: 'STOCK_IN',
          quantity: initialStock,
          notes: 'Initial inventory quantity creation.',
          userId: req.user.id
        }
      });
    }

    return newProduct;
  });

  res.status(201).json(new ApiResponse('Product SKU created successfully', { product }));
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    sku,
    name,
    brand,
    description,
    unit,
    status,
    featured,
    specifications,
    applications,
    categoryId,
    purchasePrice,
    sellingPrice,
    defaultBillingRate,
    gstRate,
    hsnCode,
    reorderLevel,
    seoTitle,
    seoDescription,
    seoKeywords
  } = req.body;

  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: { pricing: true, inventory: true, images: true }
  });

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  const updateData = {
    updatedById: req.user.id
  };

  if (sku && sku !== product.sku) {
    const existingSku = await prisma.product.findFirst({
      where: { sku, deletedAt: null }
    });
    if (existingSku) return next(new ApiError(400, 'Product SKU is already in use by another record'));
    updateData.sku = sku;
  }

  if (name && name !== product.name) {
    const slug = slugify(name);
    const existingSlug = await prisma.product.findFirst({
      where: { slug, deletedAt: null }
    });
    if (existingSlug) return next(new ApiError(400, 'Product name collision detected'));
    updateData.name = name;
    updateData.slug = slug;
  }

  if (description !== undefined) updateData.description = description;
  if (brand !== undefined) updateData.brand = brand || null;
  if (unit !== undefined) updateData.unit = unit;
  if (status !== undefined) updateData.status = status;
  if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;
  if (categoryId !== undefined) updateData.categoryId = categoryId;
  if (seoTitle !== undefined) updateData.seoTitle = seoTitle || null;
  if (seoDescription !== undefined) updateData.seoDescription = seoDescription || null;
  if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords || null;

  if (specifications) {
    updateData.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
  }

  if (applications) {
    updateData.applications = typeof applications === 'string' ? JSON.parse(applications) : applications;
  }

  // Handle image files additions
  const newImages = [];
  if (req.files && req.files.length > 0) {
    // Check current image list length to set displayOrder
    const currentImagesCount = product.images.length;
    for (let i = 0; i < req.files.length; i++) {
      const uploadResult = await uploadToCloudinary(req.files[i].buffer, 'products');
      newImages.push({
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        displayOrder: currentImagesCount + i,
        isPrimary: currentImagesCount === 0 && i === 0
      });
    }
  }

  // Update inside transaction
  const updatedProduct = await prisma.$transaction(async (tx) => {
    // 1. Update Core
    const core = await tx.product.update({
      where: { id },
      data: {
        ...updateData,
        images: {
          create: newImages
        }
      },
      include: { images: true }
    });

    // 2. Update Pricing
    const pricingUpdate = {};
    if (purchasePrice !== undefined) pricingUpdate.purchasePrice = parseNumber(purchasePrice, 0);
    if (sellingPrice !== undefined) pricingUpdate.sellingPrice = parseNumber(sellingPrice, 0);
    if (defaultBillingRate !== undefined) pricingUpdate.defaultBillingRate = parseNumber(defaultBillingRate, 0);
    if (gstRate !== undefined) pricingUpdate.gstRate = parseNumber(gstRate, 18.00);
    if (hsnCode !== undefined) pricingUpdate.hsnCode = hsnCode;

    const updatedPricing = await tx.productPricing.update({
      where: { productId: id },
      data: pricingUpdate
    });

    // 3. Update Inventory parameters
    const inventoryUpdate = { lastUpdatedBy: req.user.id };
    if (reorderLevel !== undefined) inventoryUpdate.reorderLevel = parseIntNumber(reorderLevel, 5);

    const updatedInventory = await tx.inventory.update({
      where: { productId: id },
      data: inventoryUpdate
    });

    return {
      ...core,
      pricing: updatedPricing,
      inventory: updatedInventory
    };
  });

  res.status(200).json(new ApiResponse('Product updated successfully', { product: updatedProduct }));
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null }
  });

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  // Soft delete Product
  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() }
  });

  res.status(200).json(new ApiResponse('Product soft-deleted successfully'));
});
