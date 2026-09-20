import { PricePoint, StockQuote } from '../services/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates stock quote data integrity
 */
export function validateStockQuote(quote: Partial<StockQuote>): ValidationResult {
  const errors: string[] = [];

  if (!quote.symbol || typeof quote.symbol !== 'string' || quote.symbol.trim() === '') {
    errors.push('Symbol is required and must be a non-empty string.');
  }

  if (quote.price === undefined || typeof quote.price !== 'number' || isNaN(quote.price) || quote.price < 0) {
    errors.push('Price must be a non-negative number.');
  }

  if (quote.previousClose !== undefined && (typeof quote.previousClose !== 'number' || isNaN(quote.previousClose) || quote.previousClose < 0)) {
    errors.push('Previous close must be a non-negative number.');
  }

  if (quote.high !== undefined && quote.low !== undefined && quote.high < quote.low) {
    errors.push('High price cannot be less than low price.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates historical series points
 */
export function validatePricePoints(points: PricePoint[]): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(points)) {
    return { isValid: false, errors: ['Points must be an array.'] };
  }

  if (points.length === 0) {
    return { isValid: false, errors: ['Historical series cannot be empty.'] };
  }

  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    if (typeof pt.price !== 'number' || isNaN(pt.price) || pt.price < 0) {
      errors.push(`Point at index ${i} has invalid price: ${pt.price}`);
    }
    if (!pt.timestamp || typeof pt.timestamp !== 'string') {
      errors.push(`Point at index ${i} has invalid timestamp.`);
    }
    if (errors.length >= 5) {
      errors.push('Too many validation errors in series.');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
