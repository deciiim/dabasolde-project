import { Controller, Get } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('plans') // This sets the route to: localhost:3000/plans
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  getAllPlans() {
    return this.plansService.findAll();
  }
}