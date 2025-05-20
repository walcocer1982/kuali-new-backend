const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { logError } = require('../utils/logger');
const { handlePrismaError } = require('../utils/errorHandler');

class TemplateInteractionController {
    // Obtener todas las interacciones de templates
    async getAllTemplateInteractions(req, res) {
        try {
            const interactions = await prisma.templateInteraction.findMany({
                include: {
                    product: true
                }
            });
            
            res.status(200).json({
                status: 'success',
                data: interactions
            });
        } catch (error) {
            logError(error, 'getAllTemplateInteractions');
            res.status(500).json({ 
                error: 'Error al obtener interacciones de templates',
                details: error.message
            });
        }
    }

    // Obtener interacciones de templates por producto
    async getTemplateInteractionsByProduct(req, res) {
        try {
            const { productId } = req.params;
            
            const interactions = await prisma.templateInteraction.findMany({
                where: { productId },
                include: {
                    product: true
                }
            });
            
            res.status(200).json({
                status: 'success',
                data: interactions
            });
        } catch (error) {
            logError(error, 'getTemplateInteractionsByProduct');
            res.status(500).json({ 
                error: 'Error al obtener interacciones de templates por producto',
                details: error.message
            });
        }
    }

    // Obtener una interacción de template por ID
    async getTemplateInteractionById(req, res) {
        try {
            const { id } = req.params;
            
            const interaction = await prisma.templateInteraction.findUnique({
                where: { id },
                include: {
                    product: true
                }
            });
            
            if (!interaction) {
                return res.status(404).json({
                    error: 'Interacción de template no encontrada'
                });
            }
            
            res.status(200).json({
                status: 'success',
                data: interaction
            });
        } catch (error) {
            logError(error, 'getTemplateInteractionById');
            res.status(500).json({ 
                error: 'Error al obtener la interacción de template',
                details: error.message
            });
        }
    }

    // Crear una nueva interacción de template
    async createTemplateInteraction(req, res) {
        try {
            // Validamos que los datos de ejemplo sean un array JSON válido
            let examples = req.body.examples;
            if (examples && typeof examples === 'string') {
                try {
                    examples = JSON.parse(examples);
                    req.body.examples = examples;
                } catch (e) {
                    return res.status(400).json({
                        error: 'El formato de ejemplos no es válido. Debe ser un array JSON.',
                        details: e.message
                    });
                }
            }
            
            const newInteraction = await prisma.templateInteraction.create({
                data: req.body,
                include: {
                    product: true
                }
            });
            
            res.status(201).json({
                status: 'success',
                data: newInteraction
            });
        } catch (error) {
            logError(error, 'createTemplateInteraction');
            
            if (error.code?.startsWith('P2')) {
                const { status, message, details } = handlePrismaError(error);
                return res.status(status).json({ error: message, details });
            }
            
            res.status(500).json({ 
                error: 'Error al crear la interacción de template',
                details: error.message
            });
        }
    }

    // Actualizar una interacción de template
    async updateTemplateInteraction(req, res) {
        try {
            const { id } = req.params;
            
            // Validamos que los datos de ejemplo sean un array JSON válido
            let examples = req.body.examples;
            if (examples && typeof examples === 'string') {
                try {
                    examples = JSON.parse(examples);
                    req.body.examples = examples;
                } catch (e) {
                    return res.status(400).json({
                        error: 'El formato de ejemplos no es válido. Debe ser un array JSON.',
                        details: e.message
                    });
                }
            }
            
            const updatedInteraction = await prisma.templateInteraction.update({
                where: { id },
                data: req.body,
                include: {
                    product: true
                }
            });
            
            res.status(200).json({
                status: 'success',
                data: updatedInteraction
            });
        } catch (error) {
            logError(error, 'updateTemplateInteraction');
            
            if (error.code === 'P2025') {
                return res.status(404).json({
                    error: 'Interacción de template no encontrada'
                });
            }
            
            if (error.code?.startsWith('P2')) {
                const { status, message, details } = handlePrismaError(error);
                return res.status(status).json({ error: message, details });
            }
            
            res.status(500).json({ 
                error: 'Error al actualizar la interacción de template',
                details: error.message
            });
        }
    }

    // Eliminar una interacción de template
    async deleteTemplateInteraction(req, res) {
        try {
            const { id } = req.params;
            
            await prisma.templateInteraction.delete({
                where: { id }
            });
            
            res.status(200).json({
                status: 'success',
                message: 'Interacción de template eliminada correctamente'
            });
        } catch (error) {
            logError(error, 'deleteTemplateInteraction');
            
            if (error.code === 'P2025') {
                return res.status(404).json({
                    error: 'Interacción de template no encontrada'
                });
            }
            
            res.status(500).json({ 
                error: 'Error al eliminar la interacción de template',
                details: error.message
            });
        }
    }
}

module.exports = new TemplateInteractionController(); 