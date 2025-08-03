import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Organization } from './entities/organization.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController, SubdomainController } from './organizations.controller';

/**
 * Organizations module handling organization-related operations
 */
@Module({
  imports: [MikroOrmModule.forFeature([Organization, OrganizationMember])],
  providers: [OrganizationsService],
  controllers: [OrganizationsController, SubdomainController],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}