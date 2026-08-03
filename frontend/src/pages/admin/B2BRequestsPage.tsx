import React, { useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { apiClient } from '@/services/apiClient';

type B2BQuote = {
  id: string;
  quoteNumber: string;
  companyName?: string;
  contactName?: string;
  itemsCount?: number;
  total?: number;
  status?: string;
  notes?: string;
  createdAt?: string;
};

export default function B2BRequestsPage() {
  const [items, setItems] = useState<B2BQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notesByQuote, setNotesByQuote] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await apiClient.get<any>('/admin/b2b/quotes');
      if (!res.success || !res.data) throw new Error(res.error?.message || 'Erro ao obter orçamentos');
      const payload = (res.data.quotes || res.data.items || []).map((q: any) => ({
        id: q._id || q.id,
        quoteNumber: q.quoteNumber,
        companyName: q.company?.name || q.companyName || q.company,
        contactName: q.contactName || q.requestedBy,
        itemsCount: q.items?.length || q.itemsCount || 0,
        total: q.total || q.estimatedTotal || 0,
        status: q.status,
        notes: q.notes || '',
        createdAt: q.createdAt || q.createdAt
      }));
      setItems(payload);
      setNotesByQuote(payload.reduce((memo, quote) => {
        memo[quote.id] = quote.notes || '';
        return memo;
      }, {} as Record<string, string>));
    } catch (err: any) {
      setError(err?.message || 'Erro desconhecido');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const updateQuote = async (id: string, status: string) => {
    setUpdatingId(id);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await apiClient.put(`/admin/b2b/quotes/${id}`, {
        status,
        notes: notesByQuote[id]?.trim()
      });
      if (!res.success) throw new Error(res.error?.message || 'Falha ao atualizar o pedido');
      setSuccessMessage(`Orçamento ${status} com sucesso.`);
      await load();
    } catch (err: any) {
      setError(err?.message || 'Erro desconhecido ao atualizar.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNoteChange = (id: string, value: string) => {
    setNotesByQuote(prev => ({ ...prev, [id]: value }));
  };

  return (
    <AppLayout>
      <section className="page-hero">
        <h1>Pedidos B2B</h1>
        <p className="page-copy">Gerencie solicitações de empresas e parceiros Tranzor.</p>
      </section>

      <section className="container page-panel" style={{ marginBottom: '4rem' }}>
        {error && <div style={{ color: '#b00', marginBottom: 12 }}>{error}</div>}
        {successMessage && <div style={{ color: '#0a0', marginBottom: 12 }}>{successMessage}</div>}
        {loading ? (
          <div>Carregando pedidos B2B...</div>
        ) : items.length===0 ? (
          <div>Nenhum pedido B2B encontrado.</div>
        ) : (
          <table className="adm-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th>Cotação</th>
                <th>Empresa</th>
                <th>Contato</th>
                <th>Itens</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i=> (
                <React.Fragment key={i.id}>
                  <tr>
                    <td style={{ fontWeight: 700 }}>{i.quoteNumber}</td>
                    <td style={{ color: '#666' }}>{i.companyName||'-'}</td>
                    <td style={{ color: '#666' }}>{i.contactName||'-'}</td>
                    <td>{i.itemsCount}</td>
                    <td>{i.total?`€${i.total.toFixed(2)}`:'-'}</td>
                    <td style={{ fontWeight: 700 }}>{i.status}</td>
                    <td>{i.notes ? i.notes.slice(0, 30) + (i.notes.length > 30 ? '…' : '') : '-'}</td>
                    <td style={{ color: '#666' }}>{i.createdAt?new Date(i.createdAt).toLocaleDateString('pt-PT'):'-'}</td>
                    <td style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                      <button className="btn-secondary" disabled={updatingId===i.id} onClick={() => updateQuote(i.id, 'approved')}>Aprovar</button>
                      <button className="btn-secondary" disabled={updatingId===i.id} onClick={() => updateQuote(i.id, 'rejected')}>Rejeitar</button>
                      <button className="btn-secondary" disabled={updatingId===i.id} onClick={() => updateQuote(i.id, 'review')}>Revisar</button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={9} style={{ background: '#f7f7f7', padding: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Notas internas</label>
                      <textarea
                        value={notesByQuote[i.id] || ''}
                        onChange={(event) => handleNoteChange(i.id, event.target.value)}
                        placeholder="Adicione um comentário ou instrução para esta cotação"
                        style={{ width: '100%', minHeight: 76, borderRadius: 8, border: '1px solid var(--border)', padding: 10, fontSize: '0.95rem' }}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </AppLayout>
  );
}
