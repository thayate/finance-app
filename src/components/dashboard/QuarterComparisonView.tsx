import React from 'react';
import { StockHistory, StockQuote, CompanyInfo } from '../../services/types';
import { ComparisonChart } from '../charts/ComparisonChart';
import { ChartCard } from '../charts/ChartCard';
import { CompanySelector } from './CompanySelector';
import { getPriceExtremes } from '../../utils/calculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { TrendingUp, ShieldAlert, Zap } from 'lucide-react';

interface QuarterComparisonViewProps {
  companies: CompanyInfo[];
  quotes: Record<string, StockQuote>;
  histories: Record<string, StockHistory>;
  selectedSymbols: string[];
  activeSymbol: string;
  onSelectActive: (symbol: string) => void;
  onToggleCompare: (symbol: string) => void;
  loading?: boolean;
}

export const QuarterComparisonView: React.FC<QuarterComparisonViewProps> = ({
  companies,
  quotes,
  histories,
  selectedSymbols,
  activeSymbol,
  onSelectActive,
  onToggleCompare,
  loading,
}) => {
  // Compute quarterly volatility, range, and return stats for each tracked company
  const quarterlyMetrics = selectedSymbols.map((sym) => {
    const points = histories[sym]?.points || [];
    const extremes = getPriceExtremes(points);
    const startPrice = points[0]?.price || 1;
    const endPrice = points[points.length - 1]?.price || startPrice;
    const totalReturnPercent = ((endPrice - startPrice) / startPrice) * 100;
    const volatilityPercent = startPrice !== 0 ? ((extremes.max - extremes.min) / startPrice) * 100 : 0;
    const company = companies.find((c) => c.symbol === sym);

    return {
      symbol: sym,
      name: company?.name || sym,
      isMain: company?.isMain,
      startPrice,
      endPrice,
      min: extremes.min,
      max: extremes.max,
      avg: extremes.avg,
      totalReturnPercent,
      volatilityPercent,
    };
  });

  return (
    <div className="view-container 1q-view">
      <CompanySelector
        companies={companies}
        selectedSymbols={selectedSymbols}
        activeSymbol={activeSymbol}
        onSelectActive={onSelectActive}
        onToggleCompare={onToggleCompare}
      />

      <ComparisonChart
        histories={histories}
        symbols={selectedSymbols}
        timeframe="1Q"
        loading={loading}
      />

      <div className="quarter-metrics-card-wrapper">
        <ChartCard
          title="Quarterly Volatility & Peer Comparison Matrix"
          subtitle="Key financial metrics across the 12-week quarterly window"
          loading={loading}
        >
          <div className="quarter-table-container">
            <table className="quarter-matrix-table">
              <thead>
                <tr>
                  <th>Ticker / Company</th>
                  <th>Quarter Start</th>
                  <th>Quarter End</th>
                  <th>Quarter Low / High</th>
                  <th>Volatility Band</th>
                  <th>Total Q-Return</th>
                </tr>
              </thead>
              <tbody>
                {quarterlyMetrics.map((m) => {
                  const isPositive = m.totalReturnPercent >= 0;
                  return (
                    <tr key={m.symbol} className={m.isMain ? 'row-main-ibm' : ''}>
                      <td>
                        <div className="table-symbol-cell">
                          <span className="bold-sym">{m.symbol}</span>
                          {m.isMain && <span className="ibm-pill">IBM</span>}
                        </div>
                        <div className="table-name-sub">{m.name}</div>
                      </td>
                      <td>{formatCurrency(m.startPrice)}</td>
                      <td>{formatCurrency(m.endPrice)}</td>
                      <td>
                        <span className="price-band">
                          {formatCurrency(m.min)} - {formatCurrency(m.max)}
                        </span>
                      </td>
                      <td>
                        <div className="volatility-tag">
                          <Zap size={13} color="#8a3ffc" />
                          <span>{m.volatilityPercent.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`q-return-pill ${isPositive ? 'positive' : 'negative'}`}>
                          {formatPercentage(m.totalReturnPercent)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
