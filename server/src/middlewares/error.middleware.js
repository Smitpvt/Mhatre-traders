import { logger } from './logging.middleware.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Transform non-operational errors into formatted ApiErrors
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : error.message;
    
    // Check for Prisma validation/connection errors and format appropriately
    let subErrors = [];
    if (error.code && error.code.startsWith('P2')) {
      // Prisma error code prefix
      subErrors = [{ field: 'database', message: 'Database transaction error occurred' }];
    }
    
    error = new ApiError(statusCode, message, subErrors);
  }

  const { statusCode, message, errors } = error;

  // Structured logging of the error trace
  logger.error({
    msg: err.message,
    statusCode,
    errors,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  const responseBody = {
    success: false,
    message,
    errors: errors || []
  };

  // Expose stack trace details ONLY in development/testing mode
  if (env.NODE_ENV === 'development') {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};

export default errorHandler;
