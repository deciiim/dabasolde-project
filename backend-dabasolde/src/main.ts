import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config'; // 1. Import ConfigService
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const frontendUrl =
    configService.get('FRONTEND_URL') || 'http://localhost:5173';
  const corsOrigin = configService.get('CORS_ORIGIN') || frontendUrl;
  const port = configService.get('PORT') || 3000;
  const nodeEnv = configService.get('NODE_ENV') || 'development';

  // --- CORS Configuration ---
  // In development: Allow all origins for easier testing
  // In production: Restrict to specific domain
  app.enableCors({
    origin: nodeEnv === 'production' ? corsOrigin : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  console.log(
    `🔒 CORS enabled for: ${nodeEnv === 'production' ? corsOrigin : 'all origins (dev mode)'}`,
  );

  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    console.log('📁 Creating uploads directory...');
    mkdirSync(uploadsDir, { recursive: true });
  }

  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
  });

  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
