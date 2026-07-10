export function mapProductToErp(product: Record<string, unknown>) {
  return {
    id: String(product.sku || product.id || ''),
    sku: String(product.sku || ''),
    name: String(product.name || ''),
    price: Number(product.price || 0),
    stock: Number(product.stockQuantity ?? product.stock ?? 0),
    updatedAt: new Date().toISOString(),
  };
}

export function mapOrderToErp(order: Record<string, unknown>) {
  return {
    orderId: String(order.orderNumber || order.id || ''),
    total: Number(order.total || 0),
    currency: String(order.currency || 'EUR'),
    status: String(order.status || 'unknown'),
    paymentStatus: String(order.paymentStatus || 'unknown'),
  };
}
