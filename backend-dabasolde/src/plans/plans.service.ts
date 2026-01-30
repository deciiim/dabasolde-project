import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg'; // <--- Import the Driver
import { Plan, PlanWithPrice } from '../types/plan.types';

interface PlanRow {
  id: number;
  amount: number;
  discountPercent: number;
  isActive: boolean;
  createdAt: Date;
}

@Injectable()
export class PlansService {
  // Inject the pool we created in DatabaseModule
  constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

  async findAll(): Promise<PlanWithPrice[]> {
    // 1. Run the Raw SQL Query
    // Note: We use double quotes "Plan" because Prisma creates tables with capital letters
    const result = await this.pool.query<PlanRow>(
      `SELECT * FROM "Plan" WHERE "isActive" = true ORDER BY amount ASC`,
    );

    // 2. Transform the data (result.rows contains the actual data)
    return result.rows.map((plan: PlanRow) => {
      // FORCE 12% DISCOUNT POLICY
      // This ensures the frontend sees 12% even if the database still has 15%
      const discountPercent = 12;
      const discountAmount = plan.amount * (discountPercent / 100);
      const finalPrice = plan.amount - discountAmount;

      return {
        id: plan.id,
        amount: plan.amount,
        discountPercent: discountPercent,
        isActive: plan.isActive,
        createdAt: plan.createdAt,
        finalPrice: Math.round(finalPrice),
      };
    });
  }
}
