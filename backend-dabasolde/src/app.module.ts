import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { PrismaModule } from '../prisma/prisma.module'; <--- DELETE THIS
import { DatabaseModule } from './database.module'; // <--- ADD THIS
import { PlansModule } from './plans/plans.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule, // <--- ADD THIS (replaces PrismaModule)
    PlansModule, 
    OrdersModule, 
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}