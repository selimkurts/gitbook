import { IsString, IsOptional, IsBoolean, IsUrl, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating an organization
 */
export class CreateOrganizationDto {
  @ApiProperty({ description: 'Organization name', example: 'Acme Corp' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ 
    description: 'Subdomain for the organization', 
    example: 'acme',
    pattern: '^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$'
  })
  @IsString()
  @MinLength(3)
  @MaxLength(63)
  @Matches(/^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/, {
    message: 'Subdomain must be lowercase alphanumeric with hyphens only'
  })
  subdomain: string;

  @ApiPropertyOptional({ description: 'Organization description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Organization website URL' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Whether organization is publicly accessible', default: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

/**
 * DTO for updating an organization
 */
export class UpdateOrganizationDto {
  @ApiPropertyOptional({ description: 'Organization name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Subdomain for the organization',
    pattern: '^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$'
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(63)
  @Matches(/^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/, {
    message: 'Subdomain must be lowercase alphanumeric with hyphens only'
  })
  subdomain?: string;

  @ApiPropertyOptional({ description: 'Organization description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Organization website URL' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Whether organization is publicly accessible' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

/**
 * Response DTO for organization data
 */
export class OrganizationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  subdomain: string;

  @ApiPropertyOptional()
  customDomain?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  logo?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

/**
 * Public organization info DTO (for subdomain access)
 */
export class PublicOrganizationDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  subdomain: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  logo?: string;

  @ApiProperty({ type: 'array' })
  documents: PublicDocumentDto[];
}

/**
 * Public document DTO for organization subdomain
 */
export class PublicDocumentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  slug?: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  views: number;

  @ApiPropertyOptional()
  publishedAt?: Date;

  @ApiProperty()
  updatedAt: Date;
}