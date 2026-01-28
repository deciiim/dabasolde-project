// Centralized error handling utilities
import type { ApiError } from '../types/api.types';

export const getErrorMessage = (error: unknown): string => {
    if (typeof error === 'string') {
        return error;
    }

    if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as ApiError;
        return apiError.message;
    }

    return 'An unexpected error occurred';
};

export const handleApiError = (error: unknown): void => {
    const message = getErrorMessage(error);
    console.error('API Error:', message);
    // You can add toast notifications here later
};

export const isNetworkError = (error: unknown): boolean => {
    if (error && typeof error === 'object' && 'statusCode' in error) {
        const apiError = error as ApiError;
        return apiError.statusCode === 0;
    }
    return false;
};
