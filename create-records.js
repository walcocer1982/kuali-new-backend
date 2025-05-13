const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createRecords() {
  try {
    // 1. Crear Compañía
    const company = await prisma.company.create({
      data: {
        name: "Empresa Demo",
        sector: "Tecnología"
      }
    });
    console.log("✅ Compañía creada:", company);

    // 2. Crear Lead
    const lead = await prisma.lead.create({
      data: {
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan.perez@demo.com",
        phoneNumber: "+51987654321",
        companyId: company.id,
        status: "NUEVO",
        companyName: "Empresa Demo",
        industry: "Software",
        leadSource: "Website",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "demo_campaign"
      }
    });
    console.log("✅ Lead creado:", lead);

    // 3. Crear Template
    const template = await prisma.template.create({
      data: {
        title: "Plantilla de Seguimiento Inicial",
        body: "Estimado {firstName},\n\nGracias por su interés en nuestros servicios...",
        stepsJson: {
          paso1: "Envío inicial",
          paso2: "Seguimiento 48h",
          paso3: "Llamada de verificación"
        },
        tags: ["bienvenida", "seguimiento", "inicial"]
      }
    });
    console.log("✅ Template creado:", template);

    // 4. Crear Contact_Log
    const contactLog = await prisma.contact_Log.create({
      data: {
        leadId: lead.id,
        templateId: template.id,
        status: "PENDIENTE"
      },
      include: {
        lead: true,
        template: true
      }
    });
    console.log("✅ Contact_Log creado:", contactLog);

    // 5. Crear Interaction
    const interaction = await prisma.interaction.create({
      data: {
        leadId: lead.id,
        type: "EMAIL",
        notes: "Primer contacto con el cliente",
        result: "Pendiente de respuesta",
        scheduledAt: new Date(),
      }
    });
    console.log("✅ Interaction creada:", interaction);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  createRecords()
    .catch(console.error);
}

module.exports = createRecords; 