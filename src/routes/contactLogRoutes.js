const express = require('express');
const router = express.Router();
const contactLogController = require('../controllers/contactLogController');

// Middleware de validación UUID mejorado
const validateUUID = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!id || !uuidRegex.test(id)) {
    return res.status(400).json({ 
      error: 'ID inválido',
      details: `El parámetro ${paramName} debe ser un UUID válido`,
      received: id
    });
  }
  next();
};

// Middleware de validación de estado
const validateStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'LEIDO', 'RESPONDIDO', 'FALLIDO'];
  
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Estado inválido',
      details: `El estado debe ser uno de: ${validStatuses.join(', ')}`,
      received: status
    });
  }
  next();
};

// Rutas con validación mejorada
router.get('/', contactLogController.getAllContactLogs);
router.post('/', validateUUID('leadId'), validateUUID('templateId'), validateStatus, contactLogController.createContactLog);
router.get('/:id', validateUUID('id'), contactLogController.getContactLogById);
router.put('/:id', validateUUID('id'), validateStatus, contactLogController.updateContactLog);
router.delete('/:id', validateUUID('id'), contactLogController.deleteContactLog);
router.get('/lead/:leadId', validateUUID('leadId'), contactLogController.getContactLogsByLead);
router.get('/template/:templateId', validateUUID('templateId'), contactLogController.getContactLogsByTemplate);

module.exports = router; 