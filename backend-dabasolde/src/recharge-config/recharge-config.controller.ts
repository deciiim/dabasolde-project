import { Controller, Get, Put, Body } from '@nestjs/common';
import { RechargeConfigService } from './recharge-config.service';
import { UpdateRechargeConfigDto } from './dto/update-recharge-config.dto';

@Controller('recharge-config')
export class RechargeConfigController {
    constructor(private readonly rechargeConfigService: RechargeConfigService) { }

    // Get all configurations (for admin)
    @Get()
    async findAll() {
        return this.rechargeConfigService.findAll();
    }

    // Get only available configurations (for public)
    @Get('available')
    async findAvailable() {
        return this.rechargeConfigService.findAvailable();
    }

    // Update configuration (admin only)
    @Put()
    async update(@Body() dto: UpdateRechargeConfigDto) {
        return this.rechargeConfigService.update(dto);
    }
}
