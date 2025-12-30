"use strict";
/**
 * Payment processing utilities (Stripe-compatible)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.maskCardNumber = exports.validateCardNumber = exports.calculateFees = exports.paymentConstants = void 0;
exports.paymentConstants = {
    MIN_AMOUNT: 0.5, // $0.50
    MAX_AMOUNT: 999999.99,
    CURRENCY: 'usd',
    STRIPE_API_VERSION: '2023-10-16',
};
/**
 * Calculate fees
 */
const calculateFees = (amount, feePercentage = 2.9, fixedFee = 0.3) => {
    const percentageFee = amount * (feePercentage / 100);
    const totalFee = percentageFee + fixedFee;
    const netAmount = amount - totalFee;
    return {
        gross: amount,
        fee: Math.round(totalFee * 100) / 100,
        net: Math.round(netAmount * 100) / 100,
    };
};
exports.calculateFees = calculateFees;
/**
 * Validate card number (Luhn algorithm)
 */
const validateCardNumber = (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        isEven = !isEven;
    }
    return sum % 10 === 0;
};
exports.validateCardNumber = validateCardNumber;
/**
 * Mask card number
 */
const maskCardNumber = (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, '');
    const lastFour = digits.slice(-4);
    return `**** **** **** ${lastFour}`;
};
exports.maskCardNumber = maskCardNumber;
/**
 * Payment status enum
 */
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
    PaymentStatus["CANCELLED"] = "cancelled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
//# sourceMappingURL=payment.js.map