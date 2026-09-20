import {
  calculateChange,
  getPriceExtremes,
  calculateRelativePerformance,
} from '../../utils/calculations';
import {
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
} from '../../utils/formatters';

describe('Data Transformation Logic Tests (utils/calculations)', () => {
  describe('calculateChange', () => {
    test('calculates positive gain and percentage', () => {
      const result = calculateChange(120, 100);
      expect(result.change).toBe(20);
      expect(result.percent).toBe(20);
    });

    test('calculates negative loss and percentage', () => {
      const result = calculateChange(80, 100);
      expect(result.change).toBe(-20);
      expect(result.percent).toBe(-20);
    });

    test('handles zero previous price gracefully', () => {
      const result = calculateChange(50, 0);
      expect(result.change).toBe(50);
      expect(result.percent).toBe(0);
    });
  });

  describe('getPriceExtremes', () => {
    test('finds min, max, and accurate average across points', () => {
      const points = [
        { timestamp: '1', displayTime: '1', price: 100 },
        { timestamp: '2', displayTime: '2', price: 200 },
        { timestamp: '3', displayTime: '3', price: 150 },
      ];
      const extremes = getPriceExtremes(points);
      expect(extremes.min).toBe(100);
      expect(extremes.max).toBe(200);
      expect(extremes.avg).toBe(150);
    });

    test('returns zeros when array is empty', () => {
      const extremes = getPriceExtremes([]);
      expect(extremes.min).toBe(0);
      expect(extremes.max).toBe(0);
      expect(extremes.avg).toBe(0);
    });
  });

  describe('calculateRelativePerformance (Normalization to 0% base)', () => {
    test('normalizes time series starting at 0% return', () => {
      const points = [
        { timestamp: '1', displayTime: '1', price: 100 },
        { timestamp: '2', displayTime: '2', price: 110 },
        { timestamp: '3', displayTime: '3', price: 95 },
      ];
      const normalized = calculateRelativePerformance(points);
      expect(normalized).toHaveLength(3);
      expect(normalized[0].relativeReturn).toBe(0);
      expect(normalized[1].relativeReturn).toBe(10);
      expect(normalized[2].relativeReturn).toBe(-5);
    });

    test('handles empty points array', () => {
      expect(calculateRelativePerformance([])).toEqual([]);
    });
  });
});

describe('Formatters Transformation Tests (utils/formatters)', () => {
  test('formatCurrency formats USD amounts properly', () => {
    expect(formatCurrency(191.55)).toBe('$191.55');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  test('formatPercentage formats signs and decimal precision', () => {
    expect(formatPercentage(1.5)).toBe('+1.50%');
    expect(formatPercentage(-2.35)).toBe('-2.35%');
    expect(formatPercentage(0)).toBe('0.00%');
  });

  test('formatCompactNumber handles K, M, B, T magnitudes correctly', () => {
    expect(formatCompactNumber(950)).toBe('950');
    expect(formatCompactNumber(1500)).toBe('1.5K');
    expect(formatCompactNumber(1500000)).toBe('1.50M');
    expect(formatCompactNumber(3200000000)).toBe('3.20B');
    expect(formatCompactNumber(1500000000000)).toBe('1.50T');
  });
});
