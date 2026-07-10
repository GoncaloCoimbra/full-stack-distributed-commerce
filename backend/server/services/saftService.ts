import crypto from 'crypto';
import Order from '../models/Order';
import { env } from '../config/env';

export type SaftExportOptions = {
  from?: string;
  to?: string;
};

export function createInvoiceHash(order: any) {
  const payload = JSON.stringify({
    id: order._id,
    orderNumber: order.orderNumber,
    total: order.total,
    createdAt: order.createdAt,
    userId: order.user?._id || order.user,
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

export function buildSaftXml(orders: any[]) {
  const records = orders.map((order) => {
    const hash = createInvoiceHash(order);
    return `
      <Invoice>
        <InvoiceNo>${order.orderNumber}</InvoiceNo>
        <InvoiceDate>${order.createdAt.toISOString()}</InvoiceDate>
        <CustomerTaxID>${order.user?.taxId || 'N/A'}</CustomerTaxID>
        <CustomerName>${order.user?.company || order.user?.email || 'Anonymous'}</CustomerName>
        <DocumentTotals>
          <TaxPayable>${order.tax.toFixed(2)}</TaxPayable>
          <NetTotal>${order.subtotal.toFixed(2)}</NetTotal>
          <GrossTotal>${order.total.toFixed(2)}</GrossTotal>
        </DocumentTotals>
        <InvoiceHash>${hash}</InvoiceHash>
        <LineItems>
          ${order.items.map((item: any) => `
            <Line>
              <ProductCode>${item.sku || item.product}</ProductCode>
              <ProductDescription>${item.name}</ProductDescription>
              <Quantity>${item.quantity}</Quantity>
              <UnitPrice>${item.price.toFixed(2)}</UnitPrice>
              <CreditAmount>${(item.total || item.quantity * item.price).toFixed(2)}</CreditAmount>
            </Line>
          `).join('')}
        </LineItems>
      </Invoice>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<AuditFile>
  <Header>
    <AuditFileVersion>1.0</AuditFileVersion>
    <CompanyID>Tranzor</CompanyID>
    <FiscalYear>${new Date().getUTCFullYear()}</FiscalYear>
    <CreationDate>${new Date().toISOString()}</CreationDate>
  </Header>
  <MasterFiles />
  <SourceDocuments>
    <SalesInvoices>
      ${records.join('')}
    </SalesInvoices>
  </SourceDocuments>
</AuditFile>`;
}

export function signSaftXml(xml: string) {
  if (!env.SAFT_PRIVATE_KEY) {
    throw new Error('SAFT signing key is not configured');
  }

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(xml, 'utf8');
  signer.end();
  return signer.sign(env.SAFT_PRIVATE_KEY, 'base64');
}

export async function generateSaftExport(options: SaftExportOptions = {}) {
  const query: any = {};
  if (options.from) query.createdAt = { $gte: new Date(options.from) };
  if (options.to) query.createdAt = query.createdAt
    ? { ...query.createdAt, $lte: new Date(options.to) }
    : { $lte: new Date(options.to) };

  const orders = await Order.find(query)
    .populate('user', 'email company taxId')
    .lean();

  const xml = buildSaftXml(orders);
  const signature = env.SAFT_PRIVATE_KEY ? signSaftXml(xml) : undefined;

  return {
    xml,
    signature,
  };
}
