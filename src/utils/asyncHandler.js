/**
 * Wrapper for async route controllers to catch errors and forward to next()
 * @param {Function} fn
 * @returns {import('express').RequestHandler}
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
