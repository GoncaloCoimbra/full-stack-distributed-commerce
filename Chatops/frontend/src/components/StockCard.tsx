import React from 'react';

interface StockPayload {
  sku: string;
  title: string;
  imageUrl?: string;
  stock: number;
  stockPct: number;
  minRecommended?: number;
  location?: string;
  actions?: Array<{ label: string; action: string; meta?: any }>;
}

export default function StockCard({ payload }: { payload: StockPayload }) {
  const color = payload.stockPct > 50 ? '#12a454' : payload.stockPct > 20 ? '#f5a623' : '#ff3b30';
  return (
    <div className="stock-card">
      <div className="stock-card-left">
        {payload.imageUrl ? (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img src={payload.imageUrl} alt={`Imagem ${payload.sku}`} className="stock-thumb" />
        ) : (
          <div className="stock-thumb placeholder">{payload.sku.slice(0, 2).toUpperCase()}</div>
        )}
      </div>
      <div className="stock-card-body">
        <div className="stock-title">{payload.title} <span className="stock-sku">{payload.sku}</span></div>
        <div className="stock-meta">Local: {payload.location || '—'} • Min: {payload.minRecommended ?? '—'}</div>
        <div className="stock-bar-wrap">
          <div className="stock-bar" style={{ background: `linear-gradient(90deg, ${color} ${payload.stockPct}%, rgba(0,0,0,0.06) ${payload.stockPct}%)` }} />
          <div className="stock-bar-label">{payload.stock} unidades — {payload.stockPct}%</div>
        </div>
        <div className="stock-actions">
          {(payload.actions || []).map((a) => (
            <button key={a.label} className="stock-action-btn">{a.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
