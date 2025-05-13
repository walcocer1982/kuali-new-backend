const { PrismaClient } = require('@prisma/client');

let prisma;

const initPrisma = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está definida en las variables de entorno');
  }

  try {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn'],
      errorFormat: 'pretty'
    });

    // Middleware para logging
    prisma.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      
      console.log(`Prisma Query ${params.model}.${params.action} tomó ${after - before}ms`);
      return result;
    });

    // Verificar conexión
    return prisma.$connect()
      .then(() => {
        console.log('✅ Conexión a la base de datos establecida');
        return prisma;
      })
      .catch((error) => {
        console.error('❌ Error al conectar con la base de datos:', error);
        throw error;
      });

  } catch (error) {
    console.error('❌ Error al inicializar Prisma:', error);
    throw error;
  }
};

// Inicializar Prisma
if (!prisma) {
  initPrisma()
    .catch((error) => {
      console.error('❌ Error fatal al inicializar Prisma:', error);
      process.exit(1);
    });
}

module.exports = prisma; 