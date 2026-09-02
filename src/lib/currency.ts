export const currencySymbols: Record<string, string> = {
  INR: '₹',
  USD: '$',
  GBP: '£',
  EUR: '€',
  AED: 'د.إ',
  NGN: '₦',
  KES: 'KSh',
  PHP: '₱',
  BRL: 'R$',
};

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const symbol = currencySymbols[currency] || currency;
  const formatted = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return `${symbol}${formatted}`;
}

export function formatCompactCurrency(amount: number, currency: string = 'INR'): string {
  const symbol = currencySymbols[currency] || currency;
  if (amount >= 10000000) return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `${symbol}${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(1)}K`;
  return `${symbol}${amount}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

export function getProgressPercent(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

export function getDaysRemaining(endDate?: Date | null): number | null {
  if (!endDate) return null;
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}
