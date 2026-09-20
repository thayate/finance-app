import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../../App';
import { MetricCard } from '../dashboard/MetricCard';
import { TimeframeSelector } from '../dashboard/TimeframeSelector';
import { MarketSummaryCards } from '../dashboard/MarketSummaryCards';
import { TRACKED_COMPANIES, MOCK_QUOTES } from '../../services/mockData';

describe('UI Rendering Paths & Component Tests', () => {
  describe('MetricCard Rendering Path', () => {
    test('renders skeleton loader when loading is true', () => {
      const { container } = render(<MetricCard loading={true} />);
      expect(container.querySelector('.skeleton')).toBeInTheDocument();
    });

    test('renders full metric data correctly when quote provided', () => {
      const mockQuote = MOCK_QUOTES.IBM;
      render(<MetricCard quote={mockQuote} loading={false} />);

      expect(screen.getByText('IBM')).toBeInTheDocument();
      expect(screen.getByText('International Business Machines')).toBeInTheDocument();
      expect(screen.getByText('$191.55')).toBeInTheDocument();
      expect(screen.getByText('$2.85')).toBeInTheDocument();
      expect(screen.getByText('(+1.51%)')).toBeInTheDocument();
      expect(screen.getByText(/4.24M/i)).toBeInTheDocument();
    });
  });

  describe('TimeframeSelector Rendering Path', () => {
    test('highlights the currently selected timeframe button', () => {
      const handleSelect = jest.fn();
      render(<TimeframeSelector selected="7D" onChange={handleSelect} />);

      const sevenDayBtn = screen.getByText('Last 7 Days').closest('button');
      expect(sevenDayBtn).toHaveClass('active');

      const todayBtn = screen.getByText('Today').closest('button');
      expect(todayBtn).not.toHaveClass('active');

      fireEvent.click(todayBtn!);
      expect(handleSelect).toHaveBeenCalledWith('1D');
    });
  });

  describe('MarketSummaryCards Rendering Path', () => {
    test('renders peer group cards and handles click to select', () => {
      const handleSelect = jest.fn();
      render(
        <MarketSummaryCards
          companies={TRACKED_COMPANIES}
          quotes={MOCK_QUOTES}
          activeSymbol="IBM"
          onSelectCompany={handleSelect}
        />
      );

      expect(screen.getByText('Peer Group Quick Overview')).toBeInTheDocument();
      expect(screen.getByText('IBM Focus')).toBeInTheDocument();

      const msftCard = screen.getByText('Microsoft Corporation').closest('.peer-card');
      expect(msftCard).toBeInTheDocument();

      fireEvent.click(msftCard!);
      expect(handleSelect).toHaveBeenCalledWith('MSFT');
    });
  });

  describe('App Full Integration Rendering Paths', () => {
    test('renders main dashboard shell with header, controls and default Today view', async () => {
      await act(async () => {
        render(<App />);
      });
      expect(screen.getByText(/Market Analytics Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/IBM & Competitor Peer Group Performance Lab/i)).toBeInTheDocument();
      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
      expect(screen.getByText('Last Quarter')).toBeInTheDocument();
    });

    test('renders 7-Day view with performance ranking when clicked', async () => {
      await act(async () => {
        render(<App />);
      });
      const sevenDayBtn = screen.getByText('Last 7 Days');
      await act(async () => {
        fireEvent.click(sevenDayBtn);
      });

      await waitFor(() => {
        expect(screen.getByText(/7-Day Performance Ranking/i)).toBeInTheDocument();
        expect(screen.getByText(/Peer Group Relative Performance/i)).toBeInTheDocument();
      });
    });

    test('renders 1Q view with volatility matrix table when clicked', async () => {
      await act(async () => {
        render(<App />);
      });
      const quarterBtn = screen.getByText('Last Quarter');
      await act(async () => {
        fireEvent.click(quarterBtn);
      });

      await waitFor(() => {
        expect(screen.getByText(/Quarterly Volatility & Peer Comparison Matrix/i)).toBeInTheDocument();
        expect(screen.getByText(/Volatility Band/i)).toBeInTheDocument();
        expect(screen.getByText('Quarter Start')).toBeInTheDocument();
        expect(screen.getByText('Quarter End')).toBeInTheDocument();
      });
    });
  });
});
