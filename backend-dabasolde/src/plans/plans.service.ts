import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg'; // <--- Import the Driver

@Injectable()
export class PlansService {
  // Inject the pool we created in DatabaseModule
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    // 1. Run the Raw SQL Query
    // Note: We use double quotes "Plan" because Prisma creates tables with capital letters
    const result = await this.pool.query(
      `SELECT * FROM "Plan" WHERE "isActive" = true ORDER BY amount ASC`
    );

    // 2. Transform the data (result.rows contains the actual data)
    return result.rows.map((plan) => {
      const discountAmount = plan.amount * (plan.discountPercent / 100);
      const finalPrice = plan.amount - discountAmount;

      return {
        id: plan.id,
        title: `${plan.amount} DH`, 
        amount: plan.amount, 
        originalPrice: plan.amount,
        finalPrice: Math.round(finalPrice),
        discount: plan.discountPercent,
      };
    });
  }
}