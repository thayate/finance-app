import React, { useState, useEffect, useCallback } from 'react';
import { StockQuote, StockHistory, Timeframe } from '../../services/types';
import { financeService } from '../../services/yahooFinance';
import { validateTickerSymbol } from '../../utils/validation';
import { StockLineChart } from '../charts/StockLineChart';
import { VolumeBarChart } from '../charts/VolumeBarChart';
import { MetricCard } from './MetricCard';
import { Search, PlusCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface CustomCompanySectionProps {
  timeframe: Timeframe;
}

const PRESET_SYMBOLS = ['NVDA', 'CRM', 'AMZN', 'INTC'];

export const CustomCompanySection: React.FC<CustomCompanySectionProps> = ({ timeframe }) => {
  const [inputSymbol, setInputSymbol] = useState<string>('');
  const [activeCustomSymbol, setActiveCustomSymbol] = useState<string | null>(null);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [history, setHistory] = useState<StockHistory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCustomData = useCallback(async (symbolToFetch: string) => {
    const cleanSym = symbolToFetch.trim().toUpperCase();
    const validation = validateTickerSymbol(cleanSym);
    if (!validation.isValid) {
      setErrorMessage(validation.errors[0]);
      setQuote(null);
      setHistory(null);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const [fetchedQuote, fetchedHistory] = await Promise.all([
        financeService.getQuote(cleanSym),
        financeService.getHistory(cleanSym, timeframe),
      ]);
      setQuote(fetchedQuote);
      setHistory(fetchedHistory);
      setActiveCustomSymbol(cleanSym);
    } catch (err: any) {
      setErrorMessage(err.message || `No data available for symbol '${cleanSym}'`);
      setQuote(null);
      setHistory(null);
      setActiveCustomSymbol(cleanSym);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  // Refetch when timeframe changes if a custom symbol is already selected
  useEffect(() => {
    if (activeCustomSymbol) {
      fetchCustomData(activeCustomSymbol);
    }
  }, [timeframe, activeCustomSymbol, fetchCustomData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSymbol.trim()) {
      fetchCustomData(inputSymbol);
    }
  };

  const handlePresetClick = (sym: string) => {
    setInputSymbol(sym);
    fetchCustomData(sym);
  };

  return (
    <section className="custom-company-section">
      <div className="custom-section-header">
        <div className="custom-header-title-row">
          <PlusCircle size={20} color="#0f62fe" />
          <div>
            <h3 className="custom-section-title">Explore Custom Company Graph</h3>
            <p className="custom-section-subtitle">
              Enter any ticker symbol to inspect an additional standalone company graph
            </p>
          </div>
        </div>

        {/* Input Form & Presets */}
        <div className="custom-lookup-controls">
          <form className="custom-symbol-form" onSubmit={handleSubmit}>
            <div className="input-icon-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="custom-symbol-input"
                placeholder="Enter Ticker (e.g. NVDA, CRM)"
                value={inputSymbol}
                onChange={(e) => setInputSymbol(e.target.value)}
                maxLength={5}
                aria-label="Custom company ticker symbol"
              />
            </div>
            <button
              type="submit"
              className="lookup-submit-btn"
              disabled={loading || !inputSymbol.trim()}
            >
              {loading ? 'Loading...' : 'Load Graph'}
            </button>
          </form>

          <div className="preset-suggestions">
            <span className="preset-label">Quick Pick:</span>
            {PRESET_SYMBOLS.map((sym) => (
              <button
                key={sym}
                className={`preset-btn ${activeCustomSymbol === sym ? 'active' : ''}`}
                onClick={() => handlePresetClick(sym)}
                type="button"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Display Area */}
      <div className="custom-company-display">
        {errorMessage && (
          <div className="no-data-alert" role="alert">
            <AlertCircle size={20} color="#da1e28" />
            <div className="no-data-content">
              <h4>Data Unavailable</h4>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {!activeCustomSymbol && !errorMessage && !loading && (
          <div className="custom-empty-prompt">
            <HelpCircle size={24} color="#8d8d8d" />
            <span>Enter a company ticker symbol above to load its market trend and volume graph.</span>
          </div>
        )}

        {quote && !errorMessage && (
          <div className="custom-loaded-results">
            <MetricCard quote={quote} loading={loading} />
            <div className="charts-grid">
              <StockLineChart history={history || undefined} loading={loading} />
              <VolumeBarChart history={history || undefined} loading={loading} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
