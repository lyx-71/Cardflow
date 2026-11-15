export const CURRENCY_RATES: Record<string, number> = {
  'USD_USD': 1,
  'EUR_EUR': 1,
  'RUB_RUB': 1,
  'USD_RUB': 95.0,
  'EUR_RUB': 105.0,
  'USD_EUR': 0.92,
  'EUR_USD': 1.08,
  'RUB_USD': 1 / 95.0,
  'RUB_EUR': 1 / 105.0,
};

export function calculateConversion(amount: number, fromCurrency: string, toCurrency: string): number | null {
  const key = `${fromCurrency}_${toCurrency}`;
  const rate = CURRENCY_RATES[key];
  
  if (rate === undefined) return null;
  return amount * rate;
}