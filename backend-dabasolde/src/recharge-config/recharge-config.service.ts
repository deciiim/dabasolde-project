import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { RechargeConfig } from '../types/recharge-config.types';
import { UpdateRechargeConfigDto } from './dto/update-recharge-config.dto';

interface RechargeConfigRow {
    id: number;
    operator: string;
    rechargeCode: string | null;
    isAvailable: boolean;
    disabledReason: string | null;
    updatedAt: Date;
    updatedBy: string | null;
}

@Injectable()
export class RechargeConfigService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    // Get all recharge configurations
    async findAll(): Promise<RechargeConfig[]> {
        const result = await this.pool.query<RechargeConfigRow>(
            `SELECT * FROM "RechargeConfig" ORDER BY operator, "rechargeCode"`,
        );

        return result.rows.map((row) => ({
            id: row.id,
            operator: row.operator as 'inwi' | 'orange',
            rechargeCode: row.rechargeCode,
            isAvailable: row.isAvailable,
            disabledReason: row.disabledReason || undefined,
            updatedAt: row.updatedAt,
            updatedBy: row.updatedBy || undefined,
        }));
    }

    // Get available configurations only (for frontend)
    async findAvailable(): Promise<RechargeConfig[]> {
        const result = await this.pool.query<RechargeConfigRow>(
            `SELECT * FROM "RechargeConfig" WHERE "isAvailable" = true ORDER BY operator, "rechargeCode"`,
        );

        return result.rows.map((row) => ({
            id: row.id,
            operator: row.operator as 'inwi' | 'orange',
            rechargeCode: row.rechargeCode,
            isAvailable: row.isAvailable,
            disabledReason: row.disabledReason || undefined,
            updatedAt: row.updatedAt,
            updatedBy: row.updatedBy || undefined,
        }));
    }

    // Update configuration
    async update(dto: UpdateRechargeConfigDto): Promise<RechargeConfig> {
        const rechargeCode = dto.rechargeCode === undefined ? null : dto.rechargeCode;

        const result = await this.pool.query<RechargeConfigRow>(
            `INSERT INTO "RechargeConfig" (operator, "rechargeCode", "isAvailable", "disabledReason", "updatedBy", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (operator, "rechargeCode") 
       DO UPDATE SET 
         "isAvailable" = $3,
         "disabledReason" = $4,
         "updatedBy" = $5,
         "updatedAt" = NOW()
       RETURNING *`,
            [
                dto.operator,
                rechargeCode,
                dto.isAvailable,
                dto.disabledReason || null,
                dto.updatedBy || null,
            ],
        );

        const row = result.rows[0];
        return {
            id: row.id,
            operator: row.operator as 'inwi' | 'orange',
            rechargeCode: row.rechargeCode,
            isAvailable: row.isAvailable,
            disabledReason: row.disabledReason || undefined,
            updatedAt: row.updatedAt,
            updatedBy: row.updatedBy || undefined,
        };
    }

    // Check if operator is available
    async isOperatorAvailable(operator: string): Promise<boolean> {
        const result = await this.pool.query<{ isAvailable: boolean }>(
            `SELECT "isAvailable" FROM "RechargeConfig" 
       WHERE operator = $1 AND "rechargeCode" IS NULL`,
            [operator],
        );

        if (result.rows.length === 0) return true; // Default to available
        return result.rows[0].isAvailable;
    }

    // Check if specific recharge type is available
    async isRechargeTypeAvailable(operator: string, rechargeCode: string): Promise<boolean> {
        // First check if operator is available
        const operatorAvailable = await this.isOperatorAvailable(operator);
        if (!operatorAvailable) return false;

        // Then check specific recharge type
        const result = await this.pool.query<{ isAvailable: boolean }>(
            `SELECT "isAvailable" FROM "RechargeConfig" 
       WHERE operator = $1 AND "rechargeCode" = $2`,
            [operator, rechargeCode],
        );

        if (result.rows.length === 0) return true; // Default to available
        return result.rows[0].isAvailable;
    }
}
