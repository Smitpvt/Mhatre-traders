import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Reusable slugify helper
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const getCategories = asyncHandler(async (req, res, next) => {
  const { search, visibility, page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const whereClause = {
    deletedAt: null
  };

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (visibility) {
    whereClause.visibility = visibility === 'true';
  }

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where: whereClause,
      orderBy: { displayOrder: 'asc' },
      skip,
      take: limitNum
    }),
    prisma.category.count({ where: whereClause })
  ]);

  res.status(200).json(new ApiResponse('Categories retrieved successfully', {
    categories,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  }));
});

export const createCategory = asyncHandler(async (req, res, next) => {
  const { title, description, displayOrder, visibility } = req.body;

  if (!title) {
    return next(new ApiError(400, 'Title is required'));
  }

  const slug = slugify(title);
  
  // Verify slug uniqueness
  const existingCategory = await prisma.category.findUnique({
    where: { slug }
  });
  
  if (existingCategory && !existingCategory.deletedAt) {
    return next(new ApiError(400, `Category with title "${title}" already exists`));
  }

  if (!req.file) {
    return next(new ApiError(400, 'Category image is required'));
  }

  // Upload image to Cloudinary
  const uploadResult = await uploadToCloudinary(req.file.buffer, 'categories');

  const category = await prisma.category.create({
    data: {
      title,
      slug,
      description: description || '',
      imageUrl: uploadResult.url,
      visibility: visibility === 'true' || visibility === true,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      createdById: req.user.id,
      updatedById: req.user.id
    }
  });

  res.status(201).json(new ApiResponse('Category created successfully', { category }));
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, displayOrder, visibility } = req.body;

  const category = await prisma.category.findFirst({
    where: { id, deletedAt: null }
  });

  if (!category) {
    return next(new ApiError(404, 'Category not found'));
  }

  const updateData = {
    updatedById: req.user.id
  };

  if (title) {
    const slug = slugify(title);
    if (slug !== category.slug) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug }
      });
      if (existingCategory && !existingCategory.deletedAt) {
        return next(new ApiError(400, `Category with title "${title}" already exists`));
      }
      updateData.title = title;
      updateData.slug = slug;
    }
  }

  if (description !== undefined) updateData.description = description;
  if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
  if (visibility !== undefined) updateData.visibility = visibility === 'true' || visibility === true;

  if (req.file) {
    // Upload new image, but do NOT delete old image to comply with data safety guidelines
    const uploadResult = await uploadToCloudinary(req.file.buffer, 'categories');
    updateData.imageUrl = uploadResult.url;
  } else if (req.body.deleteImage === 'true' || req.body.deleteImage === true) {
    updateData.imageUrl = "";
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: updateData
  });

  res.status(200).json(new ApiResponse('Category updated successfully', { category: updatedCategory }));
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await prisma.category.findFirst({
    where: { id, deletedAt: null }
  });

  if (!category) {
    return next(new ApiError(404, 'Category not found'));
  }

  // Check if any non-deleted products exist in this category
  const activeProductsCount = await prisma.product.count({
    where: {
      categoryId: id,
      deletedAt: null
    }
  });

  if (activeProductsCount > 0) {
    return next(new ApiError(400, `Cannot delete category: It contains ${activeProductsCount} active product SKU(s).`));
  }

  // Soft delete Category
  await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() }
  });

  res.status(200).json(new ApiResponse('Category deleted successfully'));
});
