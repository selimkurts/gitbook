import { Injectable } from '@nestjs/common';

/**
 * Main application service
 */
@Injectable()
export class AppService {
  /**
   * Get health status
   */
  getHealth(): { message: string; timestamp: string; version: string } {
    return {
      message: 'DocFlow API is running successfully',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  /**
   * Get API information
   */
  getInfo(): { name: string; description: string; version: string } {
    return {
      name: 'DocFlow API',
      description: 'GitBook-like documentation platform API',
      version: '1.0.0',
    };
  }
}
