import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  Collection,
  OneToMany,
  ManyToOne,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UserRole } from '../../../shared/types/user.types';
import { Document } from '../../documents/entities/document.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { OrganizationMember } from '../../organizations/entities/organization-member.entity';

/**
 * User entity representing system users
 */
@Entity()
export class User {
  @PrimaryKey()
  id: string = v4();

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property({ unique: true })
  email: string;

  @Property({ hidden: true })
  password: string;

  @Enum(() => UserRole)
  role: UserRole = UserRole.VIEWER;

  @Property({ nullable: true })
  avatar?: string;

  @Property({ default: true })
  isActive: boolean = true;

  @Property({ nullable: true })
  lastLoginAt?: Date;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => Organization, { nullable: true })
  organization?: Organization;

  @OneToMany(() => Document, (document) => document.author)
  documents = new Collection<Document>(this);

  @OneToMany(() => OrganizationMember, (member) => member.user)
  organizationMemberships = new Collection<OrganizationMember>(this);

  /**
   * Get user's full name
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}