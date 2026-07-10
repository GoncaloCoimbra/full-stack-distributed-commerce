import React from 'react';

export default function LoadingFallback() {
	return (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			minHeight: '30vh',
			color: 'var(--text)',
			fontSize: 16,
			flexDirection: 'column',
			gap: '1rem',
		}}>
			<div style={{
				width: '40px',
				height: '40px',
				border: '3px solid var(--border)',
				borderTop: '3px solid var(--red)',
				borderRadius: '50%',
				animation: 'spin 0.8s linear infinite',
			}} />
			<p>A carregar...</p>
			<style>{`
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
}
