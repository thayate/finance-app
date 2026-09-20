import { CompanyInfo, StockQuote, StockHistory, Timeframe } from './types';

export const TRACKED_COMPANIES: CompanyInfo[] = [
  { symbol: 'IBM', name: 'International Business Machines', sector: 'Technology / Hybrid Cloud & AI', isMain: true },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology / Cloud & Software' },
  { symbol: 'ORCL', name: 'Oracle Corporation', sector: 'Enterprise Software & Cloud Infrastructure' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Internet & Cloud Services' },
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Consumer Electronics & Services' },
];

export const MOCK_QUOTES: Record<string, StockQuote> = {
  IBM: {
    symbol: 'IBM',
    name: 'International Business Machines',
    price: 191.55,
    change: 2.85,
    changePercent: 1.51,
    high: 193.10,
    low: 188.75,
    open: 189.20,
    previousClose: 188.70,
    volume: 4235800,
    marketCap: '175.8B',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 415.20,
    change: -1.80,
    changePercent: -0.43,
    high: 418.50,
    low: 413.20,
    open: 417.00,
    previousClose: 417.00,
    volume: 18940000,
    marketCap: '3.08T',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  ORCL: {
    symbol: 'ORCL',
    name: 'Oracle Corporation',
    price: 138.45,
    change: 3.15,
    changePercent: 2.33,
    high: 139.50,
    low: 135.20,
    open: 136.00,
    previousClose: 135.30,
    volume: 8120000,
    marketCap: '381.2B',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 178.60,
    change: 0.95,
    changePercent: 0.53,
    high: 179.80,
    low: 177.10,
    open: 177.50,
    previousClose: 177.65,
    volume: 14200000,
    marketCap: '2.21T',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 224.30,
    change: -0.70,
    changePercent: -0.31,
    high: 226.10,
    low: 223.50,
    open: 225.00,
    previousClose: 225.00,
    volume: 38450000,
    marketCap: '3.42T',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 128.90,
    change: 4.10,
    changePercent: 3.28,
    high: 130.50,
    low: 125.80,
    open: 126.20,
    previousClose: 124.80,
    volume: 45200000,
    marketCap: '3.16T',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  CRM: {
    symbol: 'CRM',
    name: 'Salesforce, Inc.',
    price: 288.40,
    change: 1.65,
    changePercent: 0.58,
    high: 291.00,
    low: 286.50,
    open: 287.00,
    previousClose: 286.75,
    volume: 4800000,
    marketCap: '279.1B',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 186.50,
    change: 2.10,
    changePercent: 1.14,
    high: 187.80,
    low: 184.20,
    open: 185.00,
    previousClose: 184.40,
    volume: 29300000,
    marketCap: '1.94T',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  INTC: {
    symbol: 'INTC',
    name: 'Intel Corporation',
    price: 21.35,
    change: -0.45,
    changePercent: -2.06,
    high: 21.90,
    low: 21.10,
    open: 21.80,
    previousClose: 21.80,
    volume: 52100000,
    marketCap: '91.3B',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
};

export function generateMockHistory(symbol: string, timeframe: Timeframe): StockHistory {
  const quote = MOCK_QUOTES[symbol];
  if (!quote) {
    throw new Error(`No data available for symbol '${symbol}'`);
  }
  const basePrice = quote.previousClose;
  const points = [];

  if (timeframe === '1D') {
    // 9:30 AM to 4:00 PM (30 min intervals)
    const hours = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
    let currentPrice = quote.open;
    for (let i = 0; i < hours.length; i++) {
      const delta = (Math.sin(i / 2) + (Math.random() - 0.48)) * (basePrice * 0.005);
      currentPrice = i === hours.length - 1 ? quote.price : Number((currentPrice + delta).toFixed(2));
      points.push({
        timestamp: `2025-01-15T${hours[i]}:00Z`,
        displayTime: hours[i],
        price: Number(currentPrice.toFixed(2)),
        volume: Math.floor(Math.random() * 200000 + 50000),
      });
    }
  } else if (timeframe === '7D') {
    // 7 days daily close
    const days = ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Yesterday', 'Today'];
    let currentPrice = basePrice * 0.97;
    for (let i = 0; i < days.length; i++) {
      const delta = (Math.sin(i) + (Math.random() - 0.45)) * (basePrice * 0.015);
      currentPrice = i === days.length - 1 ? quote.price : Number((currentPrice + delta).toFixed(2));
      points.push({
        timestamp: `2025-01-${10 + i}`,
        displayTime: days[i],
        price: Number(currentPrice.toFixed(2)),
        volume: Math.floor(Math.random() * 3000000 + 1000000),
      });
    }
  } else {
    // 1Q (12 weeks)
    for (let i = 1; i <= 12; i++) {
      const delta = (Math.cos(i / 2) + (Math.random() - 0.45)) * (basePrice * 0.03);
      const price = i === 12 ? quote.price : Number((basePrice * 0.92 + delta * (i * 0.6)).toFixed(2));
      points.push({
        timestamp: `2024-W${40 + i}`,
        displayTime: `W${i}`,
        price: Number(price.toFixed(2)),
        volume: Math.floor(Math.random() * 15000000 + 5000000),
      });
    }
  }

  return { symbol, timeframe, points };
}
