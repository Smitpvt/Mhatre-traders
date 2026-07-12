import pino from 'pino';
import pinoHttp from 'pino-http';
import { env } from '../config/env.js';

const loggerOptions = {
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
};

if (env.NODE_ENV !== 'production' && env.NODE_ENV !== 'test') {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(loggerOptions);

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      origin: req.headers ? req.headers.origin : undefined,
      ip: (req.headers && req.headers['x-forwarded-for']) || 
          (req.socket && req.socket.remoteAddress) || 
          (req.connection && req.connection.remoteAddress) || 
          req.ip,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

export default httpLogger;
