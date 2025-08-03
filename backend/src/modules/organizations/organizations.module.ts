import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Organization } from './entities/organization.entity';

/**
 * Organizations module handling organization-related operations
 */
@Module({
  imports: [MikroOrmModule.forFeature([Organization])],
  providers: [],
  controllers: [],
  exports: [],
})
export class OrganizationsModule {}