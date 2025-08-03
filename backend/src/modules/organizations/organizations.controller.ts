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
import { MemberRole } from './entities/organization-member.entity';
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
   * Create organization with current user as owner
   */
  @Post('create-with-owner')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create organization with current user as owner' })
  @ApiResponse({ status: 201, description: 'Organization created successfully' })
  @ApiResponse({ status: 409, description: 'Subdomain already exists' })
  async createOrganizationWithOwner(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.organizationsService.createOrganizationWithOwner(createOrganizationDto, currentUser.id);
  }

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
   * Get user's organizations with roles
   */
  @Get('my-organizations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user organizations' })
  @ApiResponse({ status: 200, description: 'User organizations retrieved successfully' })
  async getUserOrganizations(@CurrentUser() currentUser: User) {
    return this.organizationsService.getUserOrganizations(currentUser.id);
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
   * Add member to organization
   */
  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add member to organization' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User or organization not found' })
  @ApiResponse({ status: 409, description: 'User is already a member' })
  async addMember(
    @Param('id') organizationId: string,
    @Body() body: { userId: string; role?: MemberRole },
    @CurrentUser() currentUser: User,
  ) {
    return this.organizationsService.addMember(
      organizationId, 
      body.userId, 
      body.role || MemberRole.VIEWER, 
      currentUser.id
    );
  }

  /**
   * Update member role
   */
  @Put(':id/members/:memberId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update member role' })
  @ApiResponse({ status: 200, description: 'Member role updated successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async updateMemberRole(
    @Param('id') organizationId: string,
    @Param('memberId') memberId: string,
    @Body() body: { role: MemberRole },
    @CurrentUser() currentUser: User,
  ) {
    return this.organizationsService.updateMemberRole(
      organizationId, 
      memberId, 
      body.role, 
      currentUser.id
    );
  }

  /**
   * Remove member from organization
   */
  @Delete(':id/members/:memberId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove member from organization' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async removeMember(
    @Param('id') organizationId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() currentUser: User,
  ) {
    await this.organizationsService.removeMember(organizationId, memberId, currentUser.id);
    return { message: 'Member removed successfully' };
  }

  /**
   * Get organization members
   */
  @Get(':id/members')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization members' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getMembers(
    @Param('id') organizationId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.organizationsService.getMembers(organizationId, currentUser.id);
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