import React from 'react';
import { StockQuote, StockHistory } from '../../services/types';
import { MetricCard } from './MetricCard';
import { StockLineChart } from '../charts/StockLineChart';
import { VolumeBarChart } from '../charts/VolumeBarChart';
import { MarketSummaryCards } from './MarketSummaryCards';
import { CompanyInfo } from '../../services/types';

interface TodaySummaryViewProps {
  companies: CompanyInfo[];
  quotes: Record<string, StockQuote>;
  histories: Record<string, StockHistory>;
  activeSymbol: string;
  onSelectCompany: (symbol: string) => void;
  loading?: boolean;
}

export const TodaySummaryView: React.FC<TodaySummaryViewProps> = ({
  companies,
  quotes,
  histories,
  activeSymbol,
  onSelectCompany,
  loading,
}) => {
  const activeQuote = quotes[activeSymbol];
  const activeHistory = histories[activeSymbol];

  return (
    <div className="view-container today-view">
      <MarketSummaryCards
        companies={companies}
        quotes={quotes}
        activeSymbol={activeSymbol}
        onSelectCompany={onSelectCompany}
        loading={loading}
      />

      <MetricCard quote={activeQuote} loading={loading} />

      <div className="charts-grid">
        <StockLineChart history={activeHistory} loading={loading} />
        <VolumeBarChart history={activeHistory} loading={loading} />
      </div>
    </div>
  );
};
