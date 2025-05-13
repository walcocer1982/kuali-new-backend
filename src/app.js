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

app.use('/companies', companyRoutes);
app.use('/leads', leadRoutes);
app.use('/templates', templateRoutes);
app.use('/contact-logs', contactLogRoutes);

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