const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTemplateValues() {
  try {
    const template = await prisma.template.findFirst({
      select: {
        id: true,
        title: true,
        body: true,
        type: true,
        stepsJson: true,
        tags: true,
        productId: true,
        product: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    console.log('Ejemplo de plantilla:');
    console.log('---------------------');
    console.log('Type:', template.type);
    console.log('StepsJson:', template.stepsJson);
    console.log('Tags:', template.tags);
    console.log('Product:', template.product);
    
    // Contar plantillas por tipo
    const templatesByType = await prisma.template.groupBy({
      by: ['type'],
      _count: true
    });
    
    console.log('\nConteo por tipo:');
    console.log('---------------');
    console.log(templatesByType);
    
  } catch (error) {
    console.error('Error al verificar valores:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTemplateValues(); 