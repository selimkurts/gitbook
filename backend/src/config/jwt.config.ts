import { JwtModuleOptions } from '@nestjs/jwt';

/**
 * JWT configuration
 */
export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'docflow-secret-key',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};