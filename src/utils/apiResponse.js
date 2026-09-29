/**
 * Standardized API response format helpers
 */
export class ApiResponse {
  /**
   * Send a JSON success response
   * @param {import('express').Response} res
   * @param {Object} options
   * @param {number} [options.statusCode=200]
   * @param {string} [options.message='Success']
   * @param {any} [options.data=null]
   * @param {Object} [options.meta=null]
   */
  static success(res, { statusCode = 200, message = 'Success', data = null, meta = null } = {}) {
    const payload = {
      success: true,
      statusCode,
      message,
      data,
    };

    if (meta !== null && meta !== undefined) {
      payload.meta = meta;
    }

    return res.status(statusCode).json(payload);
  }

  /**
   * 201 Created response
   */
  static created(res, { message = 'Resource created successfully', data = null, meta = null } = {}) {
    return ApiResponse.success(res, { statusCode: 201, message, data, meta });
  }

  /**
   * 204 No Content response
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Paginated response helper
   */
  static paginated(res, { message = 'Data retrieved successfully', data = [], page = 1, limit = 10, total = 0 } = {}) {
    const totalPages = Math.ceil(total / limit) || 1;
    return ApiResponse.success(res, {
      statusCode: 200,
      message,
      data,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }
}

export default ApiResponse;
