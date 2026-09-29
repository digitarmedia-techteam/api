import { ApiError } from '../utils/apiError.js';

/**
 * 404 Not Found Middleware for unhandled endpoints
 */
export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Endpoint not found: [${req.method}] ${req.originalUrl}`));
};

export default notFoundHandler;
