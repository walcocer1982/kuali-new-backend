import { Request, Response } from 'express';
import { Lead } from '../models/lead.model';

export class LeadController {
    async searchByPhone(req: Request, res: Response) {
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
            
            // Creamos un patrón que sea flexible con espacios y caracteres especiales
            const phonePattern = cleanedPhone.split('').join('[\\s\\+\\-\\(\\)]*');
            
            const leads = await Lead.find({ 
                phoneNumber: { $regex: phonePattern, $options: 'i' }
            });

            return res.status(200).json({
                success: true,
                data: leads
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al buscar leads',
                error: error.message
            });
        }
    }
} 