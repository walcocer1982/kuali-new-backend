const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getTemplates() {
  try {
    const templates = await prisma.template.findMany({
      include: {
        product: true
      }
    });
    console.log('Plantillas encontradas:', templates.length);
    console.log(JSON.stringify(templates, null, 2));
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getTemplates(); 