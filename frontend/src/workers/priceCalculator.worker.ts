/**
 * Price Calculator Web Worker
 * Executa cálculos pesados de preços em background sem travar a interface React.
 * Isolado da main thread usando Web Workers.
 */

// Este ficheiro é executado como um Web Worker
declare const self: Worker;

interface PriceCalculationRequest {
  id: string;
  items: Array<{
    productId: string;
    quantity: number;
    basePrice: number;
    volumeDiscounts?: Array<{
      minQuantity: number;
      discountPercent: number;
    }>;
  }>;
  b2bDiscountRate?: number;
  discountCode?: string;
  taxRate?: number;
}

interface PriceCalculationResult {
  id: string;
  subtotal: number;
  itemPrices: Array<{
    productId: string;
    unitPrice: number;
    total: number;
  }>;
  discount: number;
  tax: number;
  total: number;
}

// Mensagens do Web Worker
self.onmessage = (event: MessageEvent<PriceCalculationRequest>) => {
  const request = event.data;

  try {
    const result = calculatePrices(request);
    self.postMessage({ success: true, data: result });
  } catch (error: any) {
    self.postMessage({
      success: false,
      error: error.message,
      requestId: request.id,
    });
  }
};

/**
 * Calcular preços com descontos, impostos e validações
 */
function calculatePrices(request: PriceCalculationRequest): PriceCalculationResult {
  const { items, b2bDiscountRate = 0, discountCode = '', taxRate = 0.23 } = request;

  // Calcular preços unitários com volume discounts
  const itemPrices = items.map((item) => {
    let unitPrice = item.basePrice;

    // Aplicar volume discount
    if (item.volumeDiscounts && item.volumeDiscounts.length > 0) {
      const applicableTier = item.volumeDiscounts
        .reverse()
        .find((tier) => item.quantity >= tier.minQuantity);

      if (applicableTier) {
        unitPrice = unitPrice * (1 - applicableTier.discountPercent / 100);
      }
    }

    // Aplicar B2B discount
    if (b2bDiscountRate > 0) {
      unitPrice = unitPrice * (1 - b2bDiscountRate / 100);
    }

    // Arredondar para 2 casas decimais (monetário)
    unitPrice = Math.round(unitPrice * 100) / 100;

    return {
      productId: item.productId,
      unitPrice,
      total: Math.round(unitPrice * item.quantity * 100) / 100,
    };
  });

  // Calcular subtotal
  const subtotal = itemPrices.reduce((sum, item) => sum + item.total, 0);

  // Aplicar desconto de código (simplificado: 10% para código válido)
  let discount = 0;
  if (discountCode && ['SUMMER2026', 'B2B10', 'LOYAL'].includes(discountCode)) {
    discount = Math.round(subtotal * 0.1 * 100) / 100;
  }

  // Calcular subtotal após desconto
  const subtotalAfterDiscount = subtotal - discount;

  // Calcular impostos
  const tax = Math.round(subtotalAfterDiscount * taxRate * 100) / 100;

  // Total final
  const total = subtotalAfterDiscount + tax;

  return {
    id: request.id,
    subtotal,
    itemPrices,
    discount,
    tax,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Simular processamento pesado (exemplo)
 */
function validatePriceIntegrity(prices: any): boolean {
  // Verificar se os preços foram alterados maliciosamente
  return prices.subtotal >= 0 && prices.tax >= 0 && prices.total > 0;
}

export {};
