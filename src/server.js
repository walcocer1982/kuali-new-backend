const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Configurar servidor con timeouts extendidos
const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});

// Configurar timeouts para evitar errores 502
server.keepAliveTimeout = 120000; // 120 segundos
server.headersTimeout = 120000; // 120 segundos 