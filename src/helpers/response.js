const respondWithResult = (res, result, statusCode) => {
    statusCode = statusCode || 200;
    res.status(statusCode).json({ 'message': result.message, 'data': result.data });
}

const handleError = (res, err, statusCode) => {
    statusCode = statusCode || 500;
    res.status(statusCode).json({ 'err': err.name, 'message': err.message });
}

module.exports = {
    respondWithResult,
    handleError
}