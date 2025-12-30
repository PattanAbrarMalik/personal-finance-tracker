/**
 * Payment processing utilities (Stripe-compatible)
 */

export const paymentConstants = {
  MIN_AMOUNT: 0.5, // $0.50
  MAX_AMOUNT: 999999.99,
  CURRENCY: 'usd',
  STRIPE_API_VERSION: '2023-10-16',
};

/**
 * Calculate fees
 */
export const calculateFees = (amount: number, feePercentage = 2.9, fixedFee = 0.3) => {
  const percentageFee = amount * (feePercentage / 100);
  const totalFee = percentageFee + fixedFee;
  const netAmount = amount - totalFee;

  return {
    gross: amount,
    fee: Math.round(totalFee * 100) / 100,
    net: Math.round(netAmount * 100) / 100,
  };
};

/**
 * Validate card number (Luhn algorithm)
 */
export const validateCardNumber = (cardNumber: string): boolean => {
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

/**
 * Mask card number
 */
export const maskCardNumber = (cardNumber: string): string => {
  const digits = cardNumber.replace(/\D/g, '');
  const lastFour = digits.slice(-4);
  return `**** **** **** ${lastFour}`;
};

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}
