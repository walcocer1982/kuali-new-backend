const prisma = require('../lib/prisma');
const { logError, handlePrismaError } = require('../utils/errorHandler');

class LeadController {
// Obtener todos los leads
    async getAllLeads(req, res) {
  try {
    const leads = await prisma.lead.findMany({
      where: { 
        deletedAt: null 
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        status: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            name: true,
            sector: true
          }
        }
      }
    });

    res.json({
      status: 'success',
      data: leads,
      count: leads.length
    });
  } catch (error) {
    logError(error, 'getAllLeads');
    
    if (error.code?.startsWith('P2')) {
      const { status, message, details } = handlePrismaError(error);
      return res.status(status).json({ 
        error: message, 
        details,
        code: error.code 
      });
    }

    res.status(500).json({ 
      error: 'Error al obtener los leads',
      details: error.message,
      type: error.constructor.name
    });
  }
    }

// Crear un nuevo lead
    async createLead(req, res) {
  try {
    const newLead = await prisma.lead.create({
      data: {
        ...req.body,
        status: req.body.status || 'NUEVO'
      },
      include: {
        company: true
      }
    });
    
    res.status(201).json({
      status: 'success',
      data: newLead
    });
  } catch (error) {
    logError(error, 'createLead');
    
    if (error.code?.startsWith('P2')) {
      const { status, message, details } = handlePrismaError(error);
      return res.status(status).json({ error: message, details });
    }
    
    res.status(500).json({ 
      error: 'Error al crear el lead',
      details: error.message
    });
  }
    }

// Actualizar un lead
    async updateLead(req, res) {
  try {
    const updatedLead = await prisma.lead.update({
      where: { 
        id: req.params.id 
      },
      data: req.body,
      include: {
        company: true
      }
    });
    
    res.json({
      status: 'success',
      data: updatedLead
    });
  } catch (error) {
    logError(error, 'updateLead');
    
    if (error.code?.startsWith('P2')) {
      const { status, message, details } = handlePrismaError(error);
      return res.status(status).json({ error: message, details });
    }
    
    res.status(500).json({ 
      error: 'Error al actualizar el lead',
      details: error.message
    });
  }
    }

// Eliminar un lead (soft delete)
    async deleteLead(req, res) {
  try {
    const deletedLead = await prisma.lead.update({
      where: { 
        id: req.params.id 
      },
      data: {
        deletedAt: new Date()
      }
    });
    
    res.json({
      status: 'success',
      message: 'Lead eliminado correctamente',
      data: deletedLead
    });
  } catch (error) {
    logError(error, 'deleteLead');
    
    if (error.code?.startsWith('P2')) {
      const { status, message, details } = handlePrismaError(error);
      return res.status(status).json({ error: message, details });
    }
    
    res.status(500).json({ 
      error: 'Error al eliminar el lead',
      details: error.message
    });
  }
    }

    // Buscar leads por número de teléfono
    async searchByPhone(req, res) {
        try {
            const { phone } = req.query;
            
            if (!phone) {
                return res.status(400).json({
                    error: 'Parámetro requerido',
                    details: 'El número de teléfono es requerido'
                });
            }

            const lead = await prisma.lead.findFirst({
                where: {
                    phoneNumber: phone,
                    deletedAt: null
                },
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                            sector: true
                        }
                    }
                }
            });

            if (!lead) {
                return res.status(404).json({
                    error: 'Lead no encontrado',
                    details: `No existe un lead con el teléfono: ${phone}`
                });
            }

            res.json(lead);
        } catch (error) {
            logError(error, 'searchByPhone');
            res.status(500).json({
                error: 'Error al buscar lead',
                details: error.message
            });
        }
    }

    async getInteractions(req, res) {
        try {
            const { id } = req.params;

            const lead = await prisma.lead.findUnique({
                where: { id }
            });

            if (!lead) {
                return res.status(404).json({
                    error: 'Lead no encontrado',
                    details: `No existe un lead con ID: ${id}`
                });
            }

            const interactions = await prisma.interaction.findMany({
                where: {
                    leadId: id
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            res.json(interactions);
        } catch (error) {
            logError(error, 'getInteractions');
            res.status(500).json({
                error: 'Error al obtener interacciones',
                details: error.message
            });
        }
    }
}

module.exports = new LeadController(); 