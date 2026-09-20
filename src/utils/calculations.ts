import { PricePoint } from '../services/types';

export function calculateChange(current: number, previous: number): { change: number; percent: number } {
  const change = current - previous;
  const percent = previous !== 0 ? (change / previous) * 100 : 0;
  return {
    change: Number(change.toFixed(2)),
    percent: Number(percent.toFixed(2)),
  };
}

export function getPriceExtremes(points: PricePoint[]): { min: number; max: number; avg: number } {
  if (!points || points.length === 0) {
    return { min: 0, max: 0, avg: 0 };
  }
  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const sum = prices.reduce((acc, p) => acc + p, 0);
  const avg = Number((sum / prices.length).toFixed(2));
  return { min, max, avg };
}

/**
 * Normalizes price points so that the start value is 0% (relative performance comparison)
 */
export function calculateRelativePerformance(points: PricePoint[]): Array<PricePoint & { relativeReturn: number }> {
  if (!points || points.length === 0) return [];
  const basePrice = points[0].price;
  return points.map((pt) => ({
    ...pt,
    relativeReturn: basePrice !== 0 ? Number((((pt.price - basePrice) / basePrice) * 100).toFixed(2)) : 0,
  }));
}
