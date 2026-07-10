export type PaymentMethod = 'card' | 'paypal' | 'mbway' | 'multibanco';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'requires_action' | 'unknown';
export type PaymentStatusTone = 'success' | 'warning' | 'danger' | 'info';

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

export interface PaymentStatusConfig {
  label: string;
  tone: PaymentStatusTone;
  description: string;
}

export const initialForm: CheckoutForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'Portugal',
  paymentMethod: 'card',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardName: '',
  acceptTerms: false,
  acceptMarketing: false,
};

const CHECKOUT_DRAFT_KEY = 'Tranzor-checkout-draft';

export const readCheckoutDraft = (): CheckoutForm => {
  if (typeof window === 'undefined') {
    return initialForm;
  }

  try {
    const saved = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);

    if (!saved) {
      return initialForm;
    }

    const parsed = JSON.parse(saved) as Partial<CheckoutForm>;

    return {
      ...initialForm,
      ...parsed,
      paymentMethod: parsed.paymentMethod === 'card' || parsed.paymentMethod === 'paypal' || parsed.paymentMethod === 'mbway' || parsed.paymentMethod === 'multibanco'
        ? parsed.paymentMethod
        : 'card',
    };
  } catch {
    return initialForm;
  }
};

export const persistCheckoutDraft = (form: CheckoutForm) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(form));
};

export const clearCheckoutDraft = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
};

export const getShippingEstimate = (subtotal: number) => {
  if (subtotal >= 50) {
    return 0;
  }

  if (subtotal >= 25) {
    return 3.99;
  }

  return 5.99;
};

export const getDeliveryWindow = (shipping: number) => {
  if (shipping === 0) {
    return 'Entrega em 2–5 dias úteis';
  }

  return 'Entrega em 2–5 dias úteis';
};

export const normalizePaymentMethod = (paymentMethod?: string | null): PaymentMethod => {
  switch (paymentMethod) {
    case 'paypal':
    case 'mbway':
    case 'multibanco':
      return paymentMethod;
    case 'card':
    default:
      return 'card';
  }
};

export const normalizePaymentStatus = (status?: string | null): PaymentStatus => {
  switch (status) {
    case 'paid':
      return 'paid';
    case 'failed':
      return 'failed';
    case 'requires_action':
      return 'requires_action';
    case 'pending':
      return 'pending';
    case 'unknown':
      return 'unknown';
    default:
      return 'pending';
  }
};

export const getPaymentStatusConfig = (status: PaymentStatus): PaymentStatusConfig => {
  switch (status) {
    case 'paid':
      return {
        label: 'Confirmado',
        tone: 'success',
        description: 'A sua encomenda foi confirmada com sucesso.',
      };
    case 'failed':
      return {
        label: 'Falhou',
        tone: 'danger',
        description: 'O pagamento não foi concluído. Revise os dados e tente novamente.',
      };
    case 'requires_action':
      return {
        label: 'Ação necessária',
        tone: 'info',
        description: 'A confirmação do pagamento requer uma ação adicional no navegador.',
      };
    case 'unknown':
      return {
        label: 'Desconhecido',
        tone: 'warning',
        description: 'O estado do pagamento ainda não foi confirmado pelo sistema.',
      };
    case 'pending':
    default:
      return {
        label: 'Pendente',
        tone: 'warning',
        description: 'A sua encomenda foi registada e a confirmação do pagamento ainda está pendente.',
      };
  }
};

export const getPaymentMethodOptions = (stripeConfigured: boolean) => {
  return [
    {
      id: 'card' as const,
      label: 'Cartão de Crédito/Débito',
      description: 'Visa, Mastercard e American Express',
      badge: stripeConfigured ? 'Disponível' : 'Disponível com Stripe',
      note: stripeConfigured
        ? 'Pagamento protegido por Stripe'
        : 'Ative a chave pública do Stripe para usar este método.',
      available: stripeConfigured,
    },
    {
      id: 'paypal' as const,
      label: 'PayPal',
      description: 'Pagamento seguro via PayPal',
      badge: 'Disponível',
      note: 'A confirmação do pagamento fica pendente até a confirmação do PayPal.',
      available: true,
    },
    {
      id: 'mbway' as const,
      label: 'MB WAY',
      description: 'Pagamento móvel rápido e seguro',
      badge: 'Disponível',
      note: 'Confirme o pagamento no seu telemóvel.',
      available: true,
    },
    {
      id: 'multibanco' as const,
      label: 'Multibanco',
      description: 'Referência de pagamento',
      badge: 'Disponível',
      note: 'Pague no seu banco a partir da referência gerada.',
      available: true,
    },
  ];
};

export const getPaymentMethodLabel = (paymentMethod: PaymentMethod | string | undefined) => {
  switch (normalizePaymentMethod(paymentMethod)) {
    case 'card':
      return 'Cartão de Crédito/Débito';
    case 'paypal':
      return 'PayPal';
    case 'mbway':
      return 'MB WAY';
    case 'multibanco':
      return 'Multibanco';
    default:
      return 'Pagamento';
  }
};
