import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../shared/types/user.types';

/**
 * Roles decorator for role-based access control
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);