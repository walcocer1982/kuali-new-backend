const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://database_owner:npg_8b4RljJmeVhH@ep-hidden-band-a4faipgl-pooler.us-east-1.aws.neon.tech/database?sslmode=require"
    }
  }
});

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

testConnection(); 