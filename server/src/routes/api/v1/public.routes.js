import { Router } from 'express';
import prisma from '../../../lib/prisma.js';
import { ApiResponse } from '../../../utils/apiResponse.js';
import { ApiError } from '../../../utils/apiError.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { createEnquiry } from '../../../controllers/enquiry.controller.js';
import { createEnquiryValidator } from '../../../validators/enquiry.validator.js';
import { validateRequest } from '../../../middlewares/validator.js';

const router = Router();

// 1. Fetch all visible Categories for public catalog
router.get('/categories', asyncHandler(async (req, res, next) => {
  const { search } = req.query;

  const whereClause = {
    visibility: true,
    deletedAt: null
  };

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const categories = await prisma.category.findMany({
    where: whereClause,
    orderBy: { displayOrder: 'asc' }
  });

  res.status(200).json(new ApiResponse('Categories retrieved successfully', { categories }));
}));

// 2. Fetch Category details by slug along with visible active products
router.get('/categories/:slug', asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const category = await prisma.category.findFirst({
    where: {
      slug,
      visibility: true,
      deletedAt: null
    },
    include: {
      products: {
        where: {
          status: 'ACTIVE',
          deletedAt: null
        },
        include: {
          images: {
            where: { deletedAt: null },
            orderBy: { displayOrder: 'asc' }
          },
          inventory: { select: { currentStock: true } }
        }
      }
    }
  });

  if (!category) {
    return next(new ApiError(404, 'Category not found'));
  }

  // Format products to hide inventory values but indicate availability
  const sanitizedProducts = category.products.map(p => {
    const inStock = p.inventory ? p.inventory.currentStock > 0 : false;
    const { inventory, ...rest } = p;
    return { ...rest, inStock };
  });

  res.status(200).json(new ApiResponse('Category details retrieved successfully', {
    category: {
      ...category,
      products: sanitizedProducts
    }
  }));
}));

// 3. Fetch all active Products (excluding pricing metadata)
router.get('/products', asyncHandler(async (req, res, next) => {
  const { search, categorySlug } = req.query;

  const whereClause = {
    status: 'ACTIVE',
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

  if (categorySlug) {
    whereClause.category = {
      slug: categorySlug,
      deletedAt: null
    };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: { select: { title: true, slug: true } },
      images: {
        where: { deletedAt: null },
        orderBy: { displayOrder: 'asc' }
      },
      inventory: { select: { currentStock: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const sanitizedProducts = products.map(p => {
    const inStock = p.inventory ? p.inventory.currentStock > 0 : false;
    const { inventory, ...rest } = p;
    return { ...rest, inStock };
  });

  res.status(200).json(new ApiResponse('Products retrieved successfully', { products: sanitizedProducts }));
}));

// 4. Fetch a single Product details by slug (excluding pricing metadata)
router.get('/products/:slug', asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: 'ACTIVE',
      deletedAt: null
    },
    include: {
      category: { select: { id: true, title: true, slug: true } },
      images: {
        where: { deletedAt: null },
        orderBy: { displayOrder: 'asc' }
      },
      inventory: { select: { currentStock: true } }
    }
  });

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  const inStock = product.inventory ? product.inventory.currentStock > 0 : false;
  const { inventory, ...rest } = product;

  res.status(200).json(new ApiResponse('Product details retrieved successfully', {
    product: { ...rest, inStock }
  }));
}));

// 5. Submit a customer enquiry/quotation request
router.post('/enquiries', createEnquiryValidator, validateRequest, createEnquiry);

export default router;
