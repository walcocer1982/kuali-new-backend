const logError = (error, context) => {
  console.error({
    timestamp: new Date().toISOString(),
    context,
    error: {
      message: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta,
      name: error.name
    }
  });
};

const handlePrismaError = (error) => {
  switch (error.code) {
    case 'P2002':
      return {
        status: 409,
        message: 'Registro duplicado',
        details: `El campo ${error.meta?.target?.[0]} ya existe`
      };
    case 'P2025':
      return {
        status: 404,
        message: 'Registro no encontrado',
        details: error.meta?.cause
      };
    case 'P2003':
      return {
        status: 400,
        message: 'Violación de restricción de clave foránea',
        details: `El registro referenciado no existe: ${error.meta?.field_name}`
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