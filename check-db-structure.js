const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseStructure() {
  try {
    // Verificar la estructura de Template
    const templateExample = await prisma.template.findFirst({
      select: {
        id: true,
        title: true,
        body: true,
        type: true,
        stepsJson: true,
        tags: true,
        productId: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    console.log('Estructura de Template:', templateExample ? Object.keys(templateExample) : 'No hay templates');
    
    // Verificar si existen las relaciones
    const templateWithRelations = await prisma.template.findFirst({
      include: {
        product: true,
        contactLogs: true
      }
    });
    
    console.log('\nRelaciones existentes:', 
      templateWithRelations ? 
      Object.keys(templateWithRelations).filter(key => typeof templateWithRelations[key] === 'object') :
      'No hay templates con relaciones'
    );

  } catch (error) {
    console.error('Error al verificar estructura:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStructure(); 