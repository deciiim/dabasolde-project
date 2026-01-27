import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'DabaSolde API is running! 🚀';
  }

  // Simple health check endpoint
  @Get('health')
  healthCheck() {
    return {
      status: 'OK',
      service: 'DabaSolde API',
      timestamp: new Date().toISOString(),
    };
  }
}
