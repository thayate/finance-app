import React from 'react';
import { useStockData } from './hooks/useStockData';
import { Header } from './components/common/Header';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { TimeframeSelector } from './components/dashboard/TimeframeSelector';
import { TodaySummaryView } from './components/dashboard/TodaySummaryView';
import { SevenDayTrendView } from './components/dashboard/SevenDayTrendView';
import { QuarterComparisonView } from './components/dashboard/QuarterComparisonView';
import './App.css';

export const App: React.FC = () => {
  const {
    companies,
    selectedSymbols,
    activeSymbol,
    timeframe,
    quotes,
    histories,
    loading,
    error,
    setActiveSymbol,
    setTimeframe,
    toggleSymbol,
    refreshData,
  } = useStockData('1D');

  const activeQuote = quotes[activeSymbol];

  return (
    <ErrorBoundary>
      <div className="dashboard-container">
        <Header
          onRefresh={refreshData}
          loading={loading}
          lastUpdated={activeQuote?.lastUpdated}
        />

        {error && <div className="error-alert">Error: {error}</div>}

        <div className="dashboard-controls">
          <TimeframeSelector selected={timeframe} onChange={setTimeframe} />
        </div>

        {/* 1. 当日の市場サマリービュー */}
        {timeframe === '1D' && (
          <TodaySummaryView
            companies={companies}
            quotes={quotes}
            histories={histories}
            activeSymbol={activeSymbol}
            onSelectCompany={setActiveSymbol}
            loading={loading}
          />
        )}

        {/* 2. 過去7日間のトレンド比較ビュー */}
        {timeframe === '7D' && (
          <SevenDayTrendView
            companies={companies}
            quotes={quotes}
            histories={histories}
            selectedSymbols={selectedSymbols}
            activeSymbol={activeSymbol}
            onSelectActive={setActiveSymbol}
            onToggleCompare={toggleSymbol}
            loading={loading}
          />
        )}

        {/* 3. 前四半期の比較ビュー */}
        {timeframe === '1Q' && (
          <QuarterComparisonView
            companies={companies}
            quotes={quotes}
            histories={histories}
            selectedSymbols={selectedSymbols}
            activeSymbol={activeSymbol}
            onSelectActive={setActiveSymbol}
            onToggleCompare={toggleSymbol}
            loading={loading}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
