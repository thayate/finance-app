import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { StockHistory, Timeframe } from '../../services/types';
import { ChartCard } from './ChartCard';
import { calculateRelativePerformance } from '../../utils/calculations';

interface ComparisonChartProps {
  histories: Record<string, StockHistory>;
  symbols: string[];
  timeframe: Timeframe;
  loading?: boolean;
}

const COLORS = ['#0f62fe', '#8a3ffc', '#007d79', '#ff832b', '#fa4d56'];

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  histories,
  symbols,
  timeframe,
  loading,
}) => {
  // Combine relative return data across symbols
  const primarySymbol = symbols[0] || 'IBM';
  const primaryHistory = histories[primarySymbol]?.points || [];

  const chartData = primaryHistory.map((pt, idx) => {
    const row: any = { displayTime: pt.displayTime };
    symbols.forEach((sym) => {
      const symHistory = histories[sym]?.points;
      if (symHistory) {
        const relPoints = calculateRelativePerformance(symHistory);
        if (relPoints[idx]) {
          row[sym] = relPoints[idx].relativeReturn;
        }
      }
    });
    return row;
  });

  return (
    <ChartCard
      title="Peer Group Relative Performance (% Change)"
      subtitle={`Normalized performance comparison across selected symbols (${timeframe})`}
      loading={loading}
    >
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="displayTime" stroke="#525252" fontSize={12} tickLine={false} />
            <YAxis
              stroke="#525252"
              fontSize={12}
              tickLine={false}
              tickFormatter={(val) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`}
            />
            <Tooltip
              formatter={(val: any, name: any) => [`${Number(val) > 0 ? '+' : ''}${Number(val).toFixed(2)}%`, name]}
              labelFormatter={(label) => `Interval: ${label}`}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: 6, border: '1px solid #dcdcdc' }}
            />
            <Legend verticalAlign="top" height={36} />
            {symbols.map((sym, idx) => (
              <Line
                key={sym}
                type="monotone"
                dataKey={sym}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={sym === 'IBM' ? 3 : 1.8}
                dot={false}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
