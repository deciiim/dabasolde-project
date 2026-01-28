// Backend Type Definitions for Plans
export interface Plan {
  id: number;
  amount: number;
  discountPercent: number;
  isActive: boolean;
  createdAt: Date;
}

export interface CreatePlanData {
  amount: number;
  discountPercent: number;
  isActive?: boolean;
}

export interface PlanWithPrice extends Plan {
  finalPrice: number;
}
