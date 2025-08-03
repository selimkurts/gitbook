import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

/**
 * MikroORM CLI configuration
 */
const config = defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'docflow',
  password: process.env.DB_PASSWORD || 'docflow123',
  dbName: process.env.DB_NAME || 'docflow',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true,
  migrations: {
    path: './migrations',
    transactional: true,
    allOrNothing: true,
    emit: 'js',
  },
  extensions: [Migrator],
});

export default config;