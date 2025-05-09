const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Configuración del pool de conexiones
  __internal: {
    engine: {
      connectionTimeout: 5000,
      connectionLimit: 5,
      queueLimit: 7,
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
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

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