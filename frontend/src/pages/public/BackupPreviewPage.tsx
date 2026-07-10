import { Link } from 'react-router-dom';

export default function BackupPreviewPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Backup de Visualização Sem Login</h1>
      <p>
        Esta página mostra um conjunto de rotas protegidas que podem ser carregadas sem iniciar sessão.
        Use os links abaixo para aceder diretamente aos componentes de conta, B2B e admin.
      </p>

      <section style={{ marginTop: '2rem' }}>
        <h2>Contas</h2>
        <ul>
          <li><Link to="/backup/account/profile">Perfil</Link></li>
          <li><Link to="/backup/account/orders">Encomendas</Link></li>
          <li><Link to="/backup/account/invoices">Faturas</Link></li>
          <li><Link to="/backup/account/billing">Faturação</Link></li>
          <li><Link to="/backup/account/notifications">Notificações</Link></li>
          <li><Link to="/backup/account/loyalty">Pontos de lealdade</Link></li>
          <li><Link to="/backup/account/returns/request">Pedido de devolução</Link></li>
          <li><Link to="/backup/account/returns/status">Estado de devolução</Link></li>
          <li><Link to="/backup/account/reviews">Avaliações</Link></li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>B2B</h2>
        <ul>
          <li><Link to="/backup/b2b/dashboard">Dashboard B2B</Link></li>
          <li><Link to="/backup/b2b/quotes">Orçamentos B2B</Link></li>
          <li><Link to="/backup/b2b/quote/preview-id">Detalhe do Orçamento (ID fictício)</Link></li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Admin</h2>
        <ul>
          <li><Link to="/backup/admin">Admin Overview</Link></li>
          <li><Link to="/backup/admin/audit">Audit</Link></li>
          <li><Link to="/backup/admin/b2b">B2B Requests</Link></li>
          <li><Link to="/backup/admin/customers">Customers</Link></li>
          <li><Link to="/backup/admin/coupons">Coupons</Link></li>
          <li><Link to="/backup/admin/newsletter">Newsletter</Link></li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Checkout</h2>
        <ul>
          <li><Link to="/backup/checkout">Checkout</Link></li>
          <li><Link to="/backup/checkout/success">Checkout Success</Link></li>
        </ul>
      </section>

      <p style={{ marginTop: '2rem', color: '#555' }}>
        Nota: algumas funcionalidades podem não estar totalmente disponíveis porque não há sessão verdadeira.
      </p>
    </main>
  );
}
