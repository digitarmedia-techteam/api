/**
 * Custom application error class for standardizing HTTP error responses
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error description
   * @param {Array<any>} errors - Additional error details or validation errors
   * @param {boolean} isOperational - Indicates whether error is known operational error
   * @param {string} stack - Stack trace
   */
  constructor(statusCode, message = 'Something went wrong', errors = [], isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden access') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Resource conflict') {
    return new ApiError(409, message);
  }

  static unprocessableEntity(message = 'Unprocessable Entity', errors = []) {
    return new ApiError(422, message, errors);
  }

  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message, [], false);
  }
}

export default ApiError;
