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
            
            // Si el número no incluye código de país, creamos dos patrones
            let phonePatterns = [];
            
            // Patrón 1: Número exacto como fue ingresado
            phonePatterns.push(cleanedPhone.split('').join('[\\s\\+\\-\\(\\)]*'));
            
            // Patrón 2: Si no empieza con 51, agregamos el patrón con 51 opcional
            if (!cleanedPhone.startsWith('51')) {
                const withCountryCode = `51${cleanedPhone}`;
                phonePatterns.push(withCountryCode.split('').join('[\\s\\+\\-\\(\\)]*'));
            }
            
            // Patrón 3: Si empieza con 51, también buscamos sin el código de país
            if (cleanedPhone.startsWith('51')) {
                const withoutCountryCode = cleanedPhone.substring(2);
                phonePatterns.push(withoutCountryCode.split('').join('[\\s\\+\\-\\(\\)]*'));
            }

            const leads = await Lead.find({ 
                $or: phonePatterns.map(pattern => ({
                    phoneNumber: { $regex: pattern, $options: 'i' }
                }))
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