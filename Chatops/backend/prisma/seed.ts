import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.upsert({
    where: { sku: 'SKU-001' } as any,
    update: {},
    create: { sku: 'SKU-001', name: 'Produto Demo', stock: 42 } as any,
  });

  await prisma.b2bClient.upsert({
    where: { id: 'client-1' } as any,
    update: {},
    create: { id: 'client-1', name: 'Cliente Demo', creditStatus: 'PENDING' } as any,
  });

  console.log('Seed concluído');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
