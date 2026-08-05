import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:5174';
const API_URL = 'http://localhost:3001/api/v1';
const ADMIN_EMAIL = 'admin@tranzor.pt';
const ADMIN_PASSWORD = 'ChangeMe123!';

async function ensureAdminUser(page: Parameters<typeof test>[0]['page']) {
  const payload = {
    name: 'Admin Test User',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    confirmPassword: ADMIN_PASSWORD,
    role: 'admin',
    agreeTerms: true
  };

  const response = await page.request.post(`${API_URL}/auth/register`, {
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(payload),
  });

  if (response.status() === 201 || response.status() === 409) {
    return;
  }

  const body = await response.text();
  throw new Error(`Failed to ensure admin user: ${response.status()} ${body}`);
}

async function signInAdmin(page: Parameters<typeof test>[0]['page']) {
  const response = await page.request.post(`${API_URL}/auth/login`, {
    headers: { 'Content-Type': 'application/json' },
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.success).toBeTruthy();
  expect(body.token).toBeTruthy();

  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
  await page.evaluate((token) => {
    localStorage.setItem('auth_token', token);
  }, body.token);

  await page.goto(`${FRONTEND_URL}/admin/content`, { waitUntil: 'networkidle' });
}

test.describe('Admin CMS basic checks', () => {
  test('Admin can access Content and Coupons pages', async ({ page }) => {
    await ensureAdminUser(page);
    await signInAdmin(page);

    await page.goto(`${FRONTEND_URL}/admin/content`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1.adm-title', { state: 'visible', timeout: 15000 });
    await expect(page.locator('h1.adm-title')).toHaveText(/Gestão de conteúdos/i);

    await page.goto(`${FRONTEND_URL}/admin/coupons`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1.adm-title', { state: 'visible', timeout: 15000 });
    await expect(page.locator('h1.adm-title')).toHaveText(/Cupões de desconto/i);
  });
});
