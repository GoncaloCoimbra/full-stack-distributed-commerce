import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function ReturnRequestPage() {
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('produto-danificado');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <AppLayout title="Solicitar devolução" description="Envie um pedido de devolução para encomendas Tranzor." canonical="/account/returns/request">
      <section className="page-hero">
        <h1>Pedido de devolução</h1>
        <p className="page-copy">
          Abra um pedido de devolução para artigos que não correspondem ou que chegam danificados.
        </p>
      </section>

      <section className="container" style={{ marginBottom: '2rem' }}>
        <div className="alert alert-warning">
          <span className="alert-icon">⚠️</span>
          <div>
            Tem 14 dias a partir da receção para solicitar uma devolução, de acordo com a nossa política de trocas e devoluções.
          </div>
        </div>
      </section>

      <section className="container page-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="orderId">Número de encomenda</label>
            <input
              id="orderId"
              type="text"
              className="form-input"
              placeholder="Ex: ORD-3421"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reason">Motivo da devolução</label>
            <select
              id="reason"
              className="form-select"
              value={reason}
              onChange={e => setReason(e.target.value)}
            >
              <option value="produto-danificado">Produto danificado</option>
              <option value="item-incorreto">Item incorreto</option>
              <option value="nao-gostei">Não gostei do produto</option>
              <option value="outra-razao">Outra razão</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">Observações</label>
            <textarea
              id="notes"
              className="form-input"
              rows={5}
              placeholder="Conte-nos o que aconteceu e como podemos ajudar..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">Enviar pedido</button>
        </form>

        {submitted && (
          <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
            <span className="alert-icon">✓</span>
            <div>Pedido de devolução submetido com sucesso. A nossa equipa entrará em contacto em até 24 horas.</div>
          </div>
        )}
      </section>
    </AppLayout>
  );
}
