module.exports = (err, req, res, next) => {
    const statusCode =
        err.name === "ValidationError" ? 422 : err.status || 500;

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message:
            statusCode === 422
                ? err.errors || err.message
                : statusCode === 500
                    ? "An internal server error occurred."
                    : err.message || "An error occurred."
    });
};