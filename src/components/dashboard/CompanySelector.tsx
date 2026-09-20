import React from 'react';
import { CompanyInfo } from '../../services/types';
import { Check } from 'lucide-react';

interface CompanySelectorProps {
  companies: CompanyInfo[];
  selectedSymbols: string[];
  activeSymbol: string;
  onSelectActive: (symbol: string) => void;
  onToggleCompare: (symbol: string) => void;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  companies,
  selectedSymbols,
  activeSymbol,
  onSelectActive,
  onToggleCompare,
}) => {
  return (
    <div className="company-selector">
      <div className="selector-header">
        <span className="selector-title">Monitored Peer Group (Select to focus / Check to compare)</span>
      </div>
      <div className="company-chips">
        {companies.map((comp) => {
          const isFocused = activeSymbol === comp.symbol;
          const isCompared = selectedSymbols.includes(comp.symbol);

          return (
            <div
              key={comp.symbol}
              className={`company-chip ${isFocused ? 'focused' : ''}`}
            >
              <button
                className="chip-main-btn"
                onClick={() => onSelectActive(comp.symbol)}
                title={`Focus on ${comp.name}`}
              >
                <span className="chip-symbol">{comp.symbol}</span>
                {comp.isMain && <span className="main-tag">Primary</span>}
              </button>
              <button
                className={`chip-checkbox ${isCompared ? 'checked' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(comp.symbol);
                }}
                title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
              >
                {isCompared && <Check size={12} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
