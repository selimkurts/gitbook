import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  Req,
  NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { 
  CreateOrganizationDto, 
  UpdateOrganizationDto, 
  OrganizationResponseDto,
  PublicOrganizationDto 
} from './models/organization.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { SubdomainRequest } from '../../core/middleware/subdomain.middleware';

/**
 * Organizations controller handling organization management
 */
@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  /**
   * Create a new organization
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, description: 'Organization created successfully', type: OrganizationResponseDto })
  @ApiResponse({ status: 409, description: 'Subdomain already exists' })
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser() user: User,
  ): Promise<OrganizationResponseDto> {
    const organization = await this.organizationsService.createOrganization(createOrganizationDto);
    return organization;
  }

  /**
   * Get all organizations (admin only)
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved successfully', type: [OrganizationResponseDto] })
  async getAllOrganizations(): Promise<OrganizationResponseDto[]> {
    return this.organizationsService.findAll();
  }

  /**
   * Get organization by ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization found', type: OrganizationResponseDto })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getOrganization(@Param('id') id: string): Promise<OrganizationResponseDto> {
    return this.organizationsService.findById(id);
  }

  /**
   * Update organization
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully', type: OrganizationResponseDto })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiResponse({ status: 409, description: 'Subdomain already exists' })
  async updateOrganization(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.updateOrganization(id, updateOrganizationDto);
  }

  /**
   * Delete organization
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete organization' })
  @ApiResponse({ status: 200, description: 'Organization deleted successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async deleteOrganization(@Param('id') id: string): Promise<{ message: string }> {
    await this.organizationsService.deleteOrganization(id);
    return { message: 'Organization deleted successfully' };
  }

  /**
   * Get organization by subdomain (public endpoint)
   */
  @Get('public/subdomain/:subdomain')
  @ApiOperation({ summary: 'Get public organization data by subdomain' })
  @ApiResponse({ status: 200, description: 'Organization found', type: PublicOrganizationDto })
  @ApiResponse({ status: 404, description: 'Organization not found or not public' })
  async getPublicOrganization(@Param('subdomain') subdomain: string): Promise<PublicOrganizationDto> {
    return this.organizationsService.getPublicDocuments(subdomain);
  }

  /**
   * Admin test endpoint
   */
  @Get('admin/test')
  @ApiOperation({ summary: 'Test endpoint for organizations' })
  @ApiResponse({ status: 200, description: 'Test successful' })
  async adminTest(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'Organizations API is working!',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Public subdomain controller for handling subdomain requests
 */
@Controller()
export class SubdomainController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  /**
   * Handle subdomain requests
   */
  @Get()
  @ApiOperation({ summary: 'Get organization content by subdomain' })
  @ApiResponse({ status: 200, description: 'Organization content', type: PublicOrganizationDto })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getSubdomainContent(@Req() req: SubdomainRequest): Promise<PublicOrganizationDto> {
    // If this is a subdomain request
    if (req.isSubdomain && req.subdomain) {
      return this.organizationsService.getPublicDocuments(req.subdomain);
    }
    
    // If not a subdomain, return 404 or redirect to main app
    throw new NotFoundException('Organization not found');
  }

  /**
   * Get specific document from subdomain
   */
  @Get('docs/:slug')
  @ApiOperation({ summary: 'Get specific document by slug from subdomain' })
  @ApiResponse({ status: 200, description: 'Document found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getSubdomainDocument(
    @Req() req: SubdomainRequest,
    @Param('slug') slug: string,
  ): Promise<any> {
    if (!req.isSubdomain || !req.subdomain) {
      throw new NotFoundException('Organization not found');
    }

    const orgData = await this.organizationsService.getPublicDocuments(req.subdomain);
    const document = orgData.documents.find((doc: any) => doc.slug === slug);
    
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return {
      organization: orgData.organization,
      document,
    };
  }
}