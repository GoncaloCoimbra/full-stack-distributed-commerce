import React from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';

export default function AboutPage() {
	const { t } = useTranslation();
	return (
		<AppLayout
			title={t('about.pageTitle')}
			description={t('about.pageDescription')}
			canonical="/about"
		>
			<section className="page-hero">
				<p className="section-label">{t('about.eyebrow')}</p>
				<h1>{t('about.heroTitle')}</h1>
				<p className="page-copy">
					{t('about.heroBody')}
				</p>
			</section>

			<section className="container page-grid page-grid-3" style={{ marginBottom: '4rem' }}>
				<article className="page-card">
					<h2 className="page-heading">{t('about.missionTitle')}</h2>
					<p className="page-copy">
						{t('about.missionBody')}
					</p>
				</article>
				<article className="page-card">
					<h2 className="page-heading">{t('about.futureTitle')}</h2>
					<p className="page-copy">
						{t('about.futureBody')}
					</p>
				</article>
				<article className="page-card">
					<h2 className="page-heading">{t('about.valuesTitle')}</h2>
					<p className="page-copy">
						{t('about.valuesBody')}
					</p>
				</article>
			</section>

			<section className="container page-grid page-grid-3" style={{ marginBottom: '4rem' }}>
				<div className="page-card">
					<h3 className="page-heading">{t('about.experienceTitle')}</h3>
					<p className="page-copy">{t('about.experienceBody')}</p>
				</div>
				<div className="page-card">
					<h3 className="page-heading">{t('about.partnersTitle')}</h3>
					<p className="page-copy">{t('about.partnersBody')}</p>
				</div>
				<div className="page-card">
					<h3 className="page-heading">{t('about.innovationTitle')}</h3>
					<p className="page-copy">{t('about.innovationBody')}</p>
				</div>
			</section>

			<section className="container page-panel" style={{ marginBottom: '4rem' }}>
				<h2 className="page-heading">{t('about.commitmentTitle')}</h2>
				<p className="page-copy">
					{t('about.commitmentBody')}
				</p>
			</section>
		</AppLayout>
	);
}
