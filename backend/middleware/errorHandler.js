const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for development
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const value = err.keyValue[field];
        const message = `Duplicate field value: ${value}. Please use another value.`;
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please log in again.';
        error = { message, statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired. Please log in again.';
        error = { message, statusCode: 401 };
    }

    // Default error
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export default errorHandler;