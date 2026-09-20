import { validateStockQuote, validatePricePoints, validateTickerSymbol } from '../../utils/validation';
import { StockQuote, PricePoint } from '../../services/types';

describe('Validation Utility Tests', () => {
  describe('validateTickerSymbol', () => {
    test('passes for valid 1-5 letter ticker symbols', () => {
      expect(validateTickerSymbol('IBM').isValid).toBe(true);
      expect(validateTickerSymbol('NVDA').isValid).toBe(true);
      expect(validateTickerSymbol('aapl').isValid).toBe(true); // lower-case normalized
      expect(validateTickerSymbol('C').isValid).toBe(true);
    });

    test('fails for empty or whitespace-only symbols', () => {
      const result = validateTickerSymbol('   ');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Ticker symbol cannot be empty.');
    });

    test('fails for symbols with numbers, symbols, or over 5 letters', () => {
      const invalidSymbols = ['AAPL1', 'GOOGL_X', 'TOOLONGTICKER', '$$$'];
      invalidSymbols.forEach((sym) => {
        const result = validateTickerSymbol(sym);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toMatch(/must be 1 to 5 letters/i);
      });
    });
  });

  describe('validateStockQuote', () => {
    test('passes for valid stock quote', () => {
      const validQuote: StockQuote = {
        symbol: 'IBM',
        name: 'International Business Machines',
        price: 191.55,
        change: 2.85,
        changePercent: 1.51,
        high: 193.1,
        low: 188.75,
        open: 189.2,
        previousClose: 188.7,
        volume: 4235800,
        currency: 'USD',
        lastUpdated: new Date().toISOString(),
      };

      const result = validateStockQuote(validQuote);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('fails when symbol is missing or empty', () => {
      const invalidQuote = { price: 100 } as any;
      const result = validateStockQuote(invalidQuote);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Symbol is required and must be a non-empty string.');
    });

    test('fails when price is negative or NaN', () => {
      const invalidQuote: Partial<StockQuote> = {
        symbol: 'IBM',
        price: -50,
      };
      const result = validateStockQuote(invalidQuote);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price must be a non-negative number.');
    });

    test('fails when high price is lower than low price', () => {
      const invalidQuote: Partial<StockQuote> = {
        symbol: 'IBM',
        price: 100,
        high: 90,
        low: 110,
      };
      const result = validateStockQuote(invalidQuote);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('High price cannot be less than low price.');
    });
  });

  describe('validatePricePoints', () => {
    test('passes for valid historical price points', () => {
      const validPoints: PricePoint[] = [
        { timestamp: '2025-01-01', displayTime: 'Day 1', price: 100 },
        { timestamp: '2025-01-02', displayTime: 'Day 2', price: 105 },
      ];
      const result = validatePricePoints(validPoints);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('fails for empty array', () => {
      const result = validatePricePoints([]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Historical series cannot be empty.');
    });

    test('fails when any point has invalid price', () => {
      const invalidPoints: any[] = [
        { timestamp: '2025-01-01', displayTime: 'Day 1', price: -10 },
      ];
      const result = validatePricePoints(invalidPoints);
      expect(result.isValid).toBe(false);
    });
  });
});
