import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Global centralized error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, normalize it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], false, err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(env.isDevelopment && {
      stack: error.stack,
    }),
  };

  // Log 500 errors in console
  if (error.statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
  }

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
