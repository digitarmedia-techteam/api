import morgan from 'morgan';
import { env } from '../config/env.js';

/**
 * HTTP request logger middleware using morgan
 */
export const requestLogger = env.isProduction
  ? morgan('combined')
  : morgan(':method :url :status :res[content-length] - :response-time ms');

export default requestLogger;
