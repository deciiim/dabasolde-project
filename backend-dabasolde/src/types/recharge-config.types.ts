export interface RechargeConfig {
    id: number;
    operator: 'inwi' | 'orange';
    rechargeCode: string | null; // null means entire operator
    isAvailable: boolean;
    disabledReason?: string;
    updatedAt: Date;
    updatedBy?: string;
}

export interface UpdateRechargeConfigDto {
    operator: string;
    rechargeCode?: string | null;
    isAvailable: boolean;
    disabledReason?: string;
    updatedBy?: string;
}
