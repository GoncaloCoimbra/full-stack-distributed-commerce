import React, { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { sku: string; discountPct: number; reason?: string; expiresAt?: string }) => void;
};

export default function CommandModal({ open, onClose, onSubmit }: Props) {
  const [sku, setSku] = useState('');
  const [discountPct, setDiscountPct] = useState(10);
  const [reason, setReason] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  if (!open) return null;

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    onSubmit({ sku, discountPct: Number(discountPct), reason: reason || undefined, expiresAt: expiresAt || undefined });
    setSku('');
    setDiscountPct(10);
    setReason('');
    setExpiresAt('');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <header>
          <h3>Criar Desconto</h3>
        </header>
        <form onSubmit={handleSubmit}>
          <label>
            SKU
            <input value={sku} onChange={(e) => setSku(e.target.value)} required />
          </label>
          <label>
            Percentual de desconto
            <input type="number" min={0} max={100} value={discountPct} onChange={(e) => setDiscountPct(Number(e.target.value))} required />
          </label>
          <label>
            Motivo (opcional)
            <input value={reason} onChange={(e) => setReason(e.target.value)} />
          </label>
          <label>
            Expira em (opcional)
            <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-send">Criar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
