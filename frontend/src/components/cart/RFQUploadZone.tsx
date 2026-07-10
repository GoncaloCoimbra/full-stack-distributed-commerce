import React, { useRef, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function RFQUploadZone() {
  const uploadRfq = useCartStore((state) => state.uploadRfq);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState('Arraste um CSV ou Excel para importar produtos rapidamente.');
  const [result, setResult] = useState<{ mappedItems: { name: string; sku: string; quantity: number; productId: string }[]; missingItems: { product: string; quantity: number }[] } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (file?: File | null) => {
    if (!file) return;

    setIsUploading(true);
    setStatus(`Processando ${file.name}...`);
    setResult(null);

    try {
      const response = await uploadRfq(file);
      setResult({ mappedItems: response.mappedItems, missingItems: response.missingItems });
      setStatus(response.message);
    } catch (error: any) {
      setStatus(error?.message || 'Não foi possível importar este RFQ.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const [file] = event.dataTransfer.files;
    handleUpload(file);
  };

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(event.target.files?.[0]);
  };

  return (
    <section
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      style={{
        border: isDragging ? '1px dashed rgba(217,4,41,0.8)' : '1px solid var(--border)',
        borderRadius: 18,
        padding: '1.25rem',
        background: 'linear-gradient(180deg, rgba(217,4,41,0.08), rgba(20,20,20,0.55))',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
      }}
    >
      <div>
        <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)' }}>Importar RFQ</p>
        <p style={{ margin: '0.3rem 0 0', color: 'var(--muted-light)', fontSize: 14, lineHeight: 1.6 }}>
          Envie um CSV ou Excel com colunas como <strong>Produto</strong> e <strong>Quantidade</strong> para popular o carrinho com matching fuzzy.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          style={{
            border: 'none',
            borderRadius: 999,
            padding: '12px 16px',
            background: 'var(--red)',
            color: 'white',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          {isUploading ? 'Importando…' : 'Selecionar arquivo'}
        </button>
        <span style={{ color: 'var(--muted-light)', fontSize: 13 }}>{status}</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={onSelectFile}
        style={{ display: 'none' }}
      />

      {result && (
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ background: 'rgba(10,10,10,0.8)', borderRadius: 14, padding: 12 }}>
            <p style={{ margin: '0 0 6px', fontWeight: 800 }}>Itens importados</p>
            {result.mappedItems.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--muted-light)' }}>Nenhum produto foi reconhecido no arquivo.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted-light)' }}>
                {result.mappedItems.map((item) => (
                  <li key={`${item.productId}-${item.sku}`}>
                    {item.name} — {item.quantity}x ({item.sku})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {result.missingItems.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 12 }}>
              <p style={{ margin: '0 0 6px', fontWeight: 800 }}>Itens não encontrados</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted-light)' }}>
                {result.missingItems.map((item, index) => (
                  <li key={`${item.product}-${index}`}>{item.product} — {item.quantity}x</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
