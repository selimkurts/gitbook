import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Custom Request interface with subdomain information
 */
export interface SubdomainRequest extends Request {
  subdomain?: string;
  isSubdomain?: boolean;
  organizationSlug?: string;
}

/**
 * Middleware to extract subdomain information from requests
 */
@Injectable()
export class SubdomainMiddleware implements NestMiddleware {
  use(req: SubdomainRequest, res: Response, next: NextFunction): void {
    const host = req.get('host') || '';
    const hostParts = host.split('.');

    // Extract subdomain from host
    // Example: docs.example.com -> subdomain = 'docs'
    if (hostParts.length >= 3) {
      const subdomain = hostParts[0];

      // Skip common subdomains like www, api, admin
      const reservedSubdomains = ['www', 'api', 'admin', 'app', 'mail', 'ftp'];

      if (!reservedSubdomains.includes(subdomain)) {
        req.subdomain = subdomain;
        req.isSubdomain = true;
        req.organizationSlug = subdomain;
      }
    }

    // If no valid subdomain found, mark as main domain
    if (!req.subdomain) {
      req.isSubdomain = false;
    }

    next();
  }
}
