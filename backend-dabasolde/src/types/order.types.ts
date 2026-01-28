// Backend Type Definitions for Orders
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum PaymentMethod {
  CIH = 'CIH',
  ATTIJARI = 'ATTIJARI',
  BARID_BANK = 'BARID_BANK',
  CASH = 'CASH',
}

export interface Order {
  id: number;
  shortRef: string;
  amount: number;
  price: number;
  phone: string;
  recipientPhone?: string;
  fullName: string;
  paymentMethod: PaymentMethod | string;
  bank?: string;
  receiptImage?: string;
  status: OrderStatus | string;
  productType: string;
  createdAt: Date;
}

export interface CreateOrderData {
  amount: number;
  price: number;
  phone: string;
  recipientPhone?: string;
  fullName: string;
  paymentMethod: string;
  bank?: string;
  productType: string;
}
