import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentResponseDto,
} from './models/document.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../../shared/types/user.types';
import { Document } from './entities/document.entity';

/**
 * Documents controller handling document CRUD operations
 */
@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * Create a new document
   */
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({
    status: 201,
    description: 'Document successfully created',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @CurrentUser() user: User,
  ): Promise<Document> {
    return this.documentsService.createDocument(createDocumentDto, user);
  }

  /**
   * Get all documents with pagination
   */
  @ApiOperation({ summary: 'Get all documents' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
  })
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() user?: User,
  ): Promise<{ documents: Document[]; total: number; page: number; limit: number }> {
    const [documents, total] = await this.documentsService.findAll(
      page,
      limit,
      user,
    );
    
    return {
      documents,
      total,
      page,
      limit,
    };
  }

  /**
   * Get document by ID
   */
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({
    status: 200,
    description: 'Document retrieved successfully',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() user?: User,
  ): Promise<Document> {
    return this.documentsService.findById(id, user);
  }

  /**
   * Get document by slug
   */
  @ApiOperation({ summary: 'Get document by slug' })
  @ApiResponse({
    status: 200,
    description: 'Document retrieved successfully',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @Get('slug/:slug')
  async findBySlug(
    @Param('slug') slug: string,
    @CurrentUser() user?: User,
  ): Promise<Document> {
    return this.documentsService.findBySlug(slug, user);
  }

  /**
   * Update document
   */
  @ApiOperation({ summary: 'Update document' })
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateDocument(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @CurrentUser() user: User,
  ): Promise<Document> {
    return this.documentsService.updateDocument(id, updateDocumentDto, user);
  }

  /**
   * Delete document
   */
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({ status: 204, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteDocument(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.documentsService.deleteDocument(id, user);
  }

  /**
   * Get current user's documents
   */
  @ApiOperation({ summary: 'Get current user documents' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'User documents retrieved' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my/documents')
  async getMyDocuments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() user: User,
  ): Promise<{ documents: Document[]; total: number; page: number; limit: number }> {
    const [documents, total] = await this.documentsService.getUserDocuments(
      user.id,
      page,
      limit,
    );
    
    return {
      documents,
      total,
      page,
      limit,
    };
  }

  /**
   * Create document for specific organization
   */
  @Post('organization/:organizationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create document for specific organization' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions in organization' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async createDocumentForOrganization(
    @Param('organizationId') organizationId: string,
    @Body() createDocumentDto: CreateDocumentDto,
    @CurrentUser() user: User,
  ) {
    return this.documentsService.createDocumentForOrganization(
      createDocumentDto,
      organizationId,
      user.id
    );
  }

  /**
   * Get documents for specific organization
   */
  @Get('organization/:organizationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get documents for specific organization' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions in organization' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getOrganizationDocuments(
    @Param('organizationId') organizationId: string,
    @CurrentUser() user: User,
  ) {
    return this.documentsService.getOrganizationDocuments(organizationId, user.id);
  }

  /**
   * Get user's writable organizations
   */
  @Get('writable-organizations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organizations where user can create documents' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved successfully' })
  async getUserWritableOrganizations(@CurrentUser() user: User) {
    return this.documentsService.getUserWritableOrganizations(user.id);
  }

  /**
   * Health check endpoint for documents module
   */
  @ApiOperation({ summary: 'Documents module health check' })
  @ApiResponse({ status: 200, description: 'Documents module is healthy' })
  @Get('admin/test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async test(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'Documents module is working correctly',
      timestamp: new Date().toISOString(),
    };
  }
}