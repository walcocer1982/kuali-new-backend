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
                    success: false,
                    message: 'El número de teléfono es requerido'
                });
            }

            // Limpiamos el número de teléfono de entrada
            const cleanedPhone = String(phone).replace(/[\s\+\-\(\)]/g, '');
            
            // Obtenemos todos los leads y filtramos manualmente
            const allLeads = await prisma.lead.findMany({
                where: {
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

            // Filtramos los leads que coincidan con el número (ignorando espacios y caracteres especiales)
            const filteredLeads = allLeads.filter(lead => {
                if (!lead.phoneNumber) return false;
                
                // Limpiamos el número de teléfono almacenado
                const storedPhone = lead.phoneNumber.replace(/[\s\+\-\(\)]/g, '');
                
                // Verificamos si coincide exactamente o con/sin código de país
                return storedPhone === cleanedPhone ||
                       storedPhone === `51${cleanedPhone}` ||
                       (storedPhone.startsWith('51') && storedPhone.substring(2) === cleanedPhone) ||
                       (cleanedPhone.startsWith('51') && cleanedPhone.substring(2) === storedPhone);
            });

            // Registrar para debugging
            console.log('Búsqueda de teléfono:', {
                original: phone,
                cleaned: cleanedPhone,
                totalLeads: allLeads.length,
                resultsFound: filteredLeads.length
            });

            return res.status(200).json({
                success: true,
                data: filteredLeads
            });
        } catch (error) {
            console.error('Error en searchByPhone:', error);
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
    }
}

module.exports = new LeadController(); 