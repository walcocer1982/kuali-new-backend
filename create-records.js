const { PrismaClient } = require("@prisma/client");
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function createRecordsFromSimulation() {
  try {
    // Limpieza previa (opcional) - Cuidado: esto borrará todos los datos existentes
    console.log("Limpiando registros previos...");
    await prisma.interaction.deleteMany({});
    await prisma.contact_Log.deleteMany({});
    await prisma.template.deleteMany({});
    await prisma.lead.deleteMany({});
    await prisma.company.deleteMany({});
    
    console.log("🚀 Iniciando creación de registros desde datos de simulación...");

    // 1. Crear Empresas
    console.log("Creando empresas...");
    const companies = [
      {
        name: "BCP (Banco de Crédito del Perú)",
        sector: "Financiero"
      },
      {
        name: "Alicorp",
        sector: "Consumo Masivo"
      },
      {
        name: "Grupo Gloria",
        sector: "Alimentos y Bebidas"
      },
      {
        name: "Interbank",
        sector: "Financiero"
      },
      {
        name: "Cementos Pacasmayo",
        sector: "Construcción"
      },
      {
        name: "VisaNet Perú",
        sector: "Tecnología y Pagos"
      }
    ];

    const createdCompanies = {};
    for (const companyData of companies) {
      const company = await prisma.company.create({
        data: companyData
      });
      createdCompanies[company.name] = company;
      console.log(`✅ Empresa creada: ${company.name}`);
    }

    // 2. Crear Leads
    console.log("Creando leads/candidatos...");
    const leads = [
      {
        firstName: "Carlos",
        lastName: "Mendoza",
        email: "carlos.mendoza@gmail.com",
        phoneNumber: "+51 987 654 321",
        status: "NUEVO",
        companyId: createdCompanies["BCP (Banco de Crédito del Perú)"].id,
        companyName: "Globant",
        industry: "Tecnología",
        leadSource: "LinkedIn"
      },
      {
        firstName: "María Fernanda",
        lastName: "Rojas",
        email: "mfrojas@outlook.com",
        phoneNumber: "+51 986 543 212",
        status: "CONTACTADO",
        companyId: createdCompanies["Alicorp"].id,
        companyName: "Circus Grey",
        industry: "Marketing",
        leadSource: "Referido"
      },
      {
        firstName: "Javier",
        lastName: "Sánchez Ríos",
        email: "jsanchez@hotmail.com",
        phoneNumber: "+51 976 432 198",
        status: "CALIFICADO",
        companyId: createdCompanies["Grupo Gloria"].id,
        companyName: "Everis",
        industry: "Consultoría",
        leadSource: "Web"
      },
      {
        firstName: "Luciana",
        lastName: "Castro",
        email: "lucicastro@gmail.com",
        phoneNumber: "+51 965 321 876",
        status: "OPORTUNIDAD",
        companyId: createdCompanies["Interbank"].id,
        companyName: "Belcorp",
        industry: "Belleza",
        leadSource: "Evento"
      },
      {
        firstName: "Eduardo",
        lastName: "Paredes",
        email: "eparedes@gmail.com",
        phoneNumber: "+51 954 321 765",
        status: "CLIENTE",
        companyId: createdCompanies["Cementos Pacasmayo"].id,
        companyName: "Scotiabank",
        industry: "Financiero",
        leadSource: "Google Ads"
      },
      {
        firstName: "Ana Paula",
        lastName: "Montoya",
        email: "anamontoya@yahoo.com",
        phoneNumber: "+51 943 765 412",
        status: "PERDIDO",
        companyId: createdCompanies["VisaNet Perú"].id,
        companyName: "Laboratoria",
        industry: "Educación",
        leadSource: "Facebook"
      }
    ];

    const createdLeads = {};
    for (const leadData of leads) {
      const lead = await prisma.lead.create({
        data: leadData
      });
      createdLeads[lead.firstName + " " + lead.lastName] = lead;
      console.log(`✅ Lead creado: ${lead.firstName} ${lead.lastName}`);
    }

    // 3. Crear Templates
    console.log("Creando templates...");
    const templates = [
      {
        title: "Presentación de CV Scanner",
        body: "Mensaje inicial para presentar CV Scanner",
        stepsJson: {
          steps: [
            {
              order: 1,
              name: "Presentación",
              message: "Hola, {cliente}! Soy {vendedor}, de Kuali.ai. Te contacto porque sé que revisan muchísimos CVs; nosotros tenemos un scanner con IA que hace esa criba en segundos y sin sesgos. kuali.ai"
            },
            {
              order: 2,
              name: "Diagnóstico",
              message: "¿Cuánto tarda hoy tu equipo en filtrar currículums y qué les cuesta más de ese proceso?"
            },
            {
              order: 3,
              name: "Propuesta de valor",
              message: "Nuestro motor puntúa cada CV según los criterios que tú marques—experiencia, estudios, habilidades—y te entrega un ranking listo para entrevistar. kuali.ai"
            },
            {
              order: 4,
              name: "Beneficios",
              message: "Las empresas que lo usan reducen hasta un 80% el tiempo de revisión y ganan objetividad. kuali.ai"
            },
            {
              order: 5,
              name: "Validación",
              message: "¿Dirías que un filtrado más rápido y justo quitaría presión a tu equipo?"
            },
            {
              order: 6,
              name: "Demo",
              message: "Si te parece, armemos una demo de 30 min con CVs reales el miércoles a las 3 p.m. ¿Te cuadra?"
            },
            {
              order: 7,
              name: "Presupuesto",
              message: "Para enviarte la propuesta, ¿qué rango anual manejan para herramientas de selección?"
            },
            {
              order: 8,
              name: "Cierre",
              message: "Genial. Te paso la invitación y, tras la demo, podemos lanzar un piloto de dos semanas."
            }
          ]
        },
        tags: ["CV", "IA", "Filtrado", "Reclutamiento"]
      },
      {
        title: "Contacto Automatizado",
        body: "Mensaje inicial para presentar sistema de contacto automatizado",
        stepsJson: {
          steps: [
            {
              order: 1,
              name: "Presentación",
              message: "Hola, {cliente}. Soy {vendedor}, de Kuali.ai. Vi que buscas mejorar el contacto con candidatos; nuestro servicio envía llamadas, WhatsApp y SMS personalizados desde el primer minuto. kuali.ai"
            },
            {
              order: 2,
              name: "Diagnóstico",
              message: "¿En qué fase pierden más postulantes por falta de seguimiento?"
            },
            {
              order: 3,
              name: "Propuesta de valor",
              message: "Configuramos flujos que recuerdan a cada candidato completar su aplicación y les dan el enlace directo, todo segmentado por perfil y horario. kuali.ai"
            },
            {
              order: 4,
              name: "Beneficios",
              message: "Esto suele disparar la tasa de finalización y liberar tiempo al equipo de reclutamiento. kuali.ai"
            },
            {
              order: 5,
              name: "Validación",
              message: "¿Aumentar el contacto temprano ayudaría a reducir vuestro time-to-hire?"
            },
            {
              order: 6,
              name: "Demo",
              message: "Te muestro un flujo real en 20 min mañana a las 10 a.m. ¿Te va?"
            },
            {
              order: 7,
              name: "Presupuesto",
              message: "¿Qué presupuesto anual destinan a comunicación multicanal?"
            },
            {
              order: 8,
              name: "Cierre",
              message: "Te envío la invitación y, tras la demo, habilitamos un piloto de 14 días."
            }
          ]
        },
        tags: ["Whatsapp", "SMS", "Automatización", "Contacto"]
      },
      {
        title: "Bot de Screening",
        body: "Mensaje inicial para presentar asistente de screening",
        stepsJson: {
          steps: [
            {
              order: 1,
              name: "Presentación",
              message: "¡Buenos días, {cliente}! Soy {vendedor}, de Kuali.ai. Tenemos un bot de IA que hace la primera entrevista por voz o chat y evalúa soft skills al instante. kuali.ai"
            },
            {
              order: 2,
              name: "Diagnóstico",
              message: "¿Cuántas horas se van cada semana en entrevistas iniciales y qué tan fácil es medir habilidades blandas?"
            },
            {
              order: 3,
              name: "Propuesta de valor",
              message: "El bot formula preguntas abiertas, analiza el tono y las palabras, y asigna un puntaje objetivo que prioriza a los candidatos adecuados. kuali.ai"
            },
            {
              order: 4,
              name: "Beneficios",
              message: "Ahorras horas de trabajo y obtienes un registro completo de la conversación para decisiones informadas. kuali.ai"
            },
            {
              order: 5,
              name: "Validación",
              message: "¿Crees que un scoring de culture fit desde la primera entrevista sería útil?"
            },
            {
              order: 6,
              name: "Demo",
              message: "¿Te parece una prueba de 25 min el viernes a las 4 p.m. con perfiles reales?"
            },
            {
              order: 7,
              name: "Presupuesto",
              message: "¿Qué rango anual tienen para IA de entrevistas?"
            },
            {
              order: 8,
              name: "Cierre",
              message: "Genial, te paso agenda y, después de la demo, podemos activar un piloto de un mes."
            }
          ]
        },
        tags: ["IA", "Entrevistas", "Soft Skills", "Screening"]
      },
      {
        title: "Analytics RR.HH.",
        body: "Mensaje inicial para presentar Analytics de RRHH",
        stepsJson: {
          steps: [
            {
              order: 1,
              name: "Presentación",
              message: "Hola, {cliente}. Soy {vendedor}, de Kuali.ai. Nuestra plataforma de People Analytics convierte tu proceso en dashboards de tiempo real para que veas exactamente dónde se atasca cada vacante. kuali.ai"
            },
            {
              order: 2,
              name: "Diagnóstico",
              message: "¿Hoy cómo detectas cuellos de botella o justificas tus decisiones con datos?"
            },
            {
              order: 3,
              name: "Propuesta de valor",
              message: "Integramos tu ATS y ERP y te damos KPIs como tiempo de contratación, tasa de respuesta, costo por hire y calidad de contratación. kuali.ai"
            },
            {
              order: 4,
              name: "Beneficios",
              message: "Con esos datos, los líderes toman decisiones más rápidas y alinean la estrategia de talento al negocio. kuali.ai"
            },
            {
              order: 5,
              name: "Validación",
              message: "¿Un dashboard proactivo facilitaría la priorización de posiciones y el ahorro de costos?"
            },
            {
              order: 6,
              name: "Demo",
              message: "Propongo una demo de 40 min el martes a las 2 p.m. usando datos anonimizados de tu proceso."
            },
            {
              order: 7,
              name: "Presupuesto",
              message: "¿Qué presupuesto anual manejan para analítica de talento?"
            },
            {
              order: 8,
              name: "Cierre",
              message: "Te envío acceso de invitado y un caso de éxito; luego definimos el plan de implementación."
            }
          ]
        },
        tags: ["Analytics", "Dashboard", "KPI", "Datos"]
      }
    ];

    const createdTemplates = {};
    for (const templateData of templates) {
      const template = await prisma.template.create({
        data: templateData
      });
      createdTemplates[template.title] = template;
      console.log(`✅ Template creado: ${template.title}`);
    }

    // 4. Crear Contact_Logs
    console.log("Creando registros de contacto...");
    const contactLogs = [
      {
        leadId: createdLeads["Carlos Mendoza"].id,
        templateId: createdTemplates["Presentación de CV Scanner"].id,
        status: "ENVIADO"
      },
      {
        leadId: createdLeads["María Fernanda Rojas"].id,
        templateId: createdTemplates["Contacto Automatizado"].id,
        status: "LEIDO"
      },
      {
        leadId: createdLeads["Javier Sánchez Ríos"].id,
        templateId: createdTemplates["Bot de Screening"].id,
        status: "RESPONDIDO"
      },
      {
        leadId: createdLeads["Luciana Castro"].id,
        templateId: createdTemplates["Analytics RR.HH."].id,
        status: "ENTREGADO"
      },
      {
        leadId: createdLeads["Eduardo Paredes"].id,
        templateId: createdTemplates["Presentación de CV Scanner"].id,
        status: "PENDIENTE"
      },
      {
        leadId: createdLeads["Ana Paula Montoya"].id,
        templateId: createdTemplates["Bot de Screening"].id,
        status: "FALLIDO"
      }
    ];

    for (const contactLogData of contactLogs) {
      const contactLog = await prisma.contact_Log.create({
        data: contactLogData,
      include: {
        lead: true,
        template: true
      }
    });
      console.log(`✅ Contact_Log creado: ${contactLog.lead.firstName} - ${contactLog.template.title} (${contactLog.status})`);
    }

    // 5. Crear Interactions
    console.log("Creando interacciones...");
    const interactions = [
      {
        leadId: createdLeads["Carlos Mendoza"].id,
        type: "CALL",
        notes: "Primera llamada de presentación del CV Scanner",
        result: "Cliente interesado, solicita más información",
        scheduledAt: new Date("2023-05-10T10:00:00"),
        completedAt: new Date("2023-05-10T10:15:00")
      },
      {
        leadId: createdLeads["María Fernanda Rojas"].id,
        type: "EMAIL",
        notes: "Envío de propuesta de Llamadas Automatizadas",
        result: "Cliente pide cotización formal",
        scheduledAt: new Date("2023-05-12T15:30:00"),
        completedAt: new Date("2023-05-12T16:00:00")
      },
      {
        leadId: createdLeads["Javier Sánchez Ríos"].id,
        type: "MEETING",
        notes: "Reunión de demostración del Asistente de Screening",
        result: "Cliente muy interesado, quiere iniciar un piloto",
        scheduledAt: new Date("2023-05-15T11:00:00"),
        completedAt: new Date("2023-05-15T11:45:00")
      },
      {
        leadId: createdLeads["Luciana Castro"].id,
        type: "DEMO",
        notes: "Demostración de People Analytics con datos reales",
        result: "Cliente emocionado con las posibilidades",
        scheduledAt: new Date("2023-05-18T14:00:00"),
        completedAt: new Date("2023-05-18T15:00:00")
      },
      {
        leadId: createdLeads["Eduardo Paredes"].id,
        type: "CALL",
        notes: "Seguimiento post-implementación de CV Scanner",
        result: "Cliente satisfecho, quiere añadir módulo de Analytics",
        scheduledAt: new Date("2023-05-20T16:00:00"),
        completedAt: new Date("2023-05-20T16:30:00")
      },
      {
        leadId: createdLeads["Ana Paula Montoya"].id,
        type: "OTHER",
        notes: "Cliente canceló la reunión y no desea continuar",
        result: "Lead perdido, menciona que encontraron otra solución",
        scheduledAt: new Date("2023-05-22T09:00:00")
      }
    ];

    for (const interactionData of interactions) {
      const interaction = await prisma.interaction.create({
        data: interactionData,
        include: {
          lead: true
        }
      });
      console.log(`✅ Interacción creada: ${interaction.lead.firstName} - ${interaction.type}`);
    }

    console.log("✅ Todos los registros han sido creados exitosamente");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Nueva función para crear historial de Contact_Log e Interactions sin borrar datos
async function crearHistorial982014786() {
  try {
    console.log("🔍 Consultando datos existentes...");
    
    // Obtener leads existentes
    const leads = await prisma.lead.findMany();
    if (leads.length === 0) {
      console.error("❌ No hay leads en la base de datos. Ejecute primero createRecordsFromSimulation.");
      return;
    }
    
    // Obtener templates existentes
    const templates = await prisma.template.findMany();
    if (templates.length === 0) {
      console.error("❌ No hay templates en la base de datos. Ejecute primero createRecordsFromSimulation.");
      return;
    }
    
    console.log(`📊 Encontrados ${leads.length} leads y ${templates.length} templates.`);
    
    // Crear historial de Contact_Log (abril 2023 - hace 30 días)
    console.log("📝 Creando historial de Contact_Log...");
    
    // Fechas para el historial (último mes)
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 30); // 30 días atrás
    
    // Distribuir aleatoriamente los estados
    const estados = ["PENDIENTE", "ENVIADO", "ENTREGADO", "LEIDO", "RESPONDIDO", "FALLIDO"];
    
    // Crear 3 contact logs históricos por lead
    for (const lead of leads) {
      for (let i = 0; i < 3; i++) {
        // Seleccionar template aleatorio
        const templateRandom = templates[Math.floor(Math.random() * templates.length)];
        
        // Fecha aleatoria entre hace 30 días y hoy
        const fechaRandom = new Date(fechaInicio.getTime() + Math.random() * (new Date().getTime() - fechaInicio.getTime()));
        
        // Estado aleatorio con más probabilidad para los estados exitosos
        const estadoRandom = estados[Math.floor(Math.random() * estados.length)];
        
        await prisma.contact_Log.create({
          data: {
            leadId: lead.id,
            templateId: templateRandom.id,
            status: estadoRandom,
            createdAt: fechaRandom,
            updatedAt: new Date(fechaRandom.getTime() + Math.random() * 60 * 60 * 1000) // 0-1 hora después
          }
        });
      }
    }
    
    console.log(`✅ Creados ${leads.length * 3} registros históricos de Contact_Log`);
    
    // Crear historial de Interactions (abril 2023 - hace 30 días)
    console.log("🔄 Creando historial de Interactions...");
    
    // Tipos de interacciones
    const tiposInteraccion = ["CALL", "EMAIL", "MEETING", "DEMO", "OTHER"];
    
    // Crear 4 interacciones históricas por lead
    for (const lead of leads) {
      // Si lead está en estado PERDIDO, crear menos interacciones
      const numInteracciones = lead.status === "PERDIDO" ? 2 : 4;
      
      for (let i = 0; i < numInteracciones; i++) {
        // Tipo aleatorio
        const tipoRandom = tiposInteraccion[Math.floor(Math.random() * tiposInteraccion.length)];
        
        // Fecha programada aleatoria entre hace 30 días y hoy
        const fechaProgramada = new Date(fechaInicio.getTime() + Math.random() * (new Date().getTime() - fechaInicio.getTime()));
        
        // 80% de probabilidad de que esté completada si no es PERDIDO
        const completada = lead.status !== "PERDIDO" && Math.random() < 0.8;
        
        // Generar notas y resultado según tipo y estado del lead
        let notas = "";
        let resultado = "";
        
        if (tipoRandom === "CALL") {
          notas = `Llamada de seguimiento con ${lead.firstName}`;
          resultado = completada ? "Llamada exitosa, cliente interesado" : "No contestó, dejar mensaje";
        } else if (tipoRandom === "EMAIL") {
          notas = `Correo enviado a ${lead.firstName} sobre ${templates[Math.floor(Math.random() * templates.length)].title}`;
          resultado = completada ? "Correo leído, esperando respuesta" : "Correo enviado";
        } else if (tipoRandom === "MEETING") {
          notas = `Reunión virtual con ${lead.firstName} y su equipo`;
          resultado = completada ? "Reunión productiva, se discutieron próximos pasos" : "Reunión cancelada por el cliente";
        } else if (tipoRandom === "DEMO") {
          notas = `Demostración de producto a ${lead.firstName}`;
          resultado = completada ? "Cliente impresionado, solicita propuesta" : "Demo pendiente de reprogramar";
        } else {
          notas = `Seguimiento general a ${lead.firstName}`;
          resultado = completada ? "Contacto establecido" : "Pendiente";
        }
        
        await prisma.interaction.create({
          data: {
            leadId: lead.id,
            type: tipoRandom,
            notes: notas,
            result: resultado,
            scheduledAt: fechaProgramada,
            completedAt: completada ? new Date(fechaProgramada.getTime() + Math.random() * 2 * 60 * 60 * 1000) : null, // 0-2 horas después
            createdAt: new Date(fechaProgramada.getTime() - Math.random() * 24 * 60 * 60 * 1000), // 0-24 horas antes
            updatedAt: new Date()
          }
        });
      }
    }
    
    console.log(`✅ Creadas ${leads.reduce((acc, lead) => acc + (lead.status === "PERDIDO" ? 2 : 4), 0)} interacciones históricas`);
    console.log("✅ Historial completado para ID 982014786");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para crear candidato específico con teléfono +51 982 014 786
async function crearCandidatoEspecifico() {
  try {
    console.log("🔍 Buscando empresas existentes...");
    
    // Verificar si hay empresas
    const empresas = await prisma.company.findMany();
    if (empresas.length === 0) {
      console.error("❌ No hay empresas en la base de datos. Ejecute primero createRecordsFromSimulation.");
      return;
    }
    
    // Obtener templates existentes
    const templates = await prisma.template.findMany();
    if (templates.length === 0) {
      console.error("❌ No hay templates en la base de datos. Ejecute primero createRecordsFromSimulation.");
      return;
    }
    
    console.log("✅ Creando candidato con número telefónico +51 982 014 786...");
    
    // Seleccionar una empresa aleatoria
    const empresaRandom = empresas[Math.floor(Math.random() * empresas.length)];
    
    // 1. Crear el lead específico
    const candidatoEspecifico = await prisma.lead.create({
      data: {
        firstName: "Rodrigo",
        lastName: "Pérez Saavedra",
        email: "rodrigo.perez@dataperu.pe",
        phoneNumber: "+51 982 014 786",
        status: "CALIFICADO",
        companyId: empresaRandom.id,
        companyName: "DataPerú",
        industry: "Tecnología",
        leadSource: "Referido",
        leadScore: 85,
        utmSource: "linkedin",
        utmMedium: "social",
        utmCampaign: "tech_talent_2023"
      }
    });
    
    console.log(`✅ Candidato creado: ${candidatoEspecifico.firstName} ${candidatoEspecifico.lastName} - ${candidatoEspecifico.phoneNumber}`);
    
    // 2. Crear 5 Contact_Logs para este candidato (últimos 2 meses)
    console.log("📝 Creando historial de contactos para +51 982 014 786...");
    
    // Fechas para historial más extenso (últimos 2 meses)
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 2);
    
    // Estados de contacto ordenados cronológicamente
    const estadosContacto = ["ENVIADO", "ENTREGADO", "LEIDO", "RESPONDIDO", "PENDIENTE"];
    
    // Crear logs de contacto cronológicos
    for (let i = 0; i < 5; i++) {
      // Fecha progresiva (primero más antiguo, último más reciente)
      const diasAtras = 60 - (i * 12); // Distribuir en 2 meses
      const fechaContacto = new Date();
      fechaContacto.setDate(fechaContacto.getDate() - diasAtras);
      
      // Template rotativo
      const templateIndex = i % templates.length;
      
      await prisma.contact_Log.create({
        data: {
          leadId: candidatoEspecifico.id,
          templateId: templates[templateIndex].id,
          status: estadosContacto[i],
          createdAt: fechaContacto,
          updatedAt: new Date(fechaContacto.getTime() + Math.random() * 60 * 60 * 1000)
        }
      });
    }
    
    console.log(`✅ Creados 5 contactos históricos para ${candidatoEspecifico.phoneNumber}`);
    
    // 3. Crear 6 Interacciones detalladas para este candidato
    console.log("🔄 Creando interacciones para +51 982 014 786...");
    
    // Interacciones predefinidas con progresión lógica
    const interacciones = [
      {
        type: "CALL",
        notes: "Primer contacto telefónico con Rodrigo, mostró interés en CV Scanner",
        result: "Interesado, solicita más información por correo",
        scheduledAt: new Date(new Date().setDate(new Date().getDate() - 50)),
        completedAt: new Date(new Date().setDate(new Date().getDate() - 50))
      },
      {
        type: "EMAIL",
        notes: "Envío de información detallada sobre CV Scanner y sus beneficios",
        result: "Correo enviado con detalles y precios",
        scheduledAt: new Date(new Date().setDate(new Date().getDate() - 45)),
        completedAt: new Date(new Date().setDate(new Date().getDate() - 45))
      },
      {
        type: "CALL",
        notes: "Llamada de seguimiento tras envío de información",
        result: "Rodrigo revisó propuesta, tiene dudas técnicas",
        scheduledAt: new Date(new Date().setDate(new Date().getDate() - 38)),
        completedAt: new Date(new Date().setDate(new Date().getDate() - 38))
      },
      {
        type: "DEMO",
        notes: "Demostración virtual del CV Scanner con su equipo de HR",
        result: "Demo exitosa, equipo impresionado con la herramienta",
        scheduledAt: new Date(new Date().setDate(new Date().getDate() - 30)),
        completedAt: new Date(new Date().setDate(new Date().getDate() - 30))
      },
      {
        type: "MEETING",
        notes: "Reunión para discutir términos y condiciones del contrato",
        result: "Negociación de precios y alcance del servicio",
        scheduledAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        completedAt: new Date(new Date().setDate(new Date().getDate() - 15))
      },
      {
        type: "OTHER",
        notes: "Envío de contrato y documentación para firma",
        result: "Pendiente de firma del cliente, prometió revisarlo esta semana",
        scheduledAt: new Date(new Date().setDate(new Date().getDate() - 7)),
        completedAt: null
      }
    ];
    
    for (const interaccionData of interacciones) {
      await prisma.interaction.create({
        data: {
          leadId: candidatoEspecifico.id,
          ...interaccionData,
          createdAt: new Date(interaccionData.scheduledAt.getTime() - 24 * 60 * 60 * 1000)
        }
      });
    }
    
    console.log(`✅ Creadas 6 interacciones detalladas para ${candidatoEspecifico.phoneNumber}`);
    console.log("✅ Proceso completado exitosamente para candidato con teléfono +51 982 014 786");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--telefono') || args.includes('-t')) {
    crearCandidatoEspecifico()
      .catch(console.error);
  } else if (args.includes('--historial') || args.includes('-h')) {
    crearHistorial982014786()
      .catch(console.error);
  } else {
    createRecordsFromSimulation()
      .catch(console.error);
  }
}

module.exports = { 
  createRecordsFromSimulation,
  crearHistorial982014786,
  crearCandidatoEspecifico
}; 