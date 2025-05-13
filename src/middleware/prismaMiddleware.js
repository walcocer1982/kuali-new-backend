const prisma = require('../lib/prisma');

prisma.$use(async (params, next) => {
  try {
    const result = await next(params);
    return result;
  } catch (error) {
    if (error.code === 'P2021' || error.code === 'P2023') {
      // Reconexión automática en caso de error de conexión
      await prisma.$connect();
      return next(params);
    }
    throw error;
  }
}); 