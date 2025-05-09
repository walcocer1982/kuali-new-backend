const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

// Importar Swagger
require('./swagger')(app);

// Routes
const companyRoutes = require('./routes/companyRoutes');
const leadRoutes = require('./routes/leadRoutes');
const templateRoutes = require('./routes/templateRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/companies', companyRoutes);
app.use('/leads', leadRoutes);
app.use('/templates', templateRoutes);
app.use('/contacts', contactRoutes);

module.exports = app; 