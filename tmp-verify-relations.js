const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'error']
});

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Conexión establecida\n');

    // Verificar productos y sus templates
    console.log('📦 Verificando productos y templates...');
    const products = await prisma.product.findMany({
      include: {
        templates: {
          orderBy: {
            type: 'asc'
          }
        }
      }
    });

    products.forEach(product => {
      console.log(`\n🔍 Producto: ${product.name}`);
      console.log(`   Descripción: ${product.description || 'No disponible'}`);
      console.log('   Templates:');
      product.templates.forEach(template => {
        console.log(`   - [${template.type}] ${template.title}`);
      });
    });

    // Verificar empresas y sus leads
    console.log('\n\n🏢 Verificando empresas y leads...');
    const companies = await prisma.company.findMany({
      include: {
        leads: {
          include: {
            contactLogs: {
              include: {
                template: true
              }
            },
            interactions: true
          }
        }
      }
    });

    companies.forEach(company => {
      console.log(`\n🔍 Empresa: ${company.name} (${company.sector})`);
      console.log('   Leads:');
      company.leads.forEach(lead => {
        console.log(`   - ${lead.firstName} ${lead.lastName}`);
        console.log(`     Estado: ${lead.status}`);
        console.log(`     Contacto: ${lead.email} / ${lead.phoneNumber}`);
        if (lead.contactLogs.length > 0) {
          console.log('     Logs de contacto:');
          lead.contactLogs.forEach(log => {
            console.log(`       - [${log.status}] Template: ${log.template.title}`);
          });
        }
        if (lead.interactions.length > 0) {
          console.log('     Interacciones:');
          lead.interactions.forEach(interaction => {
            console.log(`       - [${interaction.type}] ${interaction.notes || 'Sin notas'}`);
          });
        }
      });
    });

    // Verificar templates huérfanos
    console.log('\n\n🔍 Verificando templates sin producto...');
    const orphanTemplates = await prisma.template.findMany({
      where: {
        productId: null
      }
    });

    if (orphanTemplates.length > 0) {
      console.log('⚠️  Templates sin producto encontrados:');
      orphanTemplates.forEach(template => {
        console.log(`   - ${template.title} (${template.type})`);
      });
    } else {
      console.log('✅ No se encontraron templates sin producto');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 