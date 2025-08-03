import {
  Entity,
  PrimaryKey,
  Property,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from '../../users/entities/user.entity';
import { Document } from '../../documents/entities/document.entity';

/**
 * Organization entity representing companies or teams
 */
@Entity()
export class Organization {
  @PrimaryKey()
  id: string = v4();

  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  website?: string;

  @Property({ nullable: true })
  logo?: string;

  @Property({ default: true })
  isActive: boolean = true;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => User, (user) => user.organization)
  users = new Collection<User>(this);

  @OneToMany(() => Document, (document) => document.organization)
  documents = new Collection<Document>(this);
}