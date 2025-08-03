/**
 * User role enumeration
 */
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

/**
 * Document status enumeration
 */
export enum DocumentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * JWT payload interface
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  organizationId?: string;
}