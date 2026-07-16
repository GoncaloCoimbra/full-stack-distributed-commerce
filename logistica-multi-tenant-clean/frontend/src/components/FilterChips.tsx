import React from 'react';
import { X } from 'lucide-react';

interface FilterValue {
  key: string;
  label: string;
  value: string;
  type: 'supplier' | 'product' | 'vehicle' | 'transport' | 'status' | 'location' | 'date';
}

interface FilterChipsProps {
  filters: FilterValue[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, onRemove, onClearAll }) => {
  if (filters.length === 0) return null;

  const getChipColor = (type: FilterValue['type']) => {
    const colors = {
      supplier: 'bg-purple-500/20 border-purple-500 text-purple-300',
      product: 'bg-green-500/20 border-green-500 text-green-300',
      vehicle: 'bg-red-500/20 border-red-500 text-red-300',
      transport: 'bg-orange-500/20 border-orange-500 text-orange-300',
      status: 'bg-amber-500/20 border-amber-500 text-amber-300',
      location: 'bg-cyan-500/20 border-cyan-500 text-cyan-300',
      date: 'bg-pink-500/20 border-pink-500 text-pink-300',
    };
    return colors[type] || colors.status;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-xl p-4 border border-amber-500/30 shadow-lg mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Active Filters ({filters.length})
        </h3>
        <button
          onClick={onClearAll}
          className="text-xs text-red-400 hover:text-red-300 font-semibold hover:bg-red-900/30 px-3 py-1.5 rounded-lg transition-all border border-red-500/30 hover:border-red-500"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div
            key={filter.key}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-medium text-sm transition-all hover:shadow-lg ${getChipColor(filter.type)}`}
          >
            <span className="font-bold">{filter.label}:</span>
            <span className="font-normal">"{filter.value}"</span>
            <button
              onClick={() => onRemove(filter.key)}
              className="ml-1 hover:bg-slate-700/20 rounded-full p-0.5 transition-all"
              title={`Remove filter ${filter.label}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-amber-500/20">
        <p className="text-xs text-slate-400">
          <span className="font-semibold">Tip:</span> Click the remove button to clear a specific filter or use "Clear All" to reset.
        </p>
      </div>
    </div>
  );
};

export default FilterChips;
