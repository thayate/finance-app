import React from 'react';
import { Timeframe } from '../../services/types';
import { Calendar, Clock, BarChart3 } from 'lucide-react';

interface TimeframeSelectorProps {
  selected: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

const TIMEFRAMES: { key: Timeframe; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: '1D', label: 'Today', icon: <Clock size={14} />, desc: 'Current Day (Intraday)' },
  { key: '7D', label: 'Last 7 Days', icon: <Calendar size={14} />, desc: '1-Week Daily Performance' },
  { key: '1Q', label: 'Last Quarter', icon: <BarChart3 size={14} />, desc: 'Quarterly Trend & Volatility' },
];

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="timeframe-selector" role="group" aria-label="Timeframe selection">
      {TIMEFRAMES.map((tf) => {
        const isActive = selected === tf.key;
        return (
          <button
            key={tf.key}
            className={`timeframe-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(tf.key)}
            title={tf.desc}
          >
            {tf.icon}
            <span>{tf.label}</span>
          </button>
        );
      })}
    </div>
  );
};
