import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  ManyToOne,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { DocumentStatus } from '../../../shared/types/user.types';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';

/**
 * Document entity representing documentation pages
 */
@Entity()
export class Document {
  @PrimaryKey()
  id: string = v4();

  @Property()
  title: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ type: 'text' })
  content: string;

  @Enum(() => DocumentStatus)
  status: DocumentStatus = DocumentStatus.DRAFT;

  @Property({ nullable: true })
  slug?: string;

  @Property({ default: false })
  isPublic: boolean = false;

  @Property({ default: 0 })
  views: number = 0;

  @Property({ nullable: true })
  publishedAt?: Date;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Organization, { nullable: true })
  organization?: Organization;

  /**
   * Check if document is published
   */
  get isPublished(): boolean {
    return this.status === DocumentStatus.PUBLISHED;
  }

  /**
   * Increment view count
   */
  incrementViews(): void {
    this.views += 1;
  }
}