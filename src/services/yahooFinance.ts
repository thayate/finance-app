import {
  StockQuote,
  StockHistory,
  Timeframe,
  CompanyInfo,
  PricePoint,
  YahooChartResponse,
} from './types';
import { MOCK_QUOTES, generateMockHistory, TRACKED_COMPANIES } from './mockData';

export interface FinanceServiceConfig {
  useMockFallback?: boolean;
  apiBaseUrl?: string;
  corsProxyUrl?: string;
}

export class FinanceDataService {
  private useMockFallback: boolean;
  private apiBaseUrl: string;
  private trackedCompanies: CompanyInfo[];

  constructor(config?: FinanceServiceConfig) {
    this.useMockFallback = config?.useMockFallback ?? true;
    this.apiBaseUrl = config?.apiBaseUrl || 'https://query1.finance.yahoo.com/v8/finance/chart';
    this.trackedCompanies = [...TRACKED_COMPANIES];
  }

  /**
   * Returns list of currently tracked companies
   */
  public getTrackedCompanies(): CompanyInfo[] {
    return [...this.trackedCompanies];
  }

  /**
   * Extensibility: Add a new company to the tracked peer group dynamically
   */
  public addCompany(company: CompanyInfo): boolean {
    const symbol = company.symbol.toUpperCase();
    if (this.trackedCompanies.some((c) => c.symbol === symbol)) {
      return false; // Already tracked
    }
    this.trackedCompanies.push({
      ...company,
      symbol,
    });
    return true;
  }

  /**
   * Extensibility: Remove a company by symbol (except main company like IBM)
   */
  public removeCompany(symbol: string): boolean {
    const sym = symbol.toUpperCase();
    const target = this.trackedCompanies.find((c) => c.symbol === sym);
    if (!target || target.isMain) {
      return false;
    }
    this.trackedCompanies = this.trackedCompanies.filter((c) => c.symbol !== sym);
    return true;
  }

  /**
   * Maps application Timeframe to Yahoo Finance API parameters (range & interval)
   */
  private getTimeframeParams(timeframe: Timeframe): { range: string; interval: string } {
    switch (timeframe) {
      case '1D':
        return { range: '1d', interval: '15m' };
      case '7D':
        return { range: '5d', interval: '1d' };
      case '1Q':
        return { range: '3mo', interval: '1wk' };
      default:
        return { range: '1d', interval: '15m' };
    }
  }

  /**
   * Normalizes raw Yahoo Finance API response into clean StockQuote & PricePoints
   */
  public normalizeYahooResponse(
    symbol: string,
    timeframe: Timeframe,
    data: YahooChartResponse
  ): { quote: StockQuote; history: StockHistory } {
    const result = data.chart?.result?.[0];
    if (!result || !result.meta) {
      throw new Error(`Invalid Yahoo Finance API response structure for ${symbol}`);
    }

    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const quoteIndicator = result.indicators?.quote?.[0] || {};
    const opens = quoteIndicator.open || [];
    const highs = quoteIndicator.high || [];
    const lows = quoteIndicator.low || [];
    const closes = quoteIndicator.close || [];
    const volumes = quoteIndicator.volume || [];

    const price = meta.regularMarketPrice ?? closes[closes.length - 1] ?? 0;
    const prevClose = meta.previousClose ?? (opens.length > 0 ? opens[0] ?? price : price);
    const change = Number((price - prevClose).toFixed(2));
    const changePercent = prevClose !== 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;

    const matchedCompany = this.trackedCompanies.find((c) => c.symbol === symbol.toUpperCase());
    const companyName = meta.longName || meta.shortName || matchedCompany?.name || `${symbol.toUpperCase()} Inc.`;

    const quote: StockQuote = {
      symbol: symbol.toUpperCase(),
      name: companyName,
      price: Number(price.toFixed(2)),
      change,
      changePercent,
      high: Number((meta.regularMarketDayHigh ?? Math.max(...highs.filter((v): v is number => v !== null), price)).toFixed(2)),
      low: Number((meta.regularMarketDayLow ?? Math.min(...lows.filter((v): v is number => v !== null), price)).toFixed(2)),
      open: Number((opens.find((v) => v !== null) ?? price).toFixed(2)),
      previousClose: Number(prevClose.toFixed(2)),
      volume: (meta.regularMarketVolume ?? volumes.reduce<number>((acc, v) => acc + (v || 0), 0)) ?? 0,
      currency: meta.currency || 'USD',
      lastUpdated: new Date().toISOString(),
    };

    const points: PricePoint[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const closeVal = closes[i];
      if (closeVal === null || closeVal === undefined) continue;

      const dateObj = new Date(timestamps[i] * 1000);
      let displayTime = '';
      if (timeframe === '1D') {
        displayTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      } else if (timeframe === '7D') {
        displayTime = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      } else {
        displayTime = `W${Math.ceil((dateObj.getDate() + 6) / 7)} ${dateObj.toLocaleDateString('en-US', { month: 'short' })}`;
      }

      points.push({
        timestamp: dateObj.toISOString(),
        displayTime,
        price: Number(closeVal.toFixed(2)),
        open: opens[i] !== null ? Number(opens[i]?.toFixed(2)) : undefined,
        high: highs[i] !== null ? Number(highs[i]?.toFixed(2)) : undefined,
        low: lows[i] !== null ? Number(lows[i]?.toFixed(2)) : undefined,
        close: Number(closeVal.toFixed(2)),
        volume: volumes[i] ?? 0,
      });
    }

    return {
      quote,
      history: {
        symbol: symbol.toUpperCase(),
        timeframe,
        points,
      },
    };
  }

