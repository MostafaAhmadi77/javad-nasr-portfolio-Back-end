const successResponse = (res, statusCode = 200, data) => {
  return res.status(statusCode).json({
    status: statusCode,
    success: true,
    data,
  });
};

const errorResponse = (res, statusCode = 500, message, data) => {
  return res.status(statusCode).json({
    status: statusCode,
    success: false,
    error: message,
    data,
  });
};

module.exports = { successResponse, errorResponse };