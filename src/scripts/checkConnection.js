require('dotenv').config();
const prisma = require('../lib/prisma');

async function checkConnection() {
  try {
    // Intentar una consulta simple
    const result = await prisma.lead.count();
    console.log('✅ Conexión exitosa');
    console.log(`📊 Número de leads en la base de datos: ${result}`);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Si el script se ejecuta directamente
if (require.main === module) {
  checkConnection()
    .then(success => {
      if (!success) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Error inesperado:', error);
      process.exit(1);
    });
}

module.exports = checkConnection; 