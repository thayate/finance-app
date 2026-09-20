import { FinanceDataService } from '../yahooFinance';
import { YahooChartResponse } from '../types';

describe('FinanceDataService', () => {
  let service: FinanceDataService;

  beforeEach(() => {
    service = new FinanceDataService({ useMockFallback: true });
  });

  test('getTrackedCompanies returns IBM and competitors', () => {
    const companies = service.getTrackedCompanies();
    expect(companies.length).toBeGreaterThanOrEqual(5);
    const ibm = companies.find((c) => c.symbol === 'IBM');
    expect(ibm).toBeDefined();
    expect(ibm?.isMain).toBe(true);
  });

  test('addCompany and removeCompany allow dynamic peer group expansion', () => {
    const added = service.addCompany({
      symbol: 'CRM',
      name: 'Salesforce, Inc.',
      sector: 'Cloud & CRM Software',
    });
    expect(added).toBe(true);

    const companies = service.getTrackedCompanies();
    expect(companies.some((c) => c.symbol === 'CRM')).toBe(true);

    // Should not allow removing IBM (primary company)
    expect(service.removeCompany('IBM')).toBe(false);

    // Can remove dynamically added company
    expect(service.removeCompany('CRM')).toBe(true);
  });

  test('normalizeYahooResponse converts raw API chart payload to clean model', () => {
    const mockApiResponse: YahooChartResponse = {
      chart: {
        result: [
          {
            meta: {
              currency: 'USD',
              symbol: 'IBM',
              regularMarketPrice: 195.5,
              previousClose: 190.0,
              regularMarketDayHigh: 196.0,
              regularMarketDayLow: 189.5,
              regularMarketVolume: 3500000,
              longName: 'International Business Machines Corporation',
            },
            timestamp: [1700000000, 1700003600],
            indicators: {
              quote: [
                {
                  open: [190.0, 192.0],
                  high: [193.0, 196.0],
                  low: [189.5, 191.0],
                  close: [192.5, 195.5],
                  volume: [1500000, 2000000],
                },
              ],
            },
          },
        ],
        error: null,
      },
    };

    const normalized = service.normalizeYahooResponse('IBM', '1D', mockApiResponse);

    expect(normalized.quote.symbol).toBe('IBM');
    expect(normalized.quote.price).toBe(195.5);
    expect(normalized.quote.change).toBe(5.5);
    expect(normalized.quote.changePercent).toBe(2.89);
    expect(normalized.quote.open).toBe(190.0);
    expect(normalized.quote.currency).toBe('USD');

    expect(normalized.history.symbol).toBe('IBM');
    expect(normalized.history.timeframe).toBe('1D');
    expect(normalized.history.points.length).toBe(2);
    expect(normalized.history.points[0].price).toBe(192.5);
    expect(normalized.history.points[1].price).toBe(195.5);
  });

  test('getQuote returns quote data for IBM', async () => {
    const quote = await service.getQuote('IBM');
    expect(quote.symbol).toBe('IBM');
    expect(quote.price).toBeGreaterThan(0);
    expect(quote.currency).toBe('USD');
  });

  test('getQuotes returns a map of requested quotes', async () => {
    const quotes = await service.getQuotes(['IBM', 'MSFT']);
    expect(quotes.IBM).toBeDefined();
    expect(quotes.MSFT).toBeDefined();
  });

  test('getHistory returns 1D, 7D, and 1Q historical data', async () => {
    const history1D = await service.getHistory('IBM', '1D');
    expect(history1D.symbol).toBe('IBM');
    expect(history1D.timeframe).toBe('1D');
    expect(history1D.points.length).toBeGreaterThan(0);

    const history7D = await service.getHistory('IBM', '7D');
    expect(history7D.timeframe).toBe('7D');
    expect(history7D.points.length).toBe(7);

    const history1Q = await service.getHistory('IBM', '1Q');
    expect(history1Q.timeframe).toBe('1Q');
    expect(history1Q.points.length).toBe(12);
  });
});
