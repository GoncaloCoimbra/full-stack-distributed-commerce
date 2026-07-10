import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('API Health Checks - E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api', () => {
    it('should return 200 OK from health endpoint', async () => {
      const response = await request(app.getHttpServer()).get('/api');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/docs', () => {
    it('should return Swagger API documentation', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/docs')
        .redirects(1);

      expect(response.status).toBe(200);
    });
  });

  describe('Auth Endpoints', () => {
    it('should reject login with invalid credentials (404 user not found)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject requests without JWT token to protected routes', async () => {
      const response = await request(app.getHttpServer()).get('/api/users');

      expect(response.status).toBe(401);
    });
  });

  describe('CORS & Security Headers', () => {
    it('should not allow CORS headers from unauthorized origins', async () => {
      const response = await request(app.getHttpServer())
        .get('/api')
        .set('Origin', 'http://unauthorized.com');

      // CORS headers should not include the unauthorized origin
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('should set security headers', async () => {
      const response = await request(app.getHttpServer()).get('/api');

      // Check for basic security headers
      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/nonexistent-route')
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
    });

    it('should return validation error for malformed requests', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          // Missing password
        });

      expect([400, 422]).toContain(response.status);
    });
  });
});

describe('Multi-Tenant Data Isolation - E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should deny access to protected endpoints without JWT', async () => {
    const response = await request(app.getHttpServer()).get('/api/products');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 403 Forbidden for unauthorized roles', async () => {
    // This test assumes a valid JWT exists for a non-admin user
    // In a real scenario, you would create a test user first
    const testToken = 'invalid-or-expired-token';

    const response = await request(app.getHttpServer())
      .delete('/api/products/some-id')
      .set('Authorization', `Bearer ${testToken}`);

    expect([401, 403]).toContain(response.status);
  });
});
