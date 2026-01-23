import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
// No need to import PrismaModule here because we made it @Global() in Step 0

@Module({
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}