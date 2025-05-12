
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createRecords() {
  try {
    // 1. Crear Template
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

    // 2. Obtener primer lead disponible
    const lead = await prisma.lead.findFirst({
      where: { deletedAt: null }
    });

    if (!lead) {
      throw new Error("No se encontró ningún lead activo");
    }

    // 3. Crear Contact_Log
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
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createRecords();

