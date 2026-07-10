import React, { useState } from 'react';

// ─── Design Tokens (same as Login / Register / DashboardAdvanced) ──────────────
const ds = {
  bg:       '#07090f',
  bgCard:   '#0d1117',
  bgInput:  '#0a0e17',
  border:   '#1a2234',
  accent:   '#4f85f6',
  textPrimary:   '#f0f4ff',
  textSecondary: '#7a8fa8',
  textMuted:     '#3a4d63',
  success: '#34d399',
  danger:  '#f87171',
};

interface Supplier {
  id: string;
  name: string;
  productCount: number;
}

interface DashboardFiltersProps {
  availableSuppliers: Supplier[];
  onFilterChange: (_filters: FilterState) => void;
  loading?: boolean;
}

export interface FilterState {
  period: string;
  supplierId: string | null;
  startDate: string | null;
  endDate: string | null;
  useCustomDate: boolean;
}

const PERIODS = [
  { value: '7d',  label: '7 dias'  },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
  { value: '1y',  label: '1 year'   },
];

const inputClass = `w-full rounded-xl px-3 py-2.5 text-sm transition-all duration-200 outline-none
  bg-[#0a0e17] border border-[#1a2234] text-[#f0f4ff] placeholder-[#3a4d63]
  focus:border-[#4f85f6] focus:ring-2 focus:ring-[#4f85f6]/10
  disabled:opacity-40 disabled:cursor-not-allowed`;

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  availableSuppliers,
  onFilterChange,
  loading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    period: '30d',
    supplierId: null,
    startDate: null,
    endDate: null,
    useCustomDate: false,
  });

  const activeCount = [
    filters.supplierId,
    filters.useCustomDate && filters.startDate && filters.endDate,
  ].filter(Boolean).length;

  const handlePeriodChange = (period: string) => {
    const next = { ...filters, period, useCustomDate: false, startDate: null, endDate: null };
    setFilters(next);
    onFilterChange(next);
  };

  const handleSupplierChange = (supplierId: string) => {
    const next = { ...filters, supplierId: supplierId === 'all' ? null : supplierId };
    setFilters(next);
    onFilterChange(next);
  };

  const handleCustomDateToggle = () => {
    const useCustomDate = !filters.useCustomDate;
    const next = useCustomDate
      ? { ...filters, useCustomDate }
      : { ...filters, useCustomDate, startDate: null, endDate: null };
    setFilters(next);
    if (!useCustomDate) onFilterChange(next);
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const next = { ...filters, [field]: value };
    setFilters(next);
    if (next.startDate && next.endDate) onFilterChange(next);
  };

  const handleClear = () => {
    const def: FilterState = { period: '30d', supplierId: null, startDate: null, endDate: null, useCustomDate: false };
    setFilters(def);
    onFilterChange(def);
    setIsExpanded(false);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: ds.bgCard, border: `1px solid ${ds.border}` }}
    >
      {/* ── Collapsed header ── */}
      <button
        type="button"
        onClick={() => setIsExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors text-left"
        style={{ background: 'transparent' }}
        onMouseEnter={e => (e.currentTarget.style.background = `${ds.accent}06`)}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${ds.accent}18`, border: `1px solid ${ds.accent}30` }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: ds.accent }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: ds.textPrimary }}>
              Filters
              {activeCount > 0 && (
                <span
                  className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${ds.accent}20`, color: ds.accent }}
                >
                  {activeCount} activo{activeCount > 1 ? 's' : ''}
                </span>
              )}
            </p>
            <p className="text-xs mt-0.5" style={{ color: ds.textMuted }}>
              {isExpanded ? 'Clique para colapsar' : 'Clique para expandir'}
            </p>
          </div>
        </div>

        {/* Active filter chips (visible when collapsed) */}
        <div className="flex items-center gap-2">
          {!isExpanded && activeCount > 0 && (
            <div className="hidden md:flex items-center gap-2">
              {filters.supplierId && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: `${ds.accent}15`, color: ds.accent, border: `1px solid ${ds.accent}30` }}
                >
                  {availableSuppliers.find(s => s.id === filters.supplierId)?.name}
                </span>
              )}
              {filters.useCustomDate && filters.startDate && filters.endDate && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: `${ds.accent}15`, color: ds.accent, border: `1px solid ${ds.accent}30` }}
                >
                  {new Date(filters.startDate).toLocaleDateString('en-GB')} – {new Date(filters.endDate).toLocaleDateString('en-GB')}
                </span>
              )}
            </div>
          )}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
            style={{ color: ds.textMuted }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </button>

      {/* ── Expanded body ── */}
      <div
        style={{
          maxHeight: isExpanded ? '600px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
          borderTop: isExpanded ? `1px solid ${ds.border}` : 'none',
        }}
      >
        <div className="p-5 space-y-6">

          {/* Period */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: ds.textMuted }}>
              Period
            </p>
            <div className="grid grid-cols-4 gap-2">
              {PERIODS.map(p => {
                const active = filters.period === p.value && !filters.useCustomDate;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handlePeriodChange(p.value)}
                    disabled={filters.useCustomDate || loading}
                    className="py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: active ? ds.accent : ds.bg,
                      color: active ? '#fff' : ds.textSecondary,
                      border: `1px solid ${active ? ds.accent : ds.border}`,
                      opacity: (filters.useCustomDate || loading) ? 0.4 : 1,
                      cursor: (filters.useCustomDate || loading) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom date range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: ds.textMuted }}>
                Intervalo personalizado
              </p>
              {/* Toggle */}
              <button
                type="button"
                onClick={handleCustomDateToggle}
                className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 flex-shrink-0"
                style={{ background: filters.useCustomDate ? ds.accent : ds.border }}
              >
                <span
                  className="inline-block h-3.5 w-3.5 rounded-full bg-slate-300 transition-transform duration-200"
                  style={{ transform: filters.useCustomDate ? 'translateX(18px)' : 'translateX(2px)' }}
                />
              </button>
            </div>

            {filters.useCustomDate && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl"
                style={{ background: ds.bg, border: `1px solid ${ds.border}` }}
              >
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: ds.textMuted }}>Date inicial</label>
                  <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={e => handleDateChange('startDate', e.target.value)}
                    className={inputClass}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: ds.textMuted }}>Date final</label>
                  <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={e => handleDateChange('endDate', e.target.value)}
                    min={filters.startDate || undefined}
                    className={inputClass}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Supplier */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: ds.textMuted }}>
              Supplier
            </p>
            <select
              value={filters.supplierId || 'all'}
              onChange={e => handleSupplierChange(e.target.value)}
              disabled={loading}
              className={inputClass}
              style={{ background: ds.bgInput }}
            >
              <option value="all" style={{ background: ds.bgCard }}>All suppliers</option>
              {availableSuppliers.map(s => (
                <option key={s.id} value={s.id} style={{ background: ds.bgCard }}>
                  {s.name} — {s.productCount} product{s.productCount !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Footer actions */}
          <div
            className="flex items-center justify-between pt-2"
            style={{ borderTop: `1px solid ${ds.border}` }}
          >
            <button
              type="button"
              onClick={handleClear}
              disabled={loading || activeCount === 0}
              className="text-sm font-medium transition-colors"
              style={{
                color: activeCount > 0 ? ds.danger : ds.textMuted,
                opacity: activeCount === 0 ? 0.4 : 1,
                cursor: activeCount === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Clear filters
            </button>

            {loading && (
              <div className="flex items-center gap-2 text-xs" style={{ color: ds.textMuted }}>
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                A aplicar...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;