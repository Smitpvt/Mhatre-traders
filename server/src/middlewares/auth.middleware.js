import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from Authorization header or HTTP-only cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError(401, 'Authentication token missing'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Stub user payload for Phase 1 routing context
    req.user = {
      id: decoded.id || 'stub-uuid',
      email: decoded.email || 'admin@mhatretraders.com',
      role: decoded.role || 'ADMIN'
    };

    next();
  } catch (error) {
    return next(new ApiError(401, 'Session invalid or expired'));
  }
});

/**
 * Access control filter targeting specific client authorization levels
 * @param {...string} allowedRoles - Set of whitelisted roles (e.g. 'SUPER_ADMIN', 'ADMIN')
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User authentication session not initialized'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Access denied: Insufficient privileges'));
    }

    next();
  };
};
