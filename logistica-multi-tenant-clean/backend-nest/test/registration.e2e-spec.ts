import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { createApp } from '../src/main';
import { INestApplication } from '@nestjs/common';

const prisma = new PrismaClient();
const describeOrSkip = process.env.DATABASE_URL ? describe : describe.skip;

async function createSupplier(server: any, token: string, ts: number) {
  const numericNif = String(ts % 1000000000).padStart(9, '0');
  const response = await request(server)
    .post('/api/suppliers')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: `Supplier ${ts}`,
      nif: numericNif,
      email: `supplier.${ts}@example.com`,
      phone: '+351912345678',
    });

  expect(response.status).toBe(201);
  return response.body.id;
}

describeOrSkip('Registration e2e', () => {
  let app: INestApplication;
  let server: any;
  let companyId: string;
  let token: string;

  beforeAll(async () => {
    app = await createApp();
    await app.init();
    server = app.getHttpServer();
  }, 20000);

  afterAll(async () => {
    if (companyId) {
      await prisma.company.delete({ where: { id: companyId } }).catch(() => {});
    }
    await prisma.$disconnect();
    await app.close();
  });

  test('should register company and create admin user', async () => {
    const ts = Date.now();
    const res = await request(server)
      .post('/api/auth/registration/company')
      .send({
        companyName: `E2E Company ${ts}`,
        companyNif: `NIF${ts}`,
        companyEmail: `e2e.company.${ts}@example.com`,
        companyPhone: '123',
        companyAddress: 'Rua E2E',
        userName: 'E2E Admin',
        userEmail: `e2e.admin.${ts}@example.com`,
        userPassword: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user).toBeTruthy();

    token = res.body.token;
    companyId = res.body.user.companyId;

    // Create a product using the token
    const supplierId = await createSupplier(server, token, ts + 1);

    const createProduct = await request(server)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        internalCode: `P-${ts}`,
        description: 'Product e2e',
        quantity: 1,
        unit: 'pcs',
        supplierId,
      });

    expect(createProduct.status).toBe(201);
    const product = createProduct.body;
    expect(product.status).toBe('RECEIVED');

    // Change status to IN_ANALYSIS
    const changeStatus = await request(server)
      .patch(`/api/products/${product.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newStatus: 'IN_ANALYSIS' });

    expect(changeStatus.status).toBe(200);
    expect(
      changeStatus.body.status ||
        changeStatus.body.product?.status ||
        changeStatus.body.product?.status,
    ).toBeTruthy();

    // Check movements
    const movements = await request(server)
      .get(`/api/products/${product.id}/movements`)
      .set('Authorization', `Bearer ${token}`);

    expect(movements.status).toBe(200);
    expect(Array.isArray(movements.body.movements)).toBe(true);
    expect(
      movements.body.movements.some((m: any) => m.newStatus === 'IN_ANALYSIS'),
    ).toBe(true);
  }, 30000);
});
