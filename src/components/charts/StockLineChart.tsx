import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { StockHistory } from '../../services/types';
import { ChartCard } from './ChartCard';
import { formatCurrency } from '../../utils/formatters';

interface StockLineChartProps {
  history?: StockHistory;
  loading?: boolean;
}

export const StockLineChart: React.FC<StockLineChartProps> = ({ history, loading }) => {
  const points = history?.points || [];
  const prices = points.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) * 0.995 : 0;
  const maxPrice = prices.length ? Math.max(...prices) * 1.005 : 0;

  return (
    <ChartCard
      title={`${history?.symbol || ''} Price Trend`}
      subtitle={`Timeframe: ${history?.timeframe || ''} - Historical price action`}
      loading={loading}
    >
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f62fe" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0f62fe" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="displayTime" stroke="#525252" fontSize={12} tickLine={false} />
            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="#525252"
              fontSize={12}
              tickLine={false}
              tickFormatter={(val) => `$${val.toFixed(1)}`}
            />
            <Tooltip
              formatter={(val: any) => [formatCurrency(Number(val)), 'Price']}
              labelFormatter={(label) => `Time / Date: ${label}`}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: 6, border: '1px solid #dcdcdc' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#0f62fe"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