  /**
   * Fetch live or mock data for quote.
   * Throws an explicit error if the symbol is unavailable without silently falling back to another company.
   */
  public async getQuote(symbol: string): Promise<StockQuote> {
    const sym = symbol.toUpperCase();
    try {
      if (!this.useMockFallback) {
        const { range, interval } = this.getTimeframeParams('1D');
        const url = `${this.apiBaseUrl}/${encodeURIComponent(sym)}?range=${range}&interval=${interval}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`No data available for symbol '${sym}'`);
        }
        const data: YahooChartResponse = await response.json();
        const normalized = this.normalizeYahooResponse(sym, '1D', data);
        return normalized.quote;
      }
    } catch (err: any) {
      if (!this.useMockFallback) {
        throw new Error(err?.message || `No data available for symbol '${sym}'`);
      }
    }

    const mock = MOCK_QUOTES[sym];
    if (!mock) {
      throw new Error(`No data available for symbol '${sym}'`);
    }
    return mock;
  }

  /**
   * Fetch multiple quotes in parallel
   */
  public async getQuotes(symbols: string[]): Promise<Record<string, StockQuote>> {
    const quotes: Record<string, StockQuote> = {};
    const promises = symbols.map(async (sym) => {
      try {
        quotes[sym.toUpperCase()] = await this.getQuote(sym);
      } catch (err) {
        // Skip unavailable
      }
    });
    await Promise.all(promises);
    return quotes;
  }

  /**
   * Fetch historical series for a given timeframe.
   * Throws an explicit error if the symbol is unavailable.
   */
  public async getHistory(symbol: string, timeframe: Timeframe): Promise<StockHistory> {
    const sym = symbol.toUpperCase();
    try {
      if (!this.useMockFallback) {
        const { range, interval } = this.getTimeframeParams(timeframe);
        const url = `${this.apiBaseUrl}/${encodeURIComponent(sym)}?range=${range}&interval=${interval}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`No data available for symbol '${sym}'`);
        }
        const data: YahooChartResponse = await response.json();
        const normalized = this.normalizeYahooResponse(sym, timeframe, data);
        return normalized.history;
      }
    } catch (err: any) {
      if (!this.useMockFallback) {
        throw new Error(err?.message || `No data available for symbol '${sym}'`);
      }
    }

    return generateMockHistory(sym, timeframe);
  }

  /**
   * Fetch histories for multiple symbols in parallel
   */
  public async getHistories(symbols: string[], timeframe: Timeframe): Promise<Record<string, StockHistory>> {
    const histories: Record<string, StockHistory> = {};
    const promises = symbols.map(async (sym) => {
      try {
        histories[sym.toUpperCase()] = await this.getHistory(sym, timeframe);
      } catch (err) {
        // Skip unavailable
      }
    });
    await Promise.all(promises);
    return histories;
  }
}

// Default singleton instance
export const financeService = new FinanceDataService({ useMockFallback: true });
