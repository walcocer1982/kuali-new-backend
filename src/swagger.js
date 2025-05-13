const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// Ejemplo de respuestas estandarizadas
const standardResponse = {
  success: (data) => ({
    status: 'success',
    data
  }),
  
  error: (error) => ({
    status: 'error',
    error: error.message || 'Error interno',
    details: error.details || null,
    code: error.code || 500
  })
};

// Ejemplo de validación de entrada
const validateInput = (data) => {
  if (!data.leadId || !data.templateId) {
    throw {
      error: 'Error de validación',
      details: 'Los campos leadId y templateId son obligatorios'
    };
  }
  
  // Validación de UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(data.leadId) || !uuidRegex.test(data.templateId)) {
    throw {
      error: 'Error de validación',
      details: 'Los IDs deben ser UUIDs válidos'
    };
  }
};

// Ejemplo de transición de estados
const validTransitions = {
  PENDIENTE: ['ENVIADO', 'FALLIDO'],
  ENVIADO: ['ENTREGADO', 'FALLIDO'],
  ENTREGADO: ['LEIDO', 'FALLIDO'],
  LEIDO: ['RESPONDIDO', 'FALLIDO']
};

const validateStatusTransition = (currentStatus, newStatus) => {
  if (!validTransitions[currentStatus]?.includes(newStatus)) {
    throw {
      error: 'Transición inválida',
      details: `No se puede cambiar de ${currentStatus} a ${newStatus}`,
      allowedTransitions: validTransitions[currentStatus]
    };
  }
};

// Ejemplo de sistema de logging
const logError = (error, context) => {
  console.error({
    timestamp: new Date().toISOString(),
    context,
    error: {
      message: error.message,
      stack: error.stack,
      details: error.details
    }
  });
};

// Ejemplo de middleware de validación
const securityMiddleware = (req, res, next) => {
  try {
    // Validación de headers
    if (!req.headers['x-api-key']) {
      return res.status(401).json({
        error: 'Autenticación requerida',
        details: 'API key no proporcionada'
      });
    }
    
    // Sanitización de datos
    req.body = sanitizeInput(req.body);
    next();
  } catch (error) {
    res.status(400).json(standardResponse.error(error));
  }
};

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}; 