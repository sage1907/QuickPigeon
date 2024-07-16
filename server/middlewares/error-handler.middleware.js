// 404 Handler
export const notFound = (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
};

export const globalErrorHandler = (err, req, res, next) => {
    // stack --> gives which line of code causes the error
    // message
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error",
        stack: err.stack || "No stack trace available",
    });
};