import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function SitemapPage() {
	return (
		<AppLayout
			title="Mapa do Site"
			description="Encontre rapidamente todas as páginas principais da Tranzor." 
			canonical="/sitemap"
		>
			<section className="page-hero">
				<p className="section-label">Navegação</p>
				<h1>Todas as páginas centrais num só local.</h1>
				<p className="page-copy">
					Aceda às seções chave do website Tranzor para encontrar informação rápida sobre serviços, contacto e política de privacidade.
				</p>
			</section>

			<section className="container page-panel page-sitemap" style={{ marginBottom: '4rem' }}>
				<a href="/">Home</a>
				<a href="/about">Sobre</a>
				<a href="/shop">Loja</a>
				<a href="/b2b">B2B</a>
				<a href="/contact">Contacto</a>
				<a href="/faq">FAQ</a>
				<a href="/blog">Blog</a>
				<a href="/pricing">Preços</a>
				<a href="/privacy">Privacidade</a>
				<a href="/terms">Termos</a>
				<a href="/shipping">Envio</a>
				<a href="/landing">Landing</a>
				<a href="/sitemap">Mapa do Site</a>
			</section>
		</AppLayout>
	);
}
