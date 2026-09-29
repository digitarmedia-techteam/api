import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 API Server running in ${env.NODE_ENV} mode`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📜 Script URL: http://localhost:${PORT}/v2/get`);
  console.log(`💡 HTML Usage:  <script src="http://localhost:${PORT}/v2/get"></script>`);
  console.log(`===============================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to gracefully exit
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
  process.exit(1);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down HTTP server...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  // Force shutdown after timeout if pending connections won't close
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;
