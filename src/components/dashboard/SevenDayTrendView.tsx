import React from 'react';
import { StockHistory, StockQuote, CompanyInfo } from '../../services/types';
import { ComparisonChart } from '../charts/ComparisonChart';
import { CompanySelector } from './CompanySelector';
import { ChartCard } from '../charts/ChartCard';
import { calculateChange } from '../../utils/calculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownRight, Award } from 'lucide-react';

interface SevenDayTrendViewProps {
  companies: CompanyInfo[];
  quotes: Record<string, StockQuote>;
  histories: Record<string, StockHistory>;
  selectedSymbols: string[];
  activeSymbol: string;
  onSelectActive: (symbol: string) => void;
  onToggleCompare: (symbol: string) => void;
  loading?: boolean;
}

export const SevenDayTrendView: React.FC<SevenDayTrendViewProps> = ({
  companies,
  quotes,
  histories,
  selectedSymbols,
  activeSymbol,
  onSelectActive,
  onToggleCompare,
  loading,
}) => {
  // Calculate 7-day cumulative returns for selected companies
  const performanceRankings = selectedSymbols.map((sym) => {
    const points = histories[sym]?.points || [];
    const firstPrice = points[0]?.price || 1;
    const latestPrice = points[points.length - 1]?.price || firstPrice;
    const { change, percent } = calculateChange(latestPrice, firstPrice);
    const company = companies.find((c) => c.symbol === sym);
    return {
      symbol: sym,
      name: company?.name || sym,
      isMain: company?.isMain,
      firstPrice,
      latestPrice,
      change,
      percent,
    };
  }).sort((a, b) => b.percent - a.percent);

  return (
    <div className="view-container 7d-view">
      <CompanySelector
        companies={companies}
        selectedSymbols={selectedSymbols}
        activeSymbol={activeSymbol}
        onSelectActive={onSelectActive}
        onToggleCompare={onToggleCompare}
      />

      <div className="trend-analysis-row">
        <div className="trend-main-chart">
          <ComparisonChart
            histories={histories}
            symbols={selectedSymbols}
            timeframe="7D"
            loading={loading}
          />
        </div>

        <div className="trend-ranking-panel">
          <ChartCard
            title="7-Day Performance Ranking"
            subtitle="Sorted by cumulative 7-day return"
            loading={loading}
          >
            <div className="rankings-list">
              {performanceRankings.map((item, index) => {
                const isPositive = item.percent >= 0;
                return (
                  <div
                    key={item.symbol}
                    className={`ranking-item ${item.isMain ? 'highlight-ibm' : ''}`}
                    onClick={() => onSelectActive(item.symbol)}
                  >
                    <div className="ranking-rank">
                      {index === 0 ? <Award size={16} color="#f1c21b" /> : `#${index + 1}`}
                    </div>
                    <div className="ranking-details">
                      <div className="ranking-symbol-row">
                        <span className="ranking-symbol">{item.symbol}</span>
                        {item.isMain && <span className="ibm-pill">IBM</span>}
                      </div>
                      <span className="ranking-prices">
                        {formatCurrency(item.firstPrice)} → {formatCurrency(item.latestPrice)}
                      </span>
                    </div>
                    <div className={`ranking-return ${isPositive ? 'positive' : 'negative'}`}>
                      {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      <span>{formatPercentage(item.percent)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
