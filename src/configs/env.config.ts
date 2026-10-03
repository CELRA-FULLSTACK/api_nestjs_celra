import { registerAs } from '@nestjs/config';

export const envConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  database: {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'celra_db',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'celra_default_jwt_secret_dev_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  resetToken: {
    expiresMinutes: parseInt(process.env.RESET_TOKEN_EXPIRES_MINUTES || '15', 10),
  },
}));
