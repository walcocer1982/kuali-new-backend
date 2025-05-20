const Joi = require('joi');

// Esquemas de validación para Lead
const leadSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string(),
  companyId: Joi.string().guid({ version: 'uuidv4' }).required(),
  companyName: Joi.string(),
  industry: Joi.string(),
  companySize: Joi.string(),
  annualRevenue: Joi.number(),
  acquisitionCost: Joi.number(),
  leadScore: Joi.number().integer().min(0).max(100),
  leadSource: Joi.string(),
  campaignId: Joi.string(),
  utmSource: Joi.string(),
  utmMedium: Joi.string(),
  utmCampaign: Joi.string(),
  status: Joi.string().valid('NUEVO', 'CONTACTADO', 'CALIFICADO', 'CLIENTE', 'PERDIDO')
});

// Middleware de validación para Lead
const validateLead = (req, res, next) => {
  const { error } = leadSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Esquema de validación para búsqueda por teléfono
const phoneSearchSchema = Joi.object({
  phone: Joi.string().required()
});

// Middleware de validación para búsqueda por teléfono
const validatePhoneSearch = (req, res, next) => {
  const { error } = phoneSearchSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Middleware de validación para UUID
const validateUUID = (paramName) => {
  return (req, res, next) => {
    const uuidSchema = Joi.object({
      [paramName]: Joi.string().guid({ version: 'uuidv4' }).required()
    });

    const { error } = uuidSchema.validate({ [paramName]: req.params[paramName] });
    if (error) {
      return res.status(400).json({ error: `Invalid UUID format for ${paramName}` });
    }
    next();
  };
};

module.exports = {
  validateLead,
  validatePhoneSearch,
  validateUUID
}; 