import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { Document } from './entities/document.entity';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationMember, MemberRole } from '../organizations/entities/organization-member.entity';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
} from './models/document.dto';
import { DocumentStatus, UserRole } from '../../shared/types/user.types';

/**
 * Documents service for document management operations
 */
@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: EntityRepository<Document>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: EntityRepository<OrganizationMember>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Create a new document
   */
  async createDocument(
    createDocumentDto: CreateDocumentDto,
    author: User,
  ): Promise<Document> {
    const document = new Document();
    document.title = createDocumentDto.title;
    document.description = createDocumentDto.description;
    document.content = createDocumentDto.content;
    document.status = createDocumentDto.status || DocumentStatus.DRAFT;
    document.isPublic = createDocumentDto.isPublic || false;
    document.author = author;
    document.organization = author.organization;
    document.slug = this.generateSlug(createDocumentDto.title);

    await this.em.persistAndFlush(document);
    return document;
  }

  /**
   * Get all documents with pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    user?: User,
  ): Promise<[Document[], number]> {
    const offset = (page - 1) * limit;
    const where: any = {};

    // If user is not admin, only show their documents or public ones
    if (user && user.role !== UserRole.ADMIN) {
      where.$or = [
        { author: user.id },
        { isPublic: true, status: DocumentStatus.PUBLISHED },
      ];
    }

    return this.documentRepository.findAndCount(where, {
      offset,
      limit,
      populate: ['author'],
      orderBy: { updatedAt: 'DESC' },
    });
  }

  /**
   * Find document by ID
   */
  async findById(id: string, user?: User): Promise<Document> {
    const document = await this.documentRepository.findOne(
      { id },
      { populate: ['author', 'organization'] },
    );

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Check access permissions
    if (!this.canAccessDocument(document, user)) {
      throw new ForbiddenException('Access denied to this document');
    }

    // Increment view count for published documents
    if (document.status === DocumentStatus.PUBLISHED) {
      document.incrementViews();
      await this.em.persistAndFlush(document);
    }

    return document;
  }

  /**
   * Find document by slug
   */
  async findBySlug(slug: string, user?: User): Promise<Document> {
    const document = await this.documentRepository.findOne(
      { slug },
      { populate: ['author', 'organization'] },
    );

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (!this.canAccessDocument(document, user)) {
      throw new ForbiddenException('Access denied to this document');
    }

    if (document.status === DocumentStatus.PUBLISHED) {
      document.incrementViews();
      await this.em.persistAndFlush(document);
    }

    return document;
  }

  /**
   * Update document
   */
  async updateDocument(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    user: User,
  ): Promise<Document> {
    const document = await this.documentRepository.findOne({ id });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (!this.canEditDocument(document, user)) {
      throw new ForbiddenException('Access denied to edit this document');
    }

    // Update fields
    Object.assign(document, updateDocumentDto);

    // Update slug if title changed
    if (updateDocumentDto.title) {
      document.slug = this.generateSlug(updateDocumentDto.title);
    }

    // Set published date if status changed to published
    if (
      updateDocumentDto.status === DocumentStatus.PUBLISHED &&
      document.status !== DocumentStatus.PUBLISHED
    ) {
      document.publishedAt = new Date();
    }

    await this.em.persistAndFlush(document);
    return document;
  }

  /**
   * Delete document
   */
  async deleteDocument(id: string, user: User): Promise<void> {
    const document = await this.documentRepository.findOne({ id });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (!this.canEditDocument(document, user)) {
      throw new ForbiddenException('Access denied to delete this document');
    }

    await this.em.removeAndFlush(document);
  }

  /**
   * Get user's documents
   */
  async getUserDocuments(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<[Document[], number]> {
    const offset = (page - 1) * limit;
    return this.documentRepository.findAndCount(
      { author: userId },
      {
        offset,
        limit,
        populate: ['author'],
        orderBy: { updatedAt: 'DESC' },
      },
    );
  }

  /**
   * Check if user can access document
   */
  private canAccessDocument(document: Document, user?: User): boolean {
    // Public published documents are accessible to everyone
    if (document.isPublic && document.status === DocumentStatus.PUBLISHED) {
      return true;
    }

    // No user means anonymous access
    if (!user) {
      return false;
    }

    // Admin can access everything
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Author can access their own documents
    if (document.author.id === user.id) {
      return true;
    }

    // Organization members can access organization documents
    if (
      document.organization &&
      user.organization &&
      document.organization.id === user.organization.id
    ) {
      return true;
    }

    return false;
  }

  /**
   * Check if user can edit document
   */
  private canEditDocument(document: Document, user: User): boolean {
    // Admin can edit everything
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Author can edit their own documents
    if (document.author.id === user.id) {
      return true;
    }

    // Editors in the same organization can edit
    if (
      user.role === UserRole.EDITOR &&
      document.organization &&
      user.organization &&
      document.organization.id === user.organization.id
    ) {
      return true;
    }

    return false;
  }

  /**
   * Generate URL-friendly slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Create document for specific organization
   */
  async createDocumentForOrganization(
    createDocumentDto: CreateDocumentDto,
    organizationId: string,
    userId: string,
  ): Promise<Document> {
    // Check if user has permission to create documents in this organization
    await this.checkOrganizationPermission(organizationId, userId, [
      MemberRole.OWNER,
      MemberRole.ADMIN,
      MemberRole.EDITOR,
    ]);

    const user = await this.em.findOne(User, { id: userId });
    const organization = await this.em.findOne(Organization, { id: organizationId });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const document = new Document();
    document.title = createDocumentDto.title;
    document.description = createDocumentDto.description;
    document.content = createDocumentDto.content;
    document.slug = this.generateSlug(createDocumentDto.title);
    document.status = createDocumentDto.status || DocumentStatus.DRAFT;
    document.author = user;
    document.organization = organization;

    await this.em.persistAndFlush(document);
    return document;
  }

  /**
   * Get documents for organization that user can access
   */
  async getOrganizationDocuments(organizationId: string, userId: string): Promise<Document[]> {
    // Check if user is a member of the organization
    await this.checkOrganizationPermission(organizationId, userId, [
      MemberRole.OWNER,
      MemberRole.ADMIN,
      MemberRole.EDITOR,
      MemberRole.VIEWER,
    ]);

    return this.documentRepository.find(
      { organization: { id: organizationId } },
      { 
        populate: ['author', 'organization'],
        orderBy: { updatedAt: 'DESC' }
      }
    );
  }

  /**
   * Get user's organizations where they can create documents
   */
  async getUserWritableOrganizations(userId: string): Promise<OrganizationMember[]> {
    return this.memberRepository.find({
      user: { id: userId },
      role: { $in: [MemberRole.OWNER, MemberRole.ADMIN, MemberRole.EDITOR] },
      isActive: true,
    }, {
      populate: ['organization']
    });
  }

  /**
   * Check if user has required permission in organization
   */
  private async checkOrganizationPermission(
    organizationId: string,
    userId: string,
    requiredRoles: MemberRole[],
  ): Promise<void> {
    const member = await this.memberRepository.findOne({
      user: { id: userId },
      organization: { id: organizationId },
      isActive: true,
    });

    if (!member || !requiredRoles.includes(member.role)) {
      throw new ForbiddenException('Insufficient permissions in organization');
    }
  }
}