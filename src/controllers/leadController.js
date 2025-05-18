const prisma = require('../lib/prisma');
const { logError, handlePrismaError } = require('../utils/errorHandler');

// Obtener todos los leads
exports.getAllLeads = async (req, res) => {
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
};

// Crear un nuevo lead
exports.createLead = async (req, res) => {
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
};

// Actualizar un lead
exports.updateLead = async (req, res) => {
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
};

// Eliminar un lead (soft delete)
exports.deleteLead = async (req, res) => {
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
};

// Buscar leads por número de teléfono
exports.searchByPhone = async (req, res) => {
    try {
        const { phone } = req.query;
        
        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'El número de teléfono es requerido'
            });
        }

        // Limpiamos el número de teléfono de entrada
        const cleanedPhone = String(phone).replace(/[\s\+\-\(\)]/g, '');
        
        // Si el número no incluye código de país, creamos dos patrones
        let phonePatterns = [];
        
        // Patrón 1: Número exacto como fue ingresado
        phonePatterns.push({ contains: cleanedPhone });
        
        // Patrón 2: Si no empieza con 51, agregamos el patrón con 51
        if (!cleanedPhone.startsWith('51')) {
            phonePatterns.push({ contains: `51${cleanedPhone}` });
        }
        
        // Patrón 3: Si empieza con 51, también buscamos sin el código de país
        if (cleanedPhone.startsWith('51')) {
            phonePatterns.push({ contains: cleanedPhone.substring(2) });
        }

        const leads = await prisma.lead.findMany({
            where: {
                OR: phonePatterns.map(pattern => ({
                    phoneNumber: pattern
                })),
                deletedAt: null
            },
            include: {
                company: {
                    select: {
                        name: true,
                        sector: true
                    }
                }
            }
        });

        return res.status(200).json({
            success: true,
            data: leads
        });
    } catch (error) {
        logError(error, 'searchByPhone');
        
        if (error.code?.startsWith('P2')) {
            const { status, message, details } = handlePrismaError(error);
            return res.status(status).json({ error: message, details });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Error al buscar leads',
            error: error.message
        });
    }
}; 