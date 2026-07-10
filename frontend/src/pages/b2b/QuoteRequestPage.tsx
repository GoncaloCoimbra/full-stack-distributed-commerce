import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { apiClient } from '@/services/apiClient';

const benefits = [
{ icon: '👔', title: 'Acesso B2B', desc: 'Preços especiais para empresas e distribuidoras' },
{ icon: '📋', title: 'Orçamentos Personalizados', desc: 'Solicite cotções customizadas para sua empresa' },
{ icon: '🤝', title: 'Suporte Dedicado', desc: 'Gestor de conta para atender suas necessidades' },
{ icon: '🚚', title: 'Logística Flexível', desc: 'Opções de entrega customizadas' }
];

const fields = [
{ key: 'companyName', label: 'Nome da Empresa *', type: 'text', placeholder: 'Empresa', required: true },
{ key: 'contactName', label: 'Nome de Contato *', type: 'text', placeholder: 'Seu nome', required: true },
{ key: 'email', label: 'Email *', type: 'email', placeholder: 'contato@empresa.com', required: true },
{ key: 'phone', label: 'Telefone', type: 'tel', placeholder: '+351 999 999 999', required: false }
] as const;

export default function QuoteRequestPage() {
const [formData, setFormData] = useState({
companyName: '',
contactName: '',
email: '',
phone: '',
category: 'papelaria',
quantity: '',
description: ''
});
const [saving, setSaving] = useState(false);
const [success, setSuccess] = useState('');
const [error, setError] = useState('');

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
const { name, value } = e.target;
setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
setSaving(true);
setError('');
setSuccess('');

try {
const res = await apiClient.post('/b2b/quotes', {
companyName: formData.companyName,
contactName: formData.contactName,
email: formData.email,
phone: formData.phone,
category: formData.category,
quantity: Number(formData.quantity),
description: formData.description,
priority: 'medium'
});

if (!res.success) {
throw new Error(res.error?.message || 'Não foi possível enviar o pedido.');
}

setSuccess('Orçamento solicitado com sucesso! Entraremos em contato em breve.');
setFormData({
companyName: '',
contactName: '',
email: '',
phone: '',
category: 'papelaria',
quantity: '',
description: ''
});
} catch (err: any) {
setError(err?.message || 'Erro ao solicitar o orçamento.');
} finally {
setSaving(false);
}
};

return (
<AppLayout
title="Solicitar Orçamento B2B"
description="Solicite um orçamento personalizado para sua empresa. Acesso a preços especiais e condições B2B."
canonical="/b2b/quote-request"
>
<section className="page-hero" style={{ borderRadius: '24px', marginBottom: '2rem' }}>
<p className="section-label">Solicite seu plano</p>
<h1>Solicitar Orçamento</h1>
<p className="page-copy" style={{ maxWidth: 760 }}>
Deixe os detalhes da sua empresa e do volume que procura. O time B2B responde com uma proposta rápida e personalizada.
</p>
<div className="page-grid page-grid-3" style={{ marginTop: '1.5rem' }}>
{[
{ label: 'Resposta média', value: '24h' },
{ label: 'Canais de contato', value: 'Email + telefone' },
{ label: 'Projetos B2B', value: '150+' }
].map((item) => (
<article key={item.label} className="page-card" style={{ padding: '1rem 1.25rem' }}>
<p className="section-label" style={{ marginBottom: '0.6rem' }}>{item.label}</p>
<div className="kpi-value">{item.value}</div>
</article>
))}
</div>
</section>

<section className="container">
{success && <div className="alert alert-success" style={{ marginBottom: 24 }}>{success}</div>}
{error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

<div className="page-grid page-grid-4" style={{ marginBottom: '2rem' }}>
{benefits.map((benefit, idx) => (
<div key={idx} className="page-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
<div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{benefit.icon}</div>
<h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{benefit.title}</h3>
<p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>{benefit.desc}</p>
</div>
))}
</div>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
<div className="page-panel">
<h2 style={{ marginTop: 0 }}>Seus Dados</h2>
<p className="page-copy" style={{ marginBottom: '1.5rem' }}>
Preencha os dados da sua empresa para receber uma proposta ajustada ao seu perfil.
</p>
<form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
{fields.map((field) => (
<div key={field.key}>
<label className="form-label">{field.label}</label>
<input
type={field.type}
name={field.key}
required={field.required}
value={formData[field.key]}
onChange={handleChange}
placeholder={field.placeholder}
className="form-input"
/>
</div>
))}
</form>
</div>

<div className="page-panel">
<h2 style={{ marginTop: 0 }}>Detalhes do Orçamento</h2>
<p className="page-copy" style={{ marginBottom: '1.5rem' }}>
Defina a categoria, o volume estimado e o contexto do pedido para gerar uma resposta mais assertiva.
</p>
<form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
<div>
<label className="form-label">Categoria de Produto *</label>
<select name="category" value={formData.category} onChange={handleChange} className="form-input">
<option value="papelaria">Papelaria</option>
<option value="escolares">Escolares</option>
<option value="artes">Artes</option>
<option value="tecnologia">Tecnologia</option>
</select>
</div>
<div>
<label className="form-label">Quantidade Estimada *</label>
<input
type="number"
name="quantity"
required
value={formData.quantity}
onChange={handleChange}
min="100"
placeholder="Mínimo 100 unidades"
className="form-input"
/>
</div>
<div>
<label className="form-label">Descrição Adicional</label>
<textarea
name="description"
value={formData.description}
onChange={handleChange}
rows={5}
placeholder="Conte-nos mais sobre suas necessidades..."
className="form-input"
/>
</div>
<button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
{saving ? 'Enviando...' : 'Solicitar Orçamento'}
</button>
</form>
</div>
</div>
</section>
</AppLayout>
);
}
