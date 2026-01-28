import { Module } from '@nestjs/common';
import { RechargeConfigController } from './recharge-config.controller';
import { RechargeConfigService } from './recharge-config.service';
import { DatabaseModule } from '../database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [RechargeConfigController],
    providers: [RechargeConfigService],
    exports: [RechargeConfigService],
})
export class RechargeConfigModule { }
