import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

/**
 * Database configuration for MikroORM
 */
export const databaseConfig = defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'docflow',
  password: process.env.DB_PASSWORD || 'docflow123',
  dbName: process.env.DB_NAME || 'docflow',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: process.env.NODE_ENV === 'development',
  migrations: {
    path: './migrations',
    emit: 'js',
  },
  extensions: [Migrator],
});