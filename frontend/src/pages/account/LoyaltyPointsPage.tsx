import React, { useEffect, useMemo, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { apiClient } from '@/services/apiClient';
import { useAuthStore } from '@/store/authStore';
import { buildLoyaltyActivity, type LoyaltyActivityItem } from './loyaltyActivity';

const rewardTiers = [
  { level: 'Silver', points: 500, benefit: '10% de desconto em pedidos escolares' },
  { level: 'Gold', points: 1_200, benefit: 'Envio gratuito acima de 39€' },
  { level: 'Platinum', points: 2_500, benefit: 'Acesso antecipado a promoções' },
];

function getCurrentTier(points: number) {
  if (points >= rewardTiers[2].points) {
    return rewardTiers[2];
  }

  if (points >= rewardTiers[1].points) {
    return rewardTiers[1];
  }

  if (points >= rewardTiers[0].points) {
    return rewardTiers[0];
  }

  return null;
}

function getNextTier(points: number) {
  if (points >= rewardTiers[2].points) {
    return null;
  }

  return rewardTiers.find((tier) => points < tier.points) ?? null;
}

function getProgress(points: number) {
  const nextTier = getNextTier(points);

  if (!nextTier) {
    return 100;
  }

  const previousTier = rewardTiers.find((tier) => tier.points < nextTier.points) ?? rewardTiers[0];
  const range = nextTier.points - previousTier.points;
  const currentProgress = points - previousTier.points;

  return Math.max(0, Math.min(100, Math.round((currentProgress / Math.max(range, 1)) * 100)));
}

export default function LoyaltyPointsPage() {
  const user = useAuthStore((state) => state.user);
  const [points, setPoints] = useState<number>(user?.loyaltyPoints ?? 0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activity, setActivity] = useState<LoyaltyActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadLoyaltyData = async () => {
      setLoading(true);
      setError('');
      setActivityLoading(true);
      setActivityError('');

      const [profileResult, ordersResult] = await Promise.allSettled([
        apiClient.get<{ user: { loyaltyPoints?: number } }>('/account/profile'),
        apiClient.get<{ orders: Array<Record<string, unknown>> }>('/account/orders?page=1&limit=10'),
      ]);

      if (!mounted) {
        return;
      }

      if (profileResult.status === 'fulfilled') {
        const profileResponse = profileResult.value;

        if (profileResponse.success && profileResponse.data?.user) {
          const profilePoints = Number(profileResponse.data.user.loyaltyPoints ?? 0);
          setPoints(profilePoints || user?.loyaltyPoints || 0);
        } else if (user?.loyaltyPoints !== undefined) {
          setPoints(user.loyaltyPoints);
        }
      } else {
        setError(profileResult.reason?.message || 'Não foi possível carregar os seus pontos de fidelidade.');

        if (user?.loyaltyPoints !== undefined) {
          setPoints(user.loyaltyPoints);
        }
      }

      if (ordersResult.status === 'fulfilled') {
        const ordersResponse = ordersResult.value;

        if (ordersResponse.success && Array.isArray(ordersResponse.data?.orders)) {
          setActivity(buildLoyaltyActivity(ordersResponse.data.orders as Parameters<typeof buildLoyaltyActivity>[0]));
        } else {
          setActivity([]);
        }
      } else {
        setActivity([]);
        setActivityError('Não foi possível carregar o histórico de atividade.');
      }

      if (mounted) {
        setLoading(false);
        setActivityLoading(false);
      }
    };

    void loadLoyaltyData();

    return () => {
      mounted = false;
    };
  }, [user?.loyaltyPoints]);

  const currentTier = useMemo(() => getCurrentTier(points), [points]);
  const nextTier = useMemo(() => getNextTier(points), [points]);
  const progress = useMemo(() => getProgress(points), [points]);

  const getDescription = () => {
    if (currentTier) {
      return `Você já alcançou o nível ${currentTier.level} e está a caminho de mais benefícios.`;
    }

    return 'Comece a comprar e a interagir com a plataforma para desbloquear o primeiro nível.';
  };

  return (
    <AppLayout title="Programa de Fidelização" description="Veja os seus pontos, benefícios e atividades do programa de fidelidade Tranzor." canonical="/account/loyalty">
      <section className="page-hero">
        <h1>Pontos de fidelidade</h1>
        <p className="page-copy">
          Acumule e resgate pontos em compras Tranzor. Quanto mais utilizar o site, mais benefícios exclusivos desbloqueia.
        </p>
      </section>

      <section className="container page-grid page-grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="page-card">
          <h2 className="page-heading">Saldo atual</h2>
          {loading ? (
            <p className="page-copy">A carregar os seus pontos...</p>
          ) : error ? (
            <p className="page-copy" style={{ color: 'var(--red)' }}>{error}</p>
          ) : (
            <>
              <p className="kpi-value">{points.toLocaleString('pt-PT')} pts</p>
              <p className="page-copy">{getDescription()}</p>
            </>
          )}
        </div>

        <div className="page-card">
          <h2 className="page-heading">Próximo nível</h2>
          {loading ? (
            <p className="page-copy">A calcular o seu progresso...</p>
          ) : error ? (
            <p className="page-copy" style={{ color: 'var(--red)' }}>{error}</p>
          ) : (
            <>
              <p className="kpi-label">
                {nextTier ? `${nextTier.level} em ${Math.max(nextTier.points - points, 0)} pontos` : 'Você já alcançou o nível máximo'}
              </p>
              <div style={{ marginTop: '1rem', height: '12px', background: 'var(--border)', borderRadius: '999px' }}>
                <div
                  style={{ width: `${progress}%`, height: '100%', borderRadius: '999px', background: 'var(--red)' }}
                />
              </div>
              <p className="page-copy" style={{ marginTop: '0.75rem' }}>
                {progress}% do próximo nível concluído.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="container page-card" style={{ marginBottom: '2rem' }}>
        <h2 className="page-heading">Níveis de fidelidade</h2>
        <div className="page-grid" style={{ gap: '1rem' }}>
          {rewardTiers.map((tier) => (
            <div className="page-panel" key={tier.level}>
              <strong>{tier.level}</strong>
              <p className="page-copy" style={{ margin: '0.75rem 0' }}>{tier.benefit}</p>
              <div className="kpi-label">Requer {tier.points} pontos</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container page-panel">
        <h2 className="page-heading">Histórico de atividade</h2>
        {activityLoading ? (
          <p className="page-copy">A carregar o histórico de atividades...</p>
        ) : activityError ? (
          <p className="page-copy" style={{ color: 'var(--red)' }}>{activityError}</p>
        ) : activity.length === 0 ? (
          <p className="page-copy">Ainda não há atividade registada no seu histórico.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Pontos</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.description}</td>
                    <td>{item.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppLayout>
  );
}
