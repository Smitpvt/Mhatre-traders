import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import corsOptions from './config/cors.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import { httpLogger } from './middlewares/logging.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import { ApiError } from './utils/apiError.js';
import baseRouter from './routes/index.js';

const app = express();

// Trust reverse proxy (Render, Heroku, Supabase, Cloudflare, etc.)
// Required for correct client IP detection in rate limiting and logs
app.set('trust proxy', 1);

// Apply security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Apply dynamic CORS policies
app.use(cors(corsOptions));

// Apply Pino structured HTTP logger
app.use(httpLogger);

// Apply request rate throttling
app.use(globalLimiter);

// Compress response payloads
app.use(compression());

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Mount backend API router
app.use(baseRouter);

// Catch unregistered routes (404 Handler)
app.use('*', (req, res, next) => {
  next(new ApiError(404, `Endpoint ${req.originalUrl} does not exist`));
});

// Global central error handler
app.use(errorHandler);

export default app;
