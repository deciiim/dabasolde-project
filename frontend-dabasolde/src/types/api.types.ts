// Frontend Type Definitions for API
export const OrderStatus = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    REJECTED: 'REJECTED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentMethod = {
    CIH: 'CIH',
    ATTIJARI: 'ATTIJARI',
    BARID_BANK: 'BARID_BANK',
    CASH: 'CASH',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

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
    createdAt: string;
}

export interface Plan {
    id: number;
    amount: number;
    discountPercent: number;
    isActive: boolean;
    createdAt: string;
    finalPrice: number;
}

export interface CreateOrderRequest {
    amount: number;
    price: number;
    phone: string;
    recipientPhone?: string;
    fullName: string;
    paymentMethod: string;
    bank?: string;
    productType: string;
}

export interface CreateOrderResponse {
    success: boolean;
    orderId: string;
    message: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}
