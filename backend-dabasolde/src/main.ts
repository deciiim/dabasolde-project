import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config'; // 1. Import ConfigService
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  // We keep these variables, but we won't strictly enforce the URL for CORS anymore
  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:5173';
  const port = configService.get('PORT') || 3000;

  // --- FIX STARTS HERE ---
  app.enableCors({
    origin: true,      // <--- CHANGE THIS: 'true' allows both www and non-www
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // --- FIX ENDS HERE ---

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