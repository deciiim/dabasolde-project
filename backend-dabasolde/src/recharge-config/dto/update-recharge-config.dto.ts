import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRechargeConfigDto {
    @IsString()
    operator: string;

    @IsOptional()
    @IsString()
    rechargeCode?: string | null;

    @IsBoolean()
    isAvailable: boolean;

    @IsOptional()
    @IsString()
    disabledReason?: string;

    @IsOptional()
    @IsString()
    updatedBy?: string;
}
