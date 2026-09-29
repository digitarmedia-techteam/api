import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { env } from './config/env.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { apiRateLimiter } from './middlewares/rateLimiter.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// 1. Security & Protection Middlewares (permissive for script serving)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

// CORS configuration (allow any origin/file:// to load scripts)
app.use(cors({ origin: '*' }));

// 2. Performance & Utility Middlewares
app.use(compression());
app.use(requestLogger);

// 3. Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Rate Limiting for all incoming requests
app.use(apiRateLimiter);

// 5. Mount API Routes
app.use('/', routes);

// 6. 404 Handler for undefined routes
app.use(notFoundHandler);

// 7. Global Centralized Error Handler
app.use(errorHandler);

export default app;
