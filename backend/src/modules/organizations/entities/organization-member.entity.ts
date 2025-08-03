import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { User } from '../../users/entities/user.entity'
import { Organization } from './organization.entity'

export enum MemberRole {
	OWNER = 'owner',
	ADMIN = 'admin', 
	EDITOR = 'editor',
	VIEWER = 'viewer'
}

@Entity()
export class OrganizationMember {
	@PrimaryKey()
	id: string = v4()

	@ManyToOne(() => User)
	user!: User

	@ManyToOne(() => Organization)
	organization!: Organization

	@Enum(() => MemberRole)
	role: MemberRole = MemberRole.VIEWER

	@Property()
	joinedAt: Date = new Date()

	@Property({ onUpdate: () => new Date() })
	updatedAt: Date = new Date()

	@Property()
	isActive: boolean = true

	constructor(user: User, organization: Organization, role: MemberRole = MemberRole.VIEWER) {
		this.user = user
		this.organization = organization
		this.role = role
	}
}