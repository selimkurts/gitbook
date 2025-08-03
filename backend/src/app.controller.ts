import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * Main application controller
 */
@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint
   */
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  @Get()
  getHealth(): { message: string; timestamp: string; version: string } {
    return this.appService.getHealth();
  }

  /**
   * Health check endpoint
   */
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  @Get('health')
  getHealthCheck(): { message: string; timestamp: string; version: string } {
    return this.appService.getHealth();
  }

  /**
   * API information endpoint
   */
  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({ status: 200, description: 'API information retrieved' })
  @Get('info')
  getInfo(): { name: string; description: string; version: string } {
    return this.appService.getInfo();
  }
}
