const prisma = require('../lib/prisma');

// Agregar verificación
if (!prisma) {
  throw new Error('Prisma client no inicializado');
}

// Validación de transición de estados
const isValidStatusTransition = (currentStatus, newStatus) => {
  const transitions = {
    PENDIENTE: ['ENVIADO', 'FALLIDO'],
    ENVIADO: ['ENTREGADO', 'FALLIDO'],
    ENTREGADO: ['LEIDO', 'FALLIDO'],
    LEIDO: ['RESPONDIDO', 'FALLIDO'],
    RESPONDIDO: [],
    FALLIDO: []
  };
  return transitions[currentStatus]?.includes(newStatus) || false;
};

// Agregar logging para debugging
const logError = (error, context) => {
  console.error(`Error en ${context}:`, {
    message: error.message,
    code: error.code,
    timestamp: new Date().toISOString()
  });
};

const debugPrisma = (action, result) => {
  console.log(`[Prisma Debug] ${action}:`, {
    success: !!result,
    timestamp: new Date().toISOString()
  });
};

const contactLogController = {
  getAllContactLogs: async (req, res) => {
    try {
      debugPrisma('Init', prisma);
      debugPrisma('Model', prisma.contact_Log);
      
      const contactLogs = await prisma.contact_Log.findMany({
        include: {
          lead: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          template: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });
      
      debugPrisma('Query Result', contactLogs);
      res.json(contactLogs);
    } catch (error) {
      console.error('Error en getAllContactLogs:', error);
      res.status(500).json({ 
        error: 'Error al obtener registros',
        details: error.message,
        type: error.constructor.name
      });
    }
  },

  createContactLog: async (req, res) => {
    try {
      const { leadId, templateId, status } = req.body;

      // Verificaciones en paralelo para mejor rendimiento
      const [lead, template] = await Promise.all([
        prisma.lead.findUnique({ where: { id: leadId } }),
        prisma.template.findUnique({ where: { id: templateId } })
      ]);

      if (!lead) {
        return res.status(404).json({ 
          error: 'Lead no encontrado',
          details: `No existe un lead con ID: ${leadId}`
        });
      }

      if (!template) {
        return res.status(404).json({ 
          error: 'Template no encontrado',
          details: `No existe un template con ID: ${templateId}`
        });
      }

      const contactLog = await prisma.contact_Log.create({
        data: {
          leadId,
          templateId,
          status: 'PENDIENTE'
        },
        include: {
          lead: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          template: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });
      res.status(201).json(contactLog);
    } catch (error) {
      logError(error, 'createContactLog');
      res.status(400).json({ 
        error: 'Error al crear registro',
        details: error.message 
      });
    }
  },

  getContactLogById: async (req, res) => {
    try {
      const { id } = req.params;
      const contactLog = await prisma.contact_Log.findUnique({
        where: { id },
        include: {
          lead: true,
          template: true
        }
      });
      if (!contactLog) {
        return res.status(404).json({ error: 'Contact Log no encontrado' });
      }
      res.json(contactLog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateContactLog: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const currentLog = await prisma.contact_Log.findUnique({
        where: { id }
      });

      if (!currentLog) {
        return res.status(404).json({ 
          error: 'Registro no encontrado',
          details: `No existe un registro con ID: ${id}`
        });
      }

      if (!isValidStatusTransition(currentLog.status, status)) {
        return res.status(400).json({ 
          error: 'Transición de estado inválida',
          details: `No se puede cambiar de ${currentLog.status} a ${status}`,
          allowedTransitions: transitions[currentLog.status]
        });
      }

      const contactLog = await prisma.contact_Log.update({
        where: { id },
        data: { status },
        include: {
          lead: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          template: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });
      res.json(contactLog);
    } catch (error) {
      logError(error, 'updateContactLog');
      res.status(400).json({ 
        error: 'Error al actualizar registro',
        details: error.message 
      });
    }
  },

  deleteContactLog: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.contact_Log.delete({
        where: { id }
      });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getContactLogsByLead: async (req, res) => {
    try {
      const { leadId } = req.params;
      
      // Verificar si el lead existe
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      });

      if (!lead) {
        return res.status(404).json({ 
          error: 'Lead no encontrado',
          details: `No existe un lead con ID: ${leadId}`
        });
      }

      // Obtener los contact logs con información completa
      const contactLogs = await prisma.contact_Log.findMany({
        where: { leadId },
        include: {
          template: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: {
          lead,
          contactLogs,
          total: contactLogs.length
        }
      });
    } catch (error) {
      logError(error, 'getContactLogsByLead');
      
      if (error.code?.startsWith('P2')) {
        const { status, message, details } = handlePrismaError(error);
        return res.status(status).json({ error: message, details });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener los registros de contacto',
        details: error.message
      });
    }
  },

  getContactLogsByTemplate: async (req, res) => {
    try {
      const { templateId } = req.params;
      const contactLogs = await prisma.contact_Log.findMany({
        where: { templateId },
        include: {
          lead: true
        }
      });
      res.json(contactLogs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = contactLogController; 