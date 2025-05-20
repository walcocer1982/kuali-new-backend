const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware para logging y manejo de errores
prisma.$use(async (params, next) => {
  const startTime = Date.now();
  try {
    const result = await next(params);
    const endTime = Date.now();
    console.log(`[Prisma] ${params.model}.${params.action} completado en ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    console.error(`[Prisma Error] ${params.model}.${params.action} falló:`, error);
    
    // Manejo específico de errores de Prisma
    if (error?.code?.startsWith('P2')) {
      if (error.code === 'P2021' || error.code === 'P2023') {
        console.log('[Prisma] Intentando reconexión...');
        await prisma.$connect();
        return next(params);
      }
    }
    throw error;
  }
});

// Manejo de señales del sistema
process.on('SIGINT', async () => {
  console.log('[Prisma] Desconectando debido a SIGINT...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('[Prisma] Desconectando debido a SIGTERM...');
  await prisma.$disconnect();
  process.exit(0);
});

// Verificación inicial de conexión
async function verifyConnection() {
  try {
    await prisma.$connect();
    console.log('[Prisma] ✅ Conexión establecida exitosamente');
  } catch (error) {
    console.error('[Prisma] ❌ Error al establecer conexión:', error);
    throw error;
  }
}

// Verificar conexión al iniciar
verifyConnection().catch((error) => {
  console.error('[Prisma] Error fatal en la inicialización:', error);
  process.exit(1);
});

module.exports = prisma; 