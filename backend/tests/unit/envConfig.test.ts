describe('environment configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('accepts comma-separated frontend origins in the environment', () => {
    process.env.FRONTEND_URL = 'http://localhost:5173,http://localhost:5174';
    process.env.CORS_ORIGIN = 'http://localhost:5173,http://localhost:5174';

    const { env } = require('../../server/config/env');

    expect(env.FRONTEND_URL).toBe('http://localhost:5173,http://localhost:5174');
    expect(env.CORS_ORIGIN).toBe('http://localhost:5173,http://localhost:5174');
  });
});
