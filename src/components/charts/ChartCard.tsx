import React, { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  loading?: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  action,
  children,
  loading,
}) => {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3 className="chart-card-title">{title}</h3>
          {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
        </div>
        {action && <div className="chart-card-action">{action}</div>}
      </div>
      <div className="chart-card-content">
        {loading ? (
          <div className="chart-loading-spinner">
            <div className="spinner" />
            <span>Loading chart data...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
