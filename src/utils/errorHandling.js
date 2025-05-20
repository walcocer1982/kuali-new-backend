const logError = (error, context) => {
    console.error(`Error en ${context}:`, error);
};

const handlePrismaError = (error) => {
    switch (error.code) {
        case 'P2002':
            return {
                status: 400,
                message: 'Ya existe un registro con estos datos',
                details: error.meta?.target || error.message
            };
        case 'P2014':
            return {
                status: 400,
                message: 'El registro está siendo utilizado por otras entidades',
                details: error.message
            };
        case 'P2025':
            return {
                status: 404,
                message: 'Registro no encontrado',
                details: error.message
            };
        default:
            return {
                status: 500,
                message: 'Error interno del servidor',
                details: error.message
            };
    }
};

module.exports = {
    logError,
    handlePrismaError
}; 