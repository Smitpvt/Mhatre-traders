import { env } from './env.js';

const allowedOrigins = env.CLIENT_URLS.split(',')
  .map(url => url.trim())
  .filter(Boolean);

export const corsOptions = {
  origin: (origin, callback) => {
    // In development, allow requests with no origin (e.g. Postman, curl, internal tests)
    if (!origin) {
      if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
        return callback(null, true);
      }
      return callback(new Error('CORS Policy: Request origin is missing'));
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS Policy: Origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['set-cookie']
};
export default corsOptions;
