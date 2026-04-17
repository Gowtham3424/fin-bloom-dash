import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface CurrencyMeta {
  code: string;
  symbol: string;
  flag: string;
  name: string;
  locale: string;
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: 'INR', symbol: '₹', flag: '🇮🇳', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', flag: '🇯🇵', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', flag: '🇨🇦', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'CNY', symbol: '¥', flag: '🇨🇳', name: 'Chinese Yuan', locale: 'zh-CN' },
];

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, INR: 83.2, EUR: 0.92, GBP: 0.79, JPY: 154, AUD: 1.52,
  CAD: 1.37, AED: 3.67, SGD: 1.34, CNY: 7.24,
};

async function fetchRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('fx fail');
    const json = await res.json();
    if (json.rates && typeof json.rates.INR === 'number') return json.rates;
  } catch {}
  return FALLBACK_RATES;
}

interface CurrencyContextValue {
  currency: CurrencyMeta;
  setCurrency: (code: string) => void;
  rates: Record<string, number>;
  convert: (amountUSD: number) => number;
  format: (amountUSD: number, opts?: { decimals?: number }) => string;
  formatRaw: (amount: number, code?: string, opts?: { decimals?: number }) => string;
  rateUSDtoCurrent: number;
  lastUpdated: number | null;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<string>(() => {
    return localStorage.getItem('finboard-currency') || 'INR';
  });

  const { data: rates = FALLBACK_RATES, dataUpdatedAt } = useQuery({
    queryKey: ['fx-rates'],
    queryFn: fetchRates,
    staleTime: 60 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
  });

  useEffect(() => {
    localStorage.setItem('finboard-currency', code);
  }, [code]);

  const currency = CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
  const rateUSDtoCurrent = rates[currency.code] || FALLBACK_RATES[currency.code] || 1;

  const convert = (amountUSD: number) => amountUSD * rateUSDtoCurrent;

  const formatRaw = (amount: number, c?: string, opts?: { decimals?: number }) => {
    const meta = CURRENCIES.find((x) => x.code === (c || currency.code)) || currency;
    const decimals = opts?.decimals ?? (meta.code === 'JPY' ? 0 : 2);
    try {
      return new Intl.NumberFormat(meta.locale, {
        style: 'currency',
        currency: meta.code,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(amount);
    } catch {
      return `${meta.symbol}${amount.toFixed(decimals)}`;
    }
  };

  const format = (amountUSD: number, opts?: { decimals?: number }) =>
    formatRaw(convert(amountUSD), currency.code, opts);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: setCode,
        rates,
        convert,
        format,
        formatRaw,
        rateUSDtoCurrent,
        lastUpdated: dataUpdatedAt || null,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
