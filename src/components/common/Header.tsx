import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  loading: boolean;
  lastUpdated?: string;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, loading, lastUpdated }) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-logo">
          <Activity size={24} color="#0f62fe" />
        </div>
        <div>
          <h1 className="header-title">Market Analytics Dashboard</h1>
          <p className="header-subtitle">IBM & Competitor Peer Group Performance Lab</p>
        </div>
      </div>
      <div className="header-actions">
        {lastUpdated && (
          <span className="last-updated">
            Updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
        <button
          className={`refresh-btn ${loading ? 'loading' : ''}`}
          onClick={onRefresh}
          disabled={loading}
          title="Refresh Data"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>
    </header>
  );
};
