const logError = (error, functionName) => {
    console.error(`Error en ${functionName}:`, {
        message: error.message,
        stack: error.stack,
        code: error.code
    });
};

const logInfo = (message, data = {}) => {
    console.log(message, data);
};

const logWarning = (message, data = {}) => {
    console.warn(message, data);
};

module.exports = {
    logError,
    logInfo,
    logWarning
}; 