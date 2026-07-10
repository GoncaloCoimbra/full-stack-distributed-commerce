/**
 * Packing & Cubagem Service
 * Calcula dimensões de caixas baseado em produtos
 * Algoritmo de bin packing 3D simples
 */

export interface Dimension {
  length: number;
  width: number;
  height: number;
}

export interface PackedBox {
  boxType: string;
  dimensions: Dimension;
  volume: number;
  weight: number;
  items: Array<{
    productId: string;
    quantity: number;
    sku: string;
    weight: number;
    dimensions: Dimension;
  }>;
  utilization: number; // %
}

export interface PackingResult {
  boxes: PackedBox[];
  totalVolume: number;
  totalWeight: number;
  estimatedShippingCost: number;
}

// Tipos de caixas disponíveis (cm x cm x cm, kg)
const BOX_TYPES = {
  'SMALL': {
    dimensions: { length: 20, width: 15, height: 10 },
    volume: 3000, // cm³
    weight: 0.3, // kg
    baseShippingCost: 5.00,
  },
  'MEDIUM': {
    dimensions: { length: 30, width: 20, height: 15 },
    volume: 9000, // cm³
    weight: 0.5, // kg
    baseShippingCost: 8.50,
  },
  'LARGE': {
    dimensions: { length: 40, width: 30, height: 20 },
    volume: 24000, // cm³
    weight: 0.8, // kg
    baseShippingCost: 12.00,
  },
  'XLARGE': {
    dimensions: { length: 50, width: 40, height: 30 },
    volume: 60000, // cm³
    weight: 1.2, // kg
    baseShippingCost: 18.00,
  },
};

export class PackingService {
  /**
   * Selecionar melhor caixa para um conjunto de items
   */
  static selectBestBox(items: Array<{
    productId: string;
    quantity: number;
    sku: string;
    weight: number;
    dimensions?: Dimension;
  }>): { boxType: string; utilization: number } {
    const totalVolume = items.reduce((sum, item) => {
      const dims = item.dimensions || { length: 10, width: 10, height: 10 };
      const itemVolume = dims.length * dims.width * dims.height * item.quantity;
      return sum + itemVolume;
    }, 0);

    const totalWeight = items.reduce((sum, item) => sum + item.weight * item.quantity, 0);

    // Selecionar caixa mais pequena que cabe todos os items (com 20% margem)
    const requiredVolume = totalVolume * 1.2;

    for (const [boxType, specs] of Object.entries(BOX_TYPES)) {
      if (specs.volume >= requiredVolume && specs.weight > totalWeight) {
        const utilization = (totalVolume / specs.volume) * 100;
        return { boxType, utilization };
      }
    }

    // Fallback para maior caixa
    return { boxType: 'XLARGE', utilization: (totalVolume / BOX_TYPES['XLARGE'].volume) * 100 };
  }

  /**
   * Calcular cubagem e sugerir caixas para encomenda
   */
  static calculatePacking(orderItems: Array<{
    productId: string;
    quantity: number;
    sku: string;
    weight: number;
    dimensions?: Dimension;
  }>): PackingResult {
    // Agrupar items por tamanho/compatibilidade
    const groups = this.groupItemsForPacking(orderItems);
    const boxes: PackedBox[] = [];
    let totalVolume = 0;
    let totalWeight = 0;
    let totalShippingCost = 0;

    for (const group of groups) {
      const { boxType, utilization } = this.selectBestBox(group);
      const boxSpecs = BOX_TYPES[boxType as keyof typeof BOX_TYPES];

      const groupWeight = group.reduce((sum, item) => sum + item.weight * item.quantity, 0);
      const groupVolume = group.reduce((sum, item) => {
        const dims = item.dimensions || { length: 10, width: 10, height: 10 };
        return sum + dims.length * dims.width * dims.height * item.quantity;
      }, 0);

      boxes.push({
        boxType,
        dimensions: boxSpecs.dimensions,
        volume: groupVolume,
        weight: groupWeight + boxSpecs.weight,
        items: group.map((item) => ({
          ...item,
          dimensions: item.dimensions ?? { length: 10, width: 10, height: 10 },
        })),
        utilization,
      });

      totalVolume += groupVolume;
      totalWeight += groupWeight + boxSpecs.weight;
      totalShippingCost += boxSpecs.baseShippingCost + (groupWeight * 0.50); // €0.50 por kg extra
    }

    return {
      boxes,
      totalVolume,
      totalWeight,
      estimatedShippingCost: parseFloat(totalShippingCost.toFixed(2)),
    };
  }

  /**
   * Agrupar items em caixas (algoritmo simples First-Fit)
   */
  private static groupItemsForPacking(items: Array<{
    productId: string;
    quantity: number;
    sku: string;
    weight: number;
    dimensions?: Dimension;
  }>): Array<Array<typeof items[0]>> {
    const groups: Array<Array<typeof items[0]>> = [];

    for (const item of items) {
      let placed = false;

      // Tentar colocar em grupo existente
      for (const group of groups) {
        const { boxType } = this.selectBestBox([...group, item]);
        const boxSpecs = BOX_TYPES[boxType as keyof typeof BOX_TYPES];
        const groupVolume = group.reduce((sum, i) => {
          const dims = i.dimensions || { length: 10, width: 10, height: 10 };
          return sum + dims.length * dims.width * dims.height * i.quantity;
        }, 0);
        const itemVolume = (item.dimensions?.length || 10) * (item.dimensions?.width || 10) * (item.dimensions?.height || 10) * item.quantity;

        if (groupVolume + itemVolume <= boxSpecs.volume * 0.9) {
          group.push(item);
          placed = true;
          break;
        }
      }

      // Se não coube em nenhuma, criar novo grupo
      if (!placed) {
        groups.push([item]);
      }
    }

    return groups;
  }

  /**
   * Calcular peso total da encomenda
   */
  static calculateTotalWeight(items: Array<{
    weight: number;
    quantity: number;
  }>): number {
    return items.reduce((sum, item) => sum + item.weight * item.quantity, 0);
  }

  /**
   * Calcular volume total da encomenda
   */
  static calculateTotalVolume(items: Array<{
    dimensions?: Dimension;
    quantity: number;
  }>): number {
    return items.reduce((sum, item) => {
      const dims = item.dimensions || { length: 10, width: 10, height: 10 };
      return sum + dims.length * dims.width * dims.height * item.quantity;
    }, 0);
  }

  /**
   * Calcular custo de envio baseado em volume/peso
   */
  static calculateShippingCost(packing: PackingResult): number {
    return packing.estimatedShippingCost;
  }
}
