import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Organization } from './entities/organization.entity';
import { OrganizationMember, MemberRole } from './entities/organization-member.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './models/organization.dto';

/**
 * Service for managing organizations
 */
@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: EntityRepository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: EntityRepository<OrganizationMember>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Create a new organization
   */
  async createOrganization(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    // Check if subdomain already exists
    const existingOrg = await this.organizationRepository.findOne({
      subdomain: createOrganizationDto.subdomain,
    });

    if (existingOrg) {
      throw new ConflictException('Subdomain already exists');
    }

    // Validate subdomain format
    if (!this.isValidSubdomain(createOrganizationDto.subdomain)) {
      throw new ConflictException('Invalid subdomain format');
    }

    const organization = new Organization();
    organization.name = createOrganizationDto.name;
    organization.subdomain = createOrganizationDto.subdomain.toLowerCase();
    organization.description = createOrganizationDto.description;
    organization.website = createOrganizationDto.website;
    organization.isPublic = createOrganizationDto.isPublic ?? true;

    await this.em.persistAndFlush(organization);
    return organization;
  }

  /**
   * Find organization by subdomain
   */
  async findBySubdomain(subdomain: string): Promise<Organization | null> {
    return this.organizationRepository.findOne(
      { subdomain: subdomain.toLowerCase(), isActive: true },
      { populate: ['documents'] }
    );
  }

  /**
   * Find organization by ID
   */
  async findById(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne(
      { id, isActive: true },
      { populate: ['users', 'documents'] }
    );

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  /**
   * Get all organizations
   */
  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.findAll({
      populate: ['users', 'documents'],
    });
  }

  /**
   * Update organization
   */
  async updateOrganization(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.findById(id);

    // If subdomain is being changed, check for conflicts
    if (updateOrganizationDto.subdomain && updateOrganizationDto.subdomain !== organization.subdomain) {
      const existingOrg = await this.organizationRepository.findOne({
        subdomain: updateOrganizationDto.subdomain,
      });

      if (existingOrg) {
        throw new ConflictException('Subdomain already exists');
      }

      if (!this.isValidSubdomain(updateOrganizationDto.subdomain)) {
        throw new ConflictException('Invalid subdomain format');
      }

      organization.subdomain = updateOrganizationDto.subdomain.toLowerCase();
    }

    if (updateOrganizationDto.name) organization.name = updateOrganizationDto.name;
    if (updateOrganizationDto.description !== undefined) organization.description = updateOrganizationDto.description;
    if (updateOrganizationDto.website !== undefined) organization.website = updateOrganizationDto.website;
    if (updateOrganizationDto.isPublic !== undefined) organization.isPublic = updateOrganizationDto.isPublic;

    await this.em.persistAndFlush(organization);
    return organization;
  }

  /**
   * Delete organization (soft delete)
   */
  async deleteOrganization(id: string): Promise<void> {
    const organization = await this.findById(id);
    organization.isActive = false;
    await this.em.persistAndFlush(organization);
  }

  /**
   * Check if subdomain format is valid
   */
  private isValidSubdomain(subdomain: string): boolean {
    // Subdomain should be alphanumeric with hyphens, 3-63 characters
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
    
    // Reserved subdomains
    const reservedSubdomains = [
      'www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog', 'docs',
      'support', 'help', 'status', 'staging', 'dev', 'test'
    ];

    return (
      subdomainRegex.test(subdomain.toLowerCase()) &&
      !reservedSubdomains.includes(subdomain.toLowerCase()) &&
      subdomain.length >= 3 &&
      subdomain.length <= 63
    );
  }

  /**
   * Get organization public documents
   */
  async getPublicDocuments(subdomain: string): Promise<any> {
    const organization = await this.findBySubdomain(subdomain);
    
    if (!organization || !organization.isPublic) {
      throw new NotFoundException('Organization not found or not public');
    }

    return {
      organization: {
        name: organization.name,
        description: organization.description,
        subdomain: organization.subdomain,
        website: organization.website,
        logo: organization.logo,
      },
      documents: organization.documents
        .getItems()
        .filter(doc => doc.isPublic && doc.isPublished)
        .map(doc => ({
          id: doc.id,
          title: doc.title,
          description: doc.description,
          slug: doc.slug,
          content: doc.content,
          views: doc.views,
          publishedAt: doc.publishedAt,
          updatedAt: doc.updatedAt,
        })),
    };
  }

  /**
   * Add a member to organization
   */
  async addMember(organizationId: string, userId: string, role: MemberRole = MemberRole.VIEWER, currentUserId: string): Promise<OrganizationMember> {
    // Check if current user has permission to add members
    await this.checkMemberPermission(organizationId, currentUserId, [MemberRole.OWNER, MemberRole.ADMIN]);

    const organization = await this.findById(organizationId);
    const user = await this.em.findOne(User, { id: userId });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a member
    const existingMember = await this.memberRepository.findOne({ 
      user: { id: userId }, 
      organization: { id: organizationId },
      isActive: true 
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this organization');
    }

    const member = new OrganizationMember(user, organization, role);
    await this.em.persistAndFlush(member);

    return member;
  }

  /**
   * Update member role
   */
  async updateMemberRole(organizationId: string, memberId: string, newRole: MemberRole, currentUserId: string): Promise<OrganizationMember> {
    // Check if current user has permission to update roles
    await this.checkMemberPermission(organizationId, currentUserId, [MemberRole.OWNER, MemberRole.ADMIN]);

    const member = await this.memberRepository.findOne({ 
      id: memberId, 
      organization: { id: organizationId },
      isActive: true 
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    member.role = newRole;
    await this.em.persistAndFlush(member);

    return member;
  }

  /**
   * Remove member from organization
   */
  async removeMember(organizationId: string, memberId: string, currentUserId: string): Promise<void> {
    // Check if current user has permission to remove members
    await this.checkMemberPermission(organizationId, currentUserId, [MemberRole.OWNER, MemberRole.ADMIN]);

    const member = await this.memberRepository.findOne({ 
      id: memberId, 
      organization: { id: organizationId },
      isActive: true 
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Don't allow removing the owner
    if (member.role === MemberRole.OWNER) {
      throw new ForbiddenException('Cannot remove organization owner');
    }

    member.isActive = false;
    await this.em.persistAndFlush(member);
  }

  /**
   * Get organization members
   */
  async getMembers(organizationId: string, currentUserId: string): Promise<OrganizationMember[]> {
    // Check if current user is a member of the organization
    await this.checkMemberPermission(organizationId, currentUserId, [MemberRole.OWNER, MemberRole.ADMIN, MemberRole.EDITOR, MemberRole.VIEWER]);

    return this.memberRepository.find({ 
      organization: { id: organizationId },
      isActive: true 
    }, { 
      populate: ['user']
    });
  }

  /**
   * Get user's organizations with their roles
   */
  async getUserOrganizations(userId: string): Promise<OrganizationMember[]> {
    return this.memberRepository.find({ 
      user: { id: userId },
      isActive: true 
    }, { 
      populate: ['organization']
    });
  }

  /**
   * Check if user has required permission in organization
   */
  async checkMemberPermission(organizationId: string, userId: string, requiredRoles: MemberRole[]): Promise<void> {
    const member = await this.memberRepository.findOne({ 
      user: { id: userId }, 
      organization: { id: organizationId },
      isActive: true 
    });

    if (!member || !requiredRoles.includes(member.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }

  /**
   * Get user's role in organization
   */
  async getUserRole(organizationId: string, userId: string): Promise<MemberRole | null> {
    const member = await this.memberRepository.findOne({ 
      user: { id: userId }, 
      organization: { id: organizationId },
      isActive: true 
    });

    return member?.role || null;
  }

  /**
   * Create organization with owner
   */
  async createOrganizationWithOwner(createOrganizationDto: CreateOrganizationDto, ownerId: string): Promise<{ organization: Organization, membership: OrganizationMember }> {
    // First create the organization
    const organization = await this.createOrganization(createOrganizationDto);
    
    // Then add the creator as owner
    const owner = await this.em.findOne(User, { id: ownerId });
    if (!owner) {
      throw new NotFoundException('Owner user not found');
    }

    const membership = new OrganizationMember(owner, organization, MemberRole.OWNER);
    await this.em.persistAndFlush(membership);

    return { organization, membership };
  }
}