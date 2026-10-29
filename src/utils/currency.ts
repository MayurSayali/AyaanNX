/**
 * Utility for formatting Indian Rupees (₹ INR) across the Ayaan NX store
 */
export const formatPrice = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';
