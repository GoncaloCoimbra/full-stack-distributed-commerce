/**
 * TESTE DE RACE CONDITION FIX
 * ============================
 * 
 * Script que demonstra que a solução previne race conditions
 * Simula 10 checkout simultâneos para o mesmo produto com stock limitado
 * 
 * ANTES (sem lock):
 *   - Stock resultaria em -5 (ERRADO!)
 *   - Múltiplos clientes recebem o produto
 * 
 * DEPOIS (com lock + fila):
 *   - Stock final = 0 (CORRETO!)
 *   - Apenas 5 clientes confirmados
 *   - 5 clientes recebem "out of stock"
 * 
 * EXECUTAR:
 * npx ts-node test-race-condition.ts
 */

import Order from '../models/Order';
import Product from '../models/Product';
import { processCheckoutWithFila } from '../services/checkoutIntegrationService';

// Simular os dados
const PRODUCT_ID = 'test-product-001';
const INITIAL_STOCK = 5;
const CONCURRENT_ORDERS = 10;

async function setupTest() {
  console.log('🔧 [SETUP] Preparando teste...\n');

  // Limpar dados antigos
  await Product.deleteMany({ _id: PRODUCT_ID });
  await Order.deleteMany({ testRaceCondition: true });

  // Criar produto com 5 unidades
  const product = new Product({
    _id: PRODUCT_ID,
    name: 'Teste Race Condition',
    sku: 'TEST-RC-001',
    price: 100,
    stockQuantity: INITIAL_STOCK,
    inStock: true,
    isActive: true,
  });
  await product.save();

  console.log(`✅ Produto criado: ${INITIAL_STOCK} unidades em stock\n`);
}

async function simulateConcurrentCheckouts() {
  console.log(`🚀 [TEST] Simulando ${CONCURRENT_ORDERS} checkouts simultâneos...\n`);

  const promises = [];

  for (let i = 0; i < CONCURRENT_ORDERS; i++) {
    const promise = (async () => {
      try {
        // Criar ordem
        const order = new Order({
          items: [
            {
              product: PRODUCT_ID,
              name: 'Teste Race Condition',
              sku: 'TEST-RC-001',
              quantity: 1,
              price: 100,
              total: 100,
            },
          ],
          subtotal: 100,
          tax: 0,
          shipping: 0,
          total: 100,
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'card',
          testRaceCondition: true,
        });
        await order.save();

        // Enfileirar para processamento
        const result = await processCheckoutWithFila(order._id.toString(), 'test-user', [
          { productId: PRODUCT_ID, quantity: 1 },
        ]);

        console.log(`📦 [ORDER ${i + 1}] ${result.message}`);
        return { orderId: order._id, status: result.status };
      } catch (error: any) {
        console.error(`❌ [ORDER ${i + 1}] Erro: ${error.message}`);
        return null;
      }
    })();

    promises.push(promise);
  }

  // Aguardar TODOS os checkouts (simulação de concorrência)
  return Promise.all(promises);
}

async function verifyResults() {
  console.log('\n✅ [VERIFICAÇÃO] Resultados finais:\n');

  // Verificar stock final
  const product = await Product.findById(PRODUCT_ID);
  console.log(`📊 Stock final: ${product?.stockQuantity} (inicial: ${INITIAL_STOCK})`);

  // Contar ordens confirmadas
  const confirmedOrders = await Order.countDocuments({
    testRaceCondition: true,
    status: 'confirmed',
  });
  const failedOrders = await Order.countDocuments({
    testRaceCondition: true,
    status: 'failed',
  });
  const pendingOrders = await Order.countDocuments({
    testRaceCondition: true,
    status: 'pending',
  });

  console.log(`✅ Ordens confirmadas: ${confirmedOrders}`);
  console.log(`❌ Ordens falhadas: ${failedOrders}`);
  console.log(`⏳ Ordens pendentes: ${pendingOrders}`);

  // Verificar integridade
  console.log('\n🔍 [INTEGRIDADE]');
  if (product?.stockQuantity! >= 0 && confirmedOrders === INITIAL_STOCK) {
    console.log(`✅ ✅ ✅ SUCESSO! Stock nunca ficou negativo!`);
    console.log(`✅ Exatamente ${INITIAL_STOCK} ordens confirmadas (o máximo possível)`);
    console.log(`✅ Sem race condition detectada`);
    return true;
  } else {
    console.log(`❌ FALHOU! Stock negativo ou ordens excessivas!`);
    console.log(`  Stock: ${product?.stockQuantity}, Confirmadas: ${confirmedOrders}`);
    return false;
  }
}

async function runTest() {
  try {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   RACE CONDITION FIX - VERIFICATION    ║');
    console.log('╚════════════════════════════════════════╝\n');

    // Setup
    await setupTest();

    // Aguardar um pouco para simular timing real
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Executar 10 checkouts simultâneos
    const results = await simulateConcurrentCheckouts();

    // Aguardar processamento da fila (~3-5 segundos)
    console.log('\n⏳ [FILA] Aguardando processamento...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Verificar resultados
    const success = await verifyResults();

    // Limpeza
    console.log('\n🧹 [CLEANUP] Removendo dados de teste...');
    await Product.deleteOne({ _id: PRODUCT_ID });
    await Order.deleteMany({ testRaceCondition: true });

    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

// Executar
runTest().catch(console.error);
