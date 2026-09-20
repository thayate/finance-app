import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { StockHistory } from '../../services/types';
import { ChartCard } from './ChartCard';
import { formatCompactNumber } from '../../utils/formatters';

interface VolumeBarChartProps {
  history?: StockHistory;
  loading?: boolean;
}

export const VolumeBarChart: React.FC<VolumeBarChartProps> = ({ history, loading }) => {
  const points = history?.points || [];

  return (
    <ChartCard
      title={`${history?.symbol || ''} Trading Volume`}
      subtitle="Volume distribution over selected timeframe"
      loading={loading}
    >
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="displayTime" stroke="#525252" fontSize={12} tickLine={false} />
            <YAxis
              stroke="#525252"
              fontSize={12}
              tickLine={false}
              tickFormatter={(val) => formatCompactNumber(val)}
            />
            <Tooltip
              formatter={(val: any) => [formatCompactNumber(Number(val)), 'Volume']}
              labelFormatter={(label) => `Interval: ${label}`}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: 6, border: '1px solid #dcdcdc' }}
            />
            <Bar dataKey="volume" fill="#8a3ffc" opacity={0.85} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
