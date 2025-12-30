/**
 * Payment processing utilities (Stripe-compatible)
 */
export declare const paymentConstants: {
    MIN_AMOUNT: number;
    MAX_AMOUNT: number;
    CURRENCY: string;
    STRIPE_API_VERSION: string;
};
/**
 * Calculate fees
 */
export declare const calculateFees: (amount: number, feePercentage?: number, fixedFee?: number) => {
    gross: number;
    fee: number;
    net: number;
};
/**
 * Validate card number (Luhn algorithm)
 */
export declare const validateCardNumber: (cardNumber: string) => boolean;
/**
 * Mask card number
 */
export declare const maskCardNumber: (cardNumber: string) => string;
/**
 * Payment status enum
 */
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded",
    CANCELLED = "cancelled"
}
//# sourceMappingURL=payment.d.ts.map