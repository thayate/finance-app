import { useState, useEffect, useCallback } from 'react';
import { CompanyInfo, StockQuote, StockHistory, Timeframe } from '../services/types';
import { financeService } from '../services/yahooFinance';

export function useStockData(initialTimeframe: Timeframe = '1D') {
  const [companies] = useState<CompanyInfo[]>(financeService.getTrackedCompanies());
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['IBM', 'MSFT', 'ORCL']);
  const [activeSymbol, setActiveSymbol] = useState<string>('IBM');
  const [timeframe, setTimeframe] = useState<Timeframe>(initialTimeframe);
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [histories, setHistories] = useState<Record<string, StockHistory>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const symbolsToFetch = Array.from(new Set([...selectedSymbols, activeSymbol]));
      const [fetchedQuotes, fetchedHistories] = await Promise.all([
        financeService.getQuotes(symbolsToFetch),
        financeService.getHistories(symbolsToFetch, timeframe),
      ]);
      setQuotes(fetchedQuotes);
      setHistories(fetchedHistories);
    } catch (err: any) {
      setError(err.message || 'Failed to load stock data');
    } finally {
      setLoading(false);
    }
  }, [selectedSymbols, activeSymbol, timeframe]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleSymbol = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      if (selectedSymbols.length > 1) {
        setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
      }
    } else {
      if (selectedSymbols.length < 5) {
        setSelectedSymbols([...selectedSymbols, symbol]);
      }
    }
  };

  return {
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
    refreshData: loadData,
  };
}
