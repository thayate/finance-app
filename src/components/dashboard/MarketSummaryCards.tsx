import React from 'react';
import { StockQuote, CompanyInfo } from '../../services/types';
import { formatCurrency, formatPercentage, formatCompactNumber } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Layers } from 'lucide-react';

interface MarketSummaryCardsProps {
  companies: CompanyInfo[];
  quotes: Record<string, StockQuote>;
  activeSymbol: string;
  onSelectCompany: (symbol: string) => void;
  loading?: boolean;
}

export const MarketSummaryCards: React.FC<MarketSummaryCardsProps> = ({
  companies,
  quotes,
  activeSymbol,
  onSelectCompany,
  loading,
}) => {
  return (
    <div className="market-summary-section">
      <div className="section-title-row">
        <div className="title-with-icon">
          <Layers size={18} color="#0f62fe" />
          <h3 className="section-title">Peer Group Quick Overview</h3>
        </div>
        <span className="section-subtitle">Click card to inspect detailed indicators</span>
      </div>

      <div className="peer-summary-cards-grid">
        {companies.map((company) => {
          const quote = quotes[company.symbol];
          const isSelected = activeSymbol === company.symbol;
          const isPositive = (quote?.change ?? 0) >= 0;

          if (loading || !quote) {
            return (
              <div key={company.symbol} className="peer-card skeleton">
                <div className="skeleton-line title" />
                <div className="skeleton-line price" />
              </div>
            );
          }

          return (
            <div
              key={company.symbol}
              className={`peer-card ${isSelected ? 'active' : ''} ${company.isMain ? 'main-company' : ''}`}
              onClick={() => onSelectCompany(company.symbol)}
              role="button"
              tabIndex={0}
            >
              <div className="peer-card-top">
                <span className="peer-symbol">{company.symbol}</span>
                {company.isMain && <span className="badge-primary">IBM Focus</span>}
              </div>
              <div className="peer-name">{company.name}</div>

              <div className="peer-price-row">
                <span className="peer-price">{formatCurrency(quote.price, quote.currency)}</span>
                <div className={`peer-change ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{formatPercentage(quote.changePercent)}</span>
                </div>
              </div>

              <div className="peer-stats-footer">
                <span>Vol: {formatCompactNumber(quote.volume)}</span>
                <span>Cap: {quote.marketCap || 'N/A'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
