export type Timeframe = '1D' | '7D' | '1Q';

export interface CompanyInfo {
  symbol: string;
  name: string;
  sector: string;
  isMain?: boolean;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  marketCap?: string;
  currency: string;
  lastUpdated: string;
}

export interface PricePoint {
  timestamp: string; // ISO date/time string
  displayTime: string; // Formatted for chart x-axis
  price: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

export interface StockHistory {
  symbol: string;
  timeframe: Timeframe;
  points: PricePoint[];
}

export interface DashboardData {
  quotes: Record<string, StockQuote>;
  histories: Record<string, StockHistory>;
}

/**
 * Raw Yahoo Finance API response shapes for normalization
 */
export interface YahooChartResponse {
  chart?: {
    result?: Array<{
      meta?: {
        currency?: string;
        symbol?: string;
        regularMarketPrice?: number;
        previousClose?: number;
        regularMarketDayHigh?: number;
        regularMarketDayLow?: number;
        regularMarketVolume?: number;
        shortName?: string;
        longName?: string;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: (number | null)[];
          high?: (number | null)[];
          low?: (number | null)[];
          close?: (number | null)[];
          volume?: (number | null)[];
        }>;
      };
    }>;
    error?: {
      code: string;
      description: string;
    } | null;
  };
}
