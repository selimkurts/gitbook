import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './entities/document.entity';
import { OrganizationMember } from '../organizations/entities/organization-member.entity';

/**
 * Documents module handling document-related operations
 */
@Module({
  imports: [MikroOrmModule.forFeature([Document, OrganizationMember])],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}