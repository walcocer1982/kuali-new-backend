const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDuplicateProducts() {
  try {
    console.log('🧹 Iniciando limpieza de productos duplicados...');

    // Obtener todos los productos agrupados por nombre y tipo
    const products = await prisma.product.findMany({
      include: {
        templates: true,
        templateInteractions: true
      }
    });

    const groupedProducts = products.reduce((acc, product) => {
      const key = `${product.name}-${product.type}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(product);
      return acc;
    }, {});

    // Para cada grupo de duplicados, mantener el que tenga más relaciones
    for (const [key, duplicates] of Object.entries(groupedProducts)) {
      if (duplicates.length > 1) {
        console.log(`\n📦 Encontrados ${duplicates.length} duplicados para ${key}`);
        
        // Ordenar por número de relaciones (templates + interacciones)
        duplicates.sort((a, b) => {
          const aRelations = a.templates.length + a.templateInteractions.length;
          const bRelations = b.templates.length + b.templateInteractions.length;
          return bRelations - aRelations;
        });

        // Mantener el primero (el que tiene más relaciones)
        const keep = duplicates[0];
        const remove = duplicates.slice(1);

        console.log(`✅ Manteniendo producto: ${keep.id}`);
        
        // Eliminar los duplicados
        for (const product of remove) {
          console.log(`🗑️  Eliminando producto: ${product.id}`);
          
          // Primero actualizar las relaciones al producto que mantendremos
          if (product.templates.length > 0) {
            await prisma.template.updateMany({
              where: { productId: product.id },
              data: { productId: keep.id }
            });
          }

          if (product.templateInteractions.length > 0) {
            await prisma.templateInteraction.updateMany({
              where: { productId: product.id },
              data: { productId: keep.id }
            });
          }

          // Luego eliminar el producto duplicado
          await prisma.product.delete({
            where: { id: product.id }
          });
        }
      }
    }

    console.log('\n✨ Limpieza completada exitosamente');
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDuplicateProducts(); 