import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { databaseConfig } from './config/database.config';
import { SubdomainMiddleware } from './core/middleware/subdomain.middleware';

/**
 * Main application module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MikroOrmModule.forRoot(databaseConfig),
    AuthModule,
    UsersModule,
    DocumentsModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SubdomainMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
