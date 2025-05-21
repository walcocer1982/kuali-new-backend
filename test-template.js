const { PrismaClient, TemplateType } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTemplateCreation() {
  try {
    console.log('Tipos de plantilla disponibles:', Object.values(TemplateType));

    const templateData = {
      title: 'Plantilla de prueba',
      body: 'Contenido de prueba',
      type: TemplateType.WELCOME,
      tags: ['test', 'prueba'],
      stepsJson: [
        {
          step: 'Paso 1',
          salesperson_response: 'Respuesta del vendedor',
          client_response: 'Respuesta del cliente'
        }
      ]
    };

    console.log('\nIntentando crear plantilla con:', templateData);

    const newTemplate = await prisma.template.create({
      data: templateData,
      include: {
        product: true
      }
    });

    console.log('\nPlantilla creada exitosamente:', newTemplate);
  } catch (error) {
    console.error('\nError al crear la plantilla:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTemplateCreation(); 