import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function TermsPage() {
	return (
		<AppLayout
			title="Termos e Condições"
			description="Termos de uso do site e da Tranzor, com regras claras sobre direitos, responsabilidades e propriedade." 
			canonical="/terms"
		>
			<section className="page-hero">
				<p className="section-label">Condições de uso</p>
				<h1>Transparência e clareza nos termos do site Tranzor.</h1>
				<p className="page-copy">
					Consulte os princípios que regem a utilização dos nossos serviços, conteúdos e relações de responsabilidade.
				</p>
			</section>

			<section className="container page-grid page-grid-2" style={{ marginBottom: '4rem' }}>
				<div className="page-card">
					<h2 className="page-heading">Uso do site</h2>
					<p className="page-copy">O acesso ao site implica aceitação destes termos e o compromisso de utilizar a plataforma de forma correta e responsável.</p>
				</div>
				<div className="page-card">
					<h2 className="page-heading">Propriedade intelectual</h2>
					<p className="page-copy">Todo o conteúdo deste site é propriedade da Tranzor, incluindo textos, imagens e informações de produto.</p>
				</div>
			</section>

			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<h2 className="page-heading">Direitos e responsabilidades</h2>
				<p className="page-copy">A utilização do site deve respeitar a legislação aplicável e não pode comprometer a integridade da plataforma nem a confiança dos nossos clientes.</p>
			</section>
		</AppLayout>
	);
}
