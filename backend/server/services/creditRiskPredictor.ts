/**
 * Credit Risk Prediction Model
 * Modelo leve de machine learning para analisar histórico de compras
 * e alertar sobre risco de esgotar limite de crédito.
 */

import { Types } from 'mongoose';
import User from '../models/User';
import Order from '../models/Order';

export interface CreditRiskScore {
  userId: string;
  companyName: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number; // 0-100
  creditUtilization: number; // percentagem
  predictedMonthlySpend: number;
  daysUntilLimitBreak: number | null;
  recommendations: string[];
}

export class CreditRiskPredictor {
  /**
   * Calcular score de risco de crédito para um cliente
   */
  async predictCreditRisk(userId: string): Promise<CreditRiskScore> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`Utilizador ${userId} não encontrado`);
    }

    // Recolher dados históricos
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await Order.find({
      user: userId as any,
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Calcular features
    const features = this.extractFeatures(user, orders, thirtyDaysAgo);

    // Aplicar modelo de ML (regressão logística simplificada)
    const riskScore = this.predictRiskScore(features);
    const riskLevel = this.classifyRiskLevel(riskScore);

    const creditUsed = Number((user as any).creditUsed ?? 0);
    const creditLimit = Number(user.creditLimit ?? 0);

    // Calcular utilização de crédito
    const creditUtilization = creditLimit > 0 ? (creditUsed / creditLimit) * 100 : 0;

    // Calcular gasto mensal predito
    const monthlySpend = features.avgMonthlySpend;

    // Calcular dias até quebra do limite
    const daysUntilLimitBreak =
      monthlySpend > 0 && creditLimit > 0
        ? Math.ceil(((creditLimit - creditUsed) / monthlySpend) * 30)
        : null;

    // Gerar recomendações
    const recommendations = this.generateRecommendations(features, riskLevel, creditUtilization);

    return {
      userId,
      companyName: (user as any).profile?.company || user.name,
      riskLevel,
      riskScore,
      creditUtilization: Math.min(creditUtilization, 100),
      predictedMonthlySpend: monthlySpend,
      daysUntilLimitBreak: daysUntilLimitBreak && daysUntilLimitBreak > 0 ? daysUntilLimitBreak : null,
      recommendations,
    };
  }

  /**
   * Extrair features do histórico de compras
   */
  private extractFeatures(
    user: any,
    orders: any[],
    startDate: Date
  ): {
    creditUtilization: number;
    avgMonthlySpend: number;
    orderFrequency: number;
    paymentDelayDays: number;
    orderValueVariance: number;
    bounceRate: number;
  } {
    const creditLimit = Number(user.creditLimit ?? 10000);
    const creditUsed = Number((user as any).creditUsed ?? 0);
    const creditUtilization = (creditUsed / creditLimit) * 100;

    // Gasto médio mensal
    const totalSpend = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
    const monthlySpend = totalSpend / ((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

    // Frequência de encomendas
    const orderFrequency = orders.length;

    // Dias médios de atraso de pagamento
    const paymentDelays = orders
      .filter((o: any) => o.paymentStatus === 'paid')
      .map((o: any) => {
        const created = new Date(o.createdAt).getTime();
        const paid = new Date(o.paidAt || o.updatedAt).getTime();
        return (paid - created) / (1000 * 60 * 60 * 24);
      });
    const avgPaymentDelay = paymentDelays.length > 0 ? paymentDelays.reduce((a, b) => a + b, 0) / paymentDelays.length : 0;

    // Variância de valores de encomenda
    const values = orders.map((o: any) => o.total || 0);
    const mean = values.reduce((a, b) => a + b, 0) / values.length || 0;
    const variance = values.length > 0 ? values.map((v: number) => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0) / values.length : 0;

    // Taxa de cancelamentos / falhas
    const failedOrders = orders.filter((o: any) => o.status === 'cancelled' || o.paymentStatus === 'failed');
    const bounceRate = orders.length > 0 ? (failedOrders.length / orders.length) * 100 : 0;

    return {
      creditUtilization,
      avgMonthlySpend: monthlySpend,
      orderFrequency,
      paymentDelayDays: Math.max(0, avgPaymentDelay),
      orderValueVariance: Math.sqrt(variance),
      bounceRate,
    };
  }

  /**
   * Prever score de risco (0-100)
   * Usando regressão logística simplificada
   */
  private predictRiskScore(features: ReturnType<typeof this.extractFeatures>): number {
    // Pesos estimados para cada feature
    const weights = {
      creditUtilization: 0.35, // Maior peso
      avgMonthlySpend: 0.20,
      paymentDelayDays: 0.20,
      bounceRate: 0.15,
      orderValueVariance: 0.05,
      orderFrequency: -0.05, // Negativo (frequência reduz risco)
    };

    // Normalizar features para 0-100
    const normalized = {
      creditUtilization: features.creditUtilization,
      avgMonthlySpend: Math.min((features.avgMonthlySpend / 5000) * 100, 100),
      paymentDelayDays: Math.min((features.paymentDelayDays / 30) * 100, 100),
      bounceRate: features.bounceRate,
      orderValueVariance: Math.min((features.orderValueVariance / 1000) * 100, 100),
      orderFrequency: Math.max(100 - (features.orderFrequency * 5), 0),
    };

    // Calcular score ponderado
    const score =
      normalized.creditUtilization * weights.creditUtilization +
      normalized.avgMonthlySpend * weights.avgMonthlySpend +
      normalized.paymentDelayDays * weights.paymentDelayDays +
      normalized.bounceRate * weights.bounceRate +
      normalized.orderValueVariance * weights.orderValueVariance +
      normalized.orderFrequency * weights.orderFrequency;

    // Aplicar função sigmóide para escalar para 0-100
    return Math.round((100 / (1 + Math.exp(-score / 50))) * 100) / 100;
  }

  /**
   * Classificar nível de risco baseado no score
   */
  private classifyRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score < 25) return 'LOW';
    if (score < 50) return 'MEDIUM';
    if (score < 75) return 'HIGH';
    return 'CRITICAL';
  }

  /**
   * Gerar recomendações personalizadas
   */
  private generateRecommendations(
    features: ReturnType<typeof this.extractFeatures>,
    riskLevel: string,
    creditUtilization: number
  ): string[] {
    const recommendations: string[] = [];

    if (creditUtilization > 80) {
      recommendations.push('⚠️ Utilização de crédito acima de 80% - Recomenda-se aumentar o limite ou reduzir despesas');
    }

    if (features.paymentDelayDays > 15) {
      recommendations.push(`📅 Atraso médio de ${Math.round(features.paymentDelayDays)} dias nos pagamentos - Monitorizar prazos de pagamento`);
    }

    if (features.bounceRate > 10) {
      recommendations.push(`❌ Taxa de cancelamento de ${Math.round(features.bounceRate)}% - Investigar causas de falhas`);
    }

    if (features.avgMonthlySpend > 4000) {
      recommendations.push(`💰 Gasto mensal elevado (${Math.round(features.avgMonthlySpend)}€) - Considerar negociação de volume discounts`);
    }

    if (riskLevel === 'CRITICAL') {
      recommendations.push('🚨 Risco crítico - Contactar cliente imediatamente para alinhamento de estratégia de pagamento');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Saúde de crédito normal - Continuar monitorização mensal');
    }

    return recommendations;
  }

  /**
   * Analisar múltiplos utilizadores e retornar alertas de risco crítico
   */
  async scanHighRiskCustomers(): Promise<CreditRiskScore[]> {
    const users = await User.find({ role: 'b2b_buyer', isActive: true });

    const risks: CreditRiskScore[] = [];

    for (const user of users) {
      try {
        const risk = await this.predictCreditRisk(user._id.toString());

        if (risk.riskLevel === 'HIGH' || risk.riskLevel === 'CRITICAL') {
          risks.push(risk);
        }
      } catch (error) {
        console.error(`Erro ao analisar risco para utilizador ${user._id}:`, error);
      }
    }

    return risks.sort((a, b) => b.riskScore - a.riskScore);
  }
}

export const creditRiskPredictor = new CreditRiskPredictor();
