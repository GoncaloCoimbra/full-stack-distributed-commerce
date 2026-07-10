import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import AppLayout from '../../layouts/AppLayout';
import { apiClient } from '@/services/apiClient';
import { useAuthStore } from '@/store/authStore';
import { useCartStore, useCartComputed, fmt } from '../../store/cartStore';
import { trackEvent } from '../../services/analytics';
import {
  clearCheckoutDraft,
  getPaymentMethodOptions,
  normalizePaymentStatus,
  persistCheckoutDraft,
  readCheckoutDraft,
  type CheckoutForm,
} from './checkoutUtils';

const cardElementOptions = {
  style: {
    base: {
      fontSize: '1rem',
      color: '#111827',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#d90429',
    },
  },
};

interface StripeCardBridgeProps {
  onReady: (context: { stripe: Stripe | null; elements: StripeElements | null }) => void;
  onCardStateChange: (isValid: boolean) => void;
}

function StripeCardBridge({ onReady, onCardStateChange }: StripeCardBridgeProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);

  useEffect(() => {
    onReady({ stripe, elements });
  }, [elements, onReady, stripe]);

  return (
    <div className="card-form">
      <div className="form-grid">
        <div className="form-group form-group-full">
          <label htmlFor="stripe-card-element">Dados do Cartão *</label>
          <div id="stripe-card-element" style={{ padding: '0.9rem 0.75rem', border: '1px solid #e5e5e5', borderRadius: 8 }}>
            <CardElement
              options={cardElementOptions}
              onChange={(event) => {
                const isValid = Boolean(event.complete && !event.error);
                setCardError(event.error?.message || null);
                onCardStateChange(isValid);
              }}
            />
          </div>
          {cardError && (
            <p style={{ marginTop: '0.75rem', color: '#d90429', fontSize: '0.875rem' }}>{cardError}</p>
          )}
          <p style={{ marginTop: '0.75rem', color: 'var(--muted-light)', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Pagamento protegido por Stripe. Os dados do cartão nunca são armazenados no site.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { itemCount, subtotal, shipping, total } = useCartComputed();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<CheckoutForm>(readCheckoutDraft);
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isCardReady, setIsCardReady] = useState(false);
  const [stripeContext, setStripeContext] = useState<{ stripe: Stripe | null; elements: StripeElements | null }>({
    stripe: null,
    elements: null,
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const user = useAuthStore(state => state.user);

  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const stripeConfigured = Boolean(stripePublishableKey);
  const paymentOptions = useMemo(() => getPaymentMethodOptions(stripeConfigured), [stripeConfigured]);
  const stripePromise = useMemo(() => {
    if (!stripePublishableKey) {
      return null;
    }

    return loadStripe(stripePublishableKey);
  }, [stripePublishableKey]);

  useEffect(() => {
    if (itemCount === 0) {
      navigate('/cart');
    }
  }, [itemCount, navigate]);

  useEffect(() => {
    persistCheckoutDraft(form);
  }, [form]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm(prev => ({
      ...prev,
      firstName: prev.firstName || user.name?.split(' ')[0] || '',
      lastName: prev.lastName || user.name?.split(' ').slice(1).join(' ') || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.profile?.phone || '',
    }));
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setOrderError(null);
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const focusFirstInvalidField = () => {
    const invalidElement = formRef.current?.querySelector(':invalid') as HTMLElement | null;

    if (!invalidElement) {
      return;
    }

    invalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    invalidElement.focus();
  };

  const getCurrentStepValidationMessage = () => {
    if (currentStep === 1) {
      return 'Complete os campos obrigatórios de Informações Pessoais para continuar.';
    }

    if (currentStep === 2) {
      return 'Complete o endereço de entrega para continuar.';
    }

    if (currentStep === 3) {
      if (form.paymentMethod === 'card' && !stripeConfigured) {
        return 'O pagamento com cartão não está disponível neste ambiente. Contacte a administração para ativar o Stripe.';
      }

      if (form.paymentMethod === 'card') {
        return 'Preencha os dados do cartão para continuar.';
      }

      return 'Selecione um método de pagamento disponível para continuar.';
    }

    if (currentStep === 4) {
      return 'Confirme os termos antes de finalizar a compra.';
    }

    return 'Verifique os dados da etapa atual antes de continuar.';
  };

  const validateCurrentStep = () => {
    if (currentStep === 1 || currentStep === 2 || currentStep === 4) {
      return formRef.current?.checkValidity() ?? false;
    }

    if (currentStep === 3) {
      if (form.paymentMethod !== 'card') {
        return true;
      }

      if (!stripeConfigured) {
        return false;
      }

      return isCardReady;
    }

    return true;
  };

  const handleContinue = () => {
    setOrderError(null);

    if (!validateCurrentStep()) {
      setOrderError(getCurrentStepValidationMessage());
      formRef.current?.reportValidity();
      focusFirstInvalidField();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < 4) {
      handleContinue();
      return;
    }

    trackEvent('checkout_submit_attempted', { paymentMethod: form.paymentMethod });
    setLoading(true);
    setOrderError(null);

    try {
      if (!user) {
        navigate('/auth/login', { state: { from: '/checkout' } });
        return;
      }

      const shippingAddress = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        street: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
      };

      const response = await apiClient.post<{ order: any; paymentStatus?: string; clientSecret?: string }>('/orders/checkout', {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod: form.paymentMethod,
        shippingMethod: 'standard',
        notes: '',
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Erro ao criar encomenda');
      }

      let paymentStatus = normalizePaymentStatus((response as any).paymentStatus || (response as any).data?.paymentStatus);

      if (form.paymentMethod === 'card') {
        const clientSecret = (response as any).clientSecret || (response as any).data?.clientSecret;

        if (!clientSecret) {
          throw new Error('Stripe não configurado para pagamentos com cartão. Contacte a administração.');
        }

        if (!stripeContext.stripe || !stripeContext.elements) {
          throw new Error('Stripe ainda não está pronto. Recarregue a página e tente novamente.');
        }

        const cardElement = stripeContext.elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('O campo do cartão ainda não está pronto. Tente novamente.');
        }

        const confirmResult = await stripeContext.stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: form.cardName || `${form.firstName} ${form.lastName}`.trim(),
              email: form.email,
              phone: form.phone,
              address: {
                line1: form.address,
                city: form.city,
                postal_code: form.postalCode,
                country: form.country,
              },
            },
          },
          return_url: `${window.location.origin}/checkout/success`,
        });

        if (confirmResult.error) {
          throw new Error(confirmResult.error.message || 'Falha ao confirmar o pagamento com cartão.');
        }

        if (confirmResult.paymentIntent?.status === 'requires_action') {
          throw new Error('A confirmação do pagamento requer uma ação adicional no seu navegador.');
        }

        if (confirmResult.paymentIntent?.status !== 'succeeded') {
          throw new Error('O pagamento com cartão ainda não foi confirmado.');
        }

        paymentStatus = 'paid';
      }

      trackEvent('checkout_completed', {
        items: items.length,
        total,
        paymentStatus,
      });

      await clearCart();
      clearCheckoutDraft();
      navigate('/checkout/success', {
        state: {
          orderNumber: (response as any).data?.order?.orderNumber || (response as any).order?.orderNumber,
          paymentMethod: form.paymentMethod,
          paymentStatus,
          total,
          shipping,
        },
      });
    } catch (error: any) {
      console.error('Erro ao processar pedido:', error);
      setOrderError(error?.message || 'Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Informações', description: 'Dados pessoais' },
    { number: 2, title: 'Entrega', description: 'Endereço de envio' },
    { number: 3, title: 'Pagamento', description: 'Método de pagamento' },
    { number: 4, title: 'Confirmação', description: 'Revisar pedido' }
  ];

  const stepHelpText = {
    1: 'Preencha os dados básicos para identificar a encomenda com segurança.',
    2: 'Use a morada completa para evitar atrasos na entrega.',
    3: 'Escolha o método mais prático e preencha o pagamento com calma.',
    4: 'Revise o resumo e confirme os termos antes de concluir.',
  } as const;

  const nextStepLabel = currentStep < steps.length ? `Continuar para ${steps[currentStep].title}` : 'Finalizar Compra';

  useEffect(() => {
    trackEvent('checkout_started', { source: 'checkout' });
  }, []);

  useEffect(() => {
    trackEvent('checkout_step_viewed', { step: currentStep });
  }, [currentStep]);

  return (
    <AppLayout
      title="Finalizar Compra — Tranzor"
      description="Complete o checkout com segurança, entrega e pagamento protegidos para finalizar a sua encomenda."
      canonical="/checkout"
    >
      <section className="page-hero">
        <h1>Finalizar Compra</h1>
        <p className="page-copy">
          Complete os dados para concluir a sua encomenda Tranzor.
        </p>
      </section>

      <section className="container" style={{ marginBottom: '4rem' }}>
        {orderError && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', borderRadius: 12, background: 'rgba(217,4,41,0.1)', color: 'var(--red)', border: '1px solid rgba(217,4,41,0.2)' }} role="alert">
            {orderError}
          </div>
        )}
        {/* Progress Steps */}
        <p
          aria-live="polite"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          Etapa {currentStep} de {steps.length}: {steps[currentStep - 1].title}
        </p>
        <div
          className="checkout-steps"
          role="progressbar"
          aria-label="Progresso do checkout"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={currentStep}
          aria-valuetext={`Etapa ${currentStep} de ${steps.length}: ${steps[currentStep - 1].title}`}
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`checkout-step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
              aria-current={currentStep === step.number ? 'step' : undefined}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <div className="step-title">{step.title}</div>
                <div className="step-description">{step.description}</div>
              </div>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem', padding: '1rem 1.1rem', borderRadius: 14, background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.2)' }}>
          <p style={{ margin: 0, color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Checkout seguro e rápido
          </p>
          <p style={{ margin: '8px 0 0', color: 'var(--muted-light)', fontSize: 14, lineHeight: 1.6 }}>
            Proteção de dados, entrega previsível e suporte respondendo em menos de 1 hora para dúvidas relevantes.
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem', padding: '0.9rem 1rem', borderRadius: 12, background: 'rgba(15,23,42,0.03)', border: '1px solid rgba(15,23,42,0.08)' }}>
          <p style={{ margin: 0, color: 'var(--text)', fontWeight: 700, fontSize: '0.95rem' }}>
            {steps[currentStep - 1].title}
          </p>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--muted-light)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {stepHelpText[currentStep as keyof typeof stepHelpText]}
          </p>
        </div>

        <div className="checkout-content">
          <form ref={formRef} onSubmit={handleSubmit} className="checkout-form" noValidate>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="checkout-step-content">
                <h2>Informações Pessoais</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">Primeiro Nome *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Último Nome *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Telefone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {currentStep === 2 && (
              <div className="checkout-step-content">
                <h2>Endereço de Entrega</h2>
                <div className="form-grid">
                  <div className="form-group form-group-full">
                    <label htmlFor="address">Morada *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      placeholder="Rua, número, andar, etc."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">Cidade *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Código Postal *</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleInputChange}
                      placeholder="1234-567"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">País *</label>
                    <select
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Portugal">Portugal</option>
                      <option value="Espanha">Espanha</option>
                      <option value="França">França</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="checkout-step-content">
                <h2>Método de Pagamento</h2>
                <div className="payment-methods">
                  {paymentOptions.map((paymentMethod) => (
                    <label
                      key={paymentMethod.id}
                      className={`payment-method ${form.paymentMethod === paymentMethod.id ? 'active' : ''} ${!paymentMethod.available ? 'disabled' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={paymentMethod.id}
                        checked={form.paymentMethod === paymentMethod.id}
                        onChange={handleInputChange}
                        disabled={!paymentMethod.available}
                      />
                      <div className="payment-method-content">
                        <div className="payment-method-icons">
                          <div className="card-icons">
                            <div className="card-icon visa">
                              <svg viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="48" height="16" rx="2" fill="#1A1F71"/>
                                <path d="M15.5 4.5h3.2l-1.6 7h-3.2l1.6-7zM22.8 4.5c-.8 0-1.4.2-1.8.6l.3-1.6h-3.1c-.2 0-.3.1-.3.3l-1.1 5.5-.3 1.5c.6.3 1.4.4 2.3.4 1.8 0 3-.6 3.2-2.4 0-.4-.1-.8-.3-1-.2-.3-.5-.5-.9-.6-.5-.2-.9-.3-1.2-.3-.3 0-.6.1-.8.2l-.1-.6c.2-.1.5-.1.8-.1.4 0 .7.1.9.3.3.2.4.5.4.9 0 .6-.4 1-1.1 1.1-.3.1-.6.1-.8.1-.4 0-.7-.1-.9-.3l-.1.6c.3.1.7.2 1.1.2 1.1 0 2-.4 2.4-1.2.2-.4.3-.8.3-1.2-.1-1.2-.8-1.8-2.1-1.8zM28.5 4.5c-.8 0-1.4.3-1.7.8l-.1-.4h-3c-.1 0-.2.1-.2.2l-.8 4-.2.9c.4.2.9.3 1.5.3.6 0 1.1-.2 1.4-.5.3-.3.4-.7.4-1.1 0-.4-.1-.7-.4-.9-.2-.2-.6-.3-1-.3-.2 0-.4 0-.5.1l.1-.5c.1 0 .3-.1.5-.1.3 0 .5.1.7.3.1.2.2.4.2.6 0 .3-.1.5-.4.7-.2.1-.5.2-.8.2-.2 0-.4 0-.5-.1l.1.5c.2.1.5.1.8.1.8 0 1.4-.3 1.7-.8.2-.3.3-.7.3-1.1-.1-.8-.5-1.3-1.3-1.3zM32.8 4.5h-2.8c-.1 0-.2.1-.2.2l-1.3 6.3h3.1s.4-.2.5-.5l.4-2.1c.1-.5.3-1.1.6-1.5.4.5.8 1.1 1.1 1.7l.5 2.4h3.3l-2.4-6.3c-.1-.2-.2-.3-.4-.3h-2.8l.3 1.6c-.3-.1-.6-.2-1-.2-.6 0-1 .2-1.2.6l-.1.7z" fill="white"/>
                              </svg>
                            </div>
                            <div className="card-icon mastercard">
                              <svg viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="48" height="16" rx="2" fill="#000"/>
                                <circle cx="18" cy="8" r="6" fill="#EB001B"/>
                                <circle cx="30" cy="8" r="6" fill="#F79E1B"/>
                                <path d="M24 2C21.79 2 20 3.79 20 6V10C20 12.21 21.79 14 24 14C26.21 14 28 12.21 28 10V6C28 3.79 26.21 2 24 2Z" fill="#FF5F00"/>
                              </svg>
                            </div>
                            <div className="card-icon amex">
                              <svg viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="48" height="16" rx="2" fill="#006FCF"/>
                                <path d="M12 4h4l-2 8h-4l2-8zM20 4h3.5l-1.8 8H18l.6-2.5h-2.2L16 12h-3.5l1.8-8zM24 4h3.5c.8 0 1.4.2 1.8.6.4.4.6.9.6 1.5 0 .6-.2 1.1-.6 1.5-.4.4-1 .6-1.8.6H26v2.8h-2V4zm2 4.2h1.5c.4 0 .7-.1.9-.3.2-.2.3-.5.3-.8 0-.3-.1-.6-.3-.8-.2-.2-.5-.3-.9-.3H26v2.2zM32 4h2v8h-2V4z" fill="white"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="payment-method-details">
                          <div className="payment-method-title">{paymentMethod.label}</div>
                          <div className="payment-method-description">{paymentMethod.description}</div>
                          <div className="payment-method-security">{paymentMethod.badge}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {form.paymentMethod === 'card' && (
                  stripeConfigured ? (
                    <Elements stripe={stripePromise}>
                      <StripeCardBridge
                        onReady={setStripeContext}
                        onCardStateChange={setIsCardReady}
                      />
                    </Elements>
                  ) : (
                    <div className="card-form" role="alert" style={{ background: 'rgba(217,4,41,0.08)', borderRadius: 12, padding: '1rem 1.1rem' }}>
                      <p style={{ margin: 0, color: 'var(--red)', lineHeight: 1.6 }}>
                        O pagamento com cartão está indisponível neste ambiente porque a chave pública do Stripe não foi configurada.
                      </p>
                    </div>
                  )
                )}

                <p style={{ marginTop: '1rem', color: 'var(--muted-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Todos os dados de pagamento são protegidos e o checkout guarda a sua informação para facilitar futuras compras.
                </p>
              </div>
            )}

            {/* Step 4: Order Review */}
            {currentStep === 4 && (
              <div className="checkout-step-content">
                <h2>Confirmação do Pedido</h2>

                {/* Order Summary */}
                <div className="order-summary">
                  <h3>Resumo da Encomenda</h3>
                  <div className="order-items">
                    {items.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="order-item-info">
                          <span className="order-item-name">{item.name}</span>
                          <span className="order-item-quantity">Qty: {item.quantity}</span>
                        </div>
                        <span className="order-item-price">{fmt(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-totals">
                    <div className="order-total-row">
                      <span>Subtotal</span>
                      <span>{fmt(subtotal)}</span>
                    </div>
                    <div className="order-total-row">
                      <span>Portes de envio</span>
                      <span>{fmt(shipping)}</span>
                    </div>
                    <div className="order-total-row order-total-final">
                      <span>Total</span>
                      <span>{fmt(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information Summary */}
                <div className="customer-summary">
                  <h3>Informações do Cliente</h3>
                  <div className="summary-grid">
                    <div>
                      <h4>Contacto</h4>
                      <p>{form.firstName} {form.lastName}</p>
                      <p>{form.email}</p>
                      <p>{form.phone}</p>
                    </div>
                    <div>
                      <h4>Entrega</h4>
                      <p>{form.address}</p>
                      <p>{form.city}, {form.postalCode}</p>
                      <p>{form.country}</p>
                    </div>
                    <div>
                      <h4>Pagamento</h4>
                      <p>
                        {form.paymentMethod === 'card'
                          ? 'Cartão de Crédito/Débito'
                          : form.paymentMethod === 'paypal'
                            ? 'PayPal'
                            : form.paymentMethod === 'multibanco'
                              ? 'Multibanco'
                              : 'MB WAY'}
                      </p>
                      {form.paymentMethod === 'card' && (
                        <p>Pagamento protegido por Stripe</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="checkout-terms">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={form.acceptTerms}
                      onChange={handleInputChange}
                      required
                    />
                    <span>Aceito os <Link to="/terms" target="_blank">Termos e Condições</Link> e <Link to="/privacy" target="_blank">Política de Privacidade</Link> *</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="acceptMarketing"
                      checked={form.acceptMarketing}
                      onChange={handleInputChange}
                    />
                    <span>Quero receber comunicações de marketing da Tranzor</span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="checkout-navigation">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn-secondary"
                >
                  ← Voltar
                </button>
              )}
              <button
                type={currentStep === 4 ? 'submit' : 'button'}
                className="btn-primary"
                disabled={loading}
                onClick={currentStep === 4 ? undefined : handleContinue}
              >
                {loading ? 'Processando...' : nextStepLabel}
              </button>
            </div>
          </form>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="sidebar-summary">
              <h3>Resumo ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</h3>
              <div className="sidebar-items">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="sidebar-item">
                    <span className="sidebar-item-name">{item.name}</span>
                    <span className="sidebar-item-price">{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="sidebar-more">+{items.length - 3} mais itens</div>
                )}
              </div>
              <div className="sidebar-totals">
                <div className="sidebar-total-row">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="sidebar-total-row">
                  <span>Portes</span>
                  <span>{fmt(shipping)}</span>
                </div>
                <div className="sidebar-total-row sidebar-total-final">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="security-badges">
              <div className="security-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Pagamento Seguro</span>
              </div>
              <div className="security-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Dados Protegidos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .checkout-steps {
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .checkout-step {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }

        .checkout-step.active {
          opacity: 1;
        }

        .checkout-step.completed .step-number {
          background: var(--red);
          color: white;
        }

        .step-number {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: #e5e5e5;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .step-content {
          text-align: center;
        }

        .step-title {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-primary);
        }

        .step-description {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .step-connector {
          width: 3rem;
          height: 2px;
          background: #e5e5e5;
          margin: 0 1rem;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 3rem;
          align-items: start;
        }

        .checkout-form {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .checkout-step-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group-full {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--red);
        }

        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .payment-method {
          border: 2px solid #e5e5e5;
          border-radius: 12px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          position: relative;
        }

        .payment-method:hover,
        .payment-method.active {
          border-color: var(--red);
          background: rgba(217, 4, 41, 0.02);
          box-shadow: 0 4px 12px rgba(217, 4, 41, 0.1);
        }

        .payment-method.active::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border: 2px solid var(--red);
          border-radius: 14px;
          pointer-events: none;
        }

        .payment-method input[type="radio"] {
          display: none;
        }

        .payment-method-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .payment-method-icons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-icons {
          display: flex;
          gap: 0.25rem;
        }

        .card-icon {
          width: 32px;
          height: 20px;
          border-radius: 3px;
          overflow: hidden;
        }

        .card-icon svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .payment-method-icon {
          width: 48px;
          height: 30px;
          border-radius: 6px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8f8;
        }

        .paypal-icon,
        .mbway-icon,
        .multibanco-icon {
          background: white;
        }

        .paypal-icon svg {
          width: 100%;
          height: 100%;
        }

        .mbway-icon svg,
        .multibanco-icon svg {
          width: 100%;
          height: 100%;
        }

        .payment-method-details {
          flex: 1;
        }

        .payment-method-title {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .payment-method-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .payment-method-security {
          font-size: 0.75rem;
          color: #22c55e;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .card-form {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e5e5;
        }

        .order-summary,
        .customer-summary {
          background: #f8f8f8;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .order-summary h3,
        .customer-summary h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .order-items {
          margin-bottom: 1.5rem;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e5e5;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .order-item-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .order-item-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .order-item-quantity {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .order-totals {
          border-top: 1px solid #e5e5e5;
          padding-top: 1rem;
        }

        .order-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }

        .order-total-final {
          font-weight: 700;
          font-size: 1.125rem;
          color: var(--red);
          border-top: 1px solid #e5e5e5;
          margin-top: 0.5rem;
          padding-top: 1rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .summary-grid h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .summary-grid p {
          margin: 0.25rem 0;
          color: var(--text-secondary);
        }

        .checkout-terms {
          margin-bottom: 2rem;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin-top: 0.125rem;
          flex-shrink: 0;
        }

        .checkbox-label a {
          color: var(--red);
          text-decoration: none;
        }

        .checkbox-label a:hover {
          text-decoration: underline;
        }

        .checkout-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e5e5;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary {
          background: var(--red);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #b91c1c;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: var(--text-primary);
          border: 1px solid #e5e5e5;
        }

        .btn-secondary:hover {
          background: #f8f8f8;
        }

        .checkout-sidebar {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          position: sticky;
          top: 2rem;
        }

        .sidebar-summary h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .sidebar-items {
          margin-bottom: 1.5rem;
        }

        .sidebar-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          font-size: 0.875rem;
        }

        .sidebar-item-name {
          color: var(--text-primary);
        }

        .sidebar-item-price {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .sidebar-more {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-align: center;
          padding: 0.5rem;
        }

        .sidebar-totals {
          border-top: 1px solid #e5e5e5;
          padding-top: 1rem;
        }

        .sidebar-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.25rem 0;
          font-size: 0.875rem;
        }

        .sidebar-total-final {
          font-weight: 700;
          font-size: 1rem;
          color: var(--red);
          border-top: 1px solid #e5e5e5;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
        }

        .security-badges {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e5e5;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }

        .security-badge svg {
          color: var(--red);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .checkout-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .checkout-steps {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .step-connector {
            width: 2px;
            height: 2rem;
            margin: 0.5rem 0;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .summary-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .checkout-navigation {
            flex-direction: column;
            gap: 1rem;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </AppLayout>
  );
}