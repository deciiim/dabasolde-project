import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        
        // --- ADD THIS LINE TO DEBUG ---
        console.log("MY DATABASE URL IS:", databaseUrl); 
        // -----------------------------

        const isLocal = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');

        return new Pool({
          connectionString: databaseUrl,
          ssl: isLocal ? false : { rejectUnauthorized: false },
        });
      },
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}