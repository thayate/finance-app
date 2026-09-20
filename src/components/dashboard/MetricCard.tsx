import React from 'react';
import { StockQuote } from '../../services/types';
import { formatCurrency, formatPercentage, formatCompactNumber } from '../../utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface MetricCardProps {
  quote?: StockQuote;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ quote, loading }) => {
  if (loading || !quote) {
    return (
      <div className="metric-card skeleton">
        <div className="skeleton-line title" />
        <div className="skeleton-line price" />
        <div className="skeleton-line subtitle" />
      </div>
    );
  }

  const isPositive = quote.change >= 0;

  return (
    <div className="metrics-summary-grid">
      <div className="metric-card main-quote">
        <div className="metric-header">
          <span className="metric-symbol">{quote.symbol}</span>
          <span className="metric-name">{quote.name}</span>
        </div>
        <div className="metric-body">
          <span className="current-price">{formatCurrency(quote.price, quote.currency)}</span>
          <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{formatCurrency(quote.change, quote.currency)}</span>
            <span>({formatPercentage(quote.changePercent)})</span>
          </div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-card-label">
          <DollarSign size={16} className="text-muted" />
          <span>Day Range (High / Low)</span>
        </div>
        <div className="metric-card-value">
          {formatCurrency(quote.low)} - {formatCurrency(quote.high)}
        </div>
        <div className="metric-card-sub">
          Prev Close: {formatCurrency(quote.previousClose)} | Open: {formatCurrency(quote.open)}
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-card-label">
          <Activity size={16} className="text-muted" />
          <span>Volume & Market Cap</span>
        </div>
        <div className="metric-card-value">
          {formatCompactNumber(quote.volume)} shares
        </div>
        <div className="metric-card-sub">
          Market Cap: {quote.marketCap || 'N/A'}
        </div>
      </div>
    </div>
  );
};
