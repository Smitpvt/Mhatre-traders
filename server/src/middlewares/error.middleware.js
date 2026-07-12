import { logger } from './logging.middleware.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Transform non-operational errors into formatted ApiErrors
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = statusCode === 500 ? 'Internal Server Error' : error.message;
    let subErrors = [];
    
    // Check for Prisma validation/connection errors and format appropriately
    if (error.code === 'P2002') {
      statusCode = 409;
      const fields = error.meta?.target || ['field'];
      message = `Conflict: A record with this unique value (${fields.join(', ')}) already exists.`;
      subErrors = [{ field: fields[0], message: 'Must be unique' }];
    } else if (error.code === 'P2003') {
      statusCode = 400;
      message = 'Database relation error: One or more referenced records do not exist.';
      subErrors = [{ field: 'database', message: 'Foreign key constraint violation' }];
    } else if (error.code === 'P2025') {
      statusCode = 404;
      message = error.meta?.cause || 'Requested database record not found.';
      subErrors = [{ field: 'database', message: 'Record not found' }];
    } else if (error.code && error.code.startsWith('P2')) {
      statusCode = 400;
      message = 'Database constraint error occurred.';
      subErrors = [{ field: 'database', message: `Prisma code ${error.code}` }];
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
