export interface LoyaltyActivityItem {
  id: string;
  date: string;
  description: string;
  points: string;
}

export interface LoyaltyOrder {
  _id?: string;
  id?: string;
  orderNumber?: string;
  createdAt?: string;
  loyaltyPointsEarned?: number;
  loyaltyPointsUsed?: number;
  items?: Array<{
    product?: {
      name?: string | null;
    } | null;
    name?: string | null;
  }>;
}

function formatOrderDate(createdAt?: string) {
  if (!createdAt) {
    return 'Data indisponível';
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'Data indisponível';
  }

  return date.toLocaleDateString('pt-PT');
}

function getItemNames(items?: LoyaltyOrder['items']) {
  if (!items?.length) {
    return [];
  }

  return items
    .map((item) => item.product?.name || item.name)
    .filter((name): name is string => Boolean(name?.trim()));
}

function getDescription(order: LoyaltyOrder) {
  const itemNames = getItemNames(order.items);

  if (order.loyaltyPointsUsed && order.loyaltyPointsUsed > 0) {
    return itemNames.length > 0
      ? `Resgate de pontos em ${itemNames.join(' e ')}`
      : 'Resgate de pontos';
  }

  if (itemNames.length > 0) {
    return `Compra de ${itemNames.join(' e ')}`;
  }

  return 'Compra realizada';
}

export function buildLoyaltyActivity(orders: LoyaltyOrder[]): LoyaltyActivityItem[] {
  return [...orders]
    .sort((left, right) => {
      const leftDate = new Date(left.createdAt ?? 0).getTime();
      const rightDate = new Date(right.createdAt ?? 0).getTime();
      return rightDate - leftDate;
    })
    .map((order) => {
      const earned = Number(order.loyaltyPointsEarned ?? 0);
      const used = Number(order.loyaltyPointsUsed ?? 0);

      return {
        id: order._id ?? order.id ?? order.orderNumber ?? `order-${Math.random().toString(36).slice(2, 8)}`,
        date: formatOrderDate(order.createdAt),
        description: getDescription(order),
        points: earned > 0 ? `+${earned}` : used > 0 ? `-${used}` : '0',
      };
    });
}
