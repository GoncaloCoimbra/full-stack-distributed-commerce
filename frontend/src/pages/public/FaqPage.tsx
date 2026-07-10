import React from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';

export default function FaqPage() {
	const { t } = useTranslation();
	return (
		<AppLayout
			title={t('faq.pageTitle')}
			description={t('faq.pageDescription')}
			canonical="/faq"
		>
			<section className="page-hero">
				<p className="section-label">{t('faq.eyebrow')}</p>
				<h1>{t('faq.heroTitle')}</h1>
				<p className="page-copy">
					{t('faq.heroBody')}
				</p>
			</section>

			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<dl className="page-list">
					<dt>{t('faq.q1Question')}</dt>
					<dd>{t('faq.q1Answer')}</dd>
					<dt>{t('faq.q2Question')}</dt>
					<dd>{t('faq.q2Answer')}</dd>
					<dt>{t('faq.q3Question')}</dt>
					<dd>{t('faq.q3Answer')}</dd>
					<dt>{t('faq.q4Question')}</dt>
					<dd>{t('faq.q4Answer')}</dd>
					<dt>{t('faq.q5Question')}</dt>
					<dd>{t('faq.q5Answer')}</dd>
				</dl>
			</section>

			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<h2 className="page-heading">{t('faq.supportTitle')}</h2>
				<p className="page-copy">{t('faq.supportBody')}</p>
			</section>
		</AppLayout>
	);
}
