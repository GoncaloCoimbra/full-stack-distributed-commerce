export interface CheckoutRuleContext {
  user: any;
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  paymentMethod: string;
  items: Array<{ quantity: number; price: number; name: string }>;
}

export interface RuleDecision {
  allowed: boolean;
  reason?: string;
  note?: string;
}

export function evaluateCheckoutRules(context: CheckoutRuleContext): RuleDecision {
  const { user, totals, paymentMethod, items } = context;

  if (user?.isB2B && totals.total < 100) {
    return {
      allowed: false,
      reason: 'Pedidos B2B devem atingir um mínimo de 100€ para atender a regras de crédito corporativo.',
    };
  }

  if (paymentMethod === 'credit' && user?.creditLimit !== undefined) {
    if (totals.total > user.creditLimit) {
      return {
        allowed: false,
        reason: 'Limite de crédito excedido para este cliente corporativo.',
      };
    }
  }

  if (paymentMethod === 'card' && totals.total > 10000) {
    return {
      allowed: false,
      reason: 'Pedidos superiores a 10.000€ exigem aprovação manual antes do processamento.',
    };
  }

  if (items.some((item) => item.quantity > 50)) {
    return {
      allowed: true,
      note: 'Este pedido contém grandes quantidades e será tratado pelo motor de regras de vendas em volume.',
    };
  }

  return {
    allowed: true,
  };
}
