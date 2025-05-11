const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Configuración optimizada del pool de conexiones
  __internal: {
    engine: {
      connectionTimeout: 60000,    // 60 segundos
      connectionLimit: 10,         // Aumentado para mejor manejo de carga
      queueLimit: 15,             // Cola más grande para manejar picos de tráfico
      enableReadReplication: false
    }
  }
});

// Manejador de desconexión usando process
process.on('beforeExit', async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

// Manejar señales de terminación
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Cleaning up...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Cleaning up...');
  await prisma.$disconnect();
  process.exit(0);
});

// Verificar la conexión a la base de datos con reintentos
const MAX_RETRIES = 5;           // Aumentado número de reintentos
const RETRY_DELAY = 10000;       // Aumentado delay entre intentos a 10 segundos

async function connectWithRetry(retryCount = 0) {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection in ${RETRY_DELAY/1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      setTimeout(() => connectWithRetry(retryCount + 1), RETRY_DELAY);
    } else {
      console.error('Max retries reached. Exiting...');
      process.exit(1);
    }
  }
}

// Iniciar conexión con reintentos
connectWithRetry();

module.exports = prisma; 