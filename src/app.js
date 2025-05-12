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
app.use('/api/contact-logs', contactLogRoutes);

module.exports = app; 