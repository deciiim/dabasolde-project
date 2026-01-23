import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class OrdersService {
  // Inject the database connection pool (Same pattern as PlansService)
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  // --- ADMIN: Get all orders (Newest first) ---
  async findAll() {
    const result = await this.pool.query(
      `SELECT * FROM "Order" ORDER BY "createdAt" DESC`
    );
    return result.rows;
  }

  // --- ADMIN: Update order status ---
  async updateStatus(id: number, status: string) {
    const result = await this.pool.query(
      `UPDATE "Order" SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return result.rows[0];
  }

  // --- PUBLIC: Create a new order (Direct Insert) ---
  async create(data: any, receiptFilename: string | null) {
    // 1. Generate Tracking Ref
    const shortRef = `DS-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. Prepare Query
    const query = `
      INSERT INTO "Order" 
      ("shortRef", amount, price, phone, "fullName", "paymentMethod", bank, "receiptImage", status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
      RETURNING "shortRef"
    `;

    // 3. Prepare Values (Clean numbers)
    const values = [
      shortRef,
      Number(data.amount),
      Number(data.price),
      data.phone,
      data.fullName,
      data.paymentMethod,
      data.bank || null,
      receiptFilename || null
    ];

    // 4. Execute
    const result = await this.pool.query(query, values);
    const newOrder = result.rows[0];

    return { 
      success: true, 
      orderId: newOrder.shortRef,
      message: "Order created successfully" 
    };
  }

  // --- PUBLIC: Find one order by Tracking Ref ---
  async findOne(ref: string) {
    const result = await this.pool.query(
      `SELECT * FROM "Order" WHERE "shortRef" = $1`,
      [ref]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Order not found');
    }
    return result.rows[0];
  }

  // --- ADMIN: Delete an order ---
  async remove(id: number) {
    const result = await this.pool.query(
      `DELETE FROM "Order" WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return result.rows[0];
  }
}