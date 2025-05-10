const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const template = await prisma.template.create({
    data: {
      title: "Llamadas y Mensajes Automatizados",
      body: "Template para venta de servicios de automatización de comunicaciones",
      steps: [
        {
          step: "Presentación",
          salesperson_response: "Hola, <cliente>. Soy <vendedor>, de Kuali.ai. Vi que buscas mejorar el contacto con candidatos; nuestro servicio envía llamadas, WhatsApp y SMS personalizados desde el primer minuto. kuali.ai",
          client_response: "¡Hola, Marta! ¿Qué canales incluyen?"
        },
        {
          step: "Diagnóstico",
          salesperson_response: "¿En qué fase pierden más postulantes por falta de seguimiento?",
          client_response: "Después del primer correo muchos no responden."
        },
        {
          step: "Propuesta de valor",
          salesperson_response: "Configuramos flujos que recuerdan a cada candidato completar su aplicación y les dan el enlace directo, todo segmentado por perfil y horario. kuali.ai",
          client_response: "¿Podemos elegir horas de envío?"
        },
        {
          step: "Beneficios",
          salesperson_response: "Esto suele disparar la tasa de finalización y liberar tiempo al equipo de reclutamiento. kuali.ai",
          client_response: "Suena bien."
        },
        {
          step: "Validación",
          salesperson_response: "¿Aumentar el contacto temprano ayudaría a reducir vuestro time-to-hire?",
          client_response: "Definitivamente."
        },
        {
          step: "Demo",
          salesperson_response: "Te muestro un flujo real en 20 min mañana a las 10 a.m. ¿Te va?",
          client_response: "Sí, mañana 10."
        },
        {
          step: "Presupuesto",
          salesperson_response: "¿Qué presupuesto anual destinan a comunicación multicanal?",
          client_response: "Unos 3 000 USD."
        },
        {
          step: "Cierre",
          salesperson_response: "Te envío la invitación y, tras la demo, habilitamos un piloto de 14 días.",
          client_response: "Perfecto."
        }
      ]
    }
  });

  console.log('Template creado:', template);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 