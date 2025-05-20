const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Health Check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Swagger Setup
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
const companyRoutes = require('./routes/companyRoutes');
const leadRoutes = require('./routes/leadRoutes');
const templateRoutes = require('./routes/templateRoutes');
const contactLogRoutes = require('./routes/contactLogRoutes');
const productRoutes = require('./routes/productRoutes');
const templateInteractionRoutes = require('./routes/templateInteractionRoutes');

// Configuración de rutas con el prefijo /api/v1
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/contact-logs', contactLogRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/template-interactions', templateInteractionRoutes);

// Implementar manejo de reintentos en el cliente
const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status !== 502) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Esperar antes de reintentar (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
};

module.exports = app; 