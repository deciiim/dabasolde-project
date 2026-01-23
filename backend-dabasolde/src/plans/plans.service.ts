import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // 1. Fetch all active plans from the database
    const plans = await this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { amount: 'asc' }, // Sort by smallest amount first
    });

    // 2. Transform the data for the Frontend
    return plans.map((plan) => {
      const discountAmount = plan.amount * (plan.discountPercent / 100);
      const finalPrice = plan.amount - discountAmount;

      return {
        id: plan.id,
        title: `${plan.amount} DH`, 
        amount: plan.amount, // <--- ADDED THIS LINE (Crucial for the Frontend)
        originalPrice: plan.amount,
        finalPrice: Math.round(finalPrice),
        discount: plan.discountPercent,
      };
    });
  }
}