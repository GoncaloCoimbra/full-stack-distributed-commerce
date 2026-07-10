import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:5173';

test.describe('Admin CMS basic checks', () => {
  test('Admin can access Content and Coupons pages', async ({ page }) => {
    // Login as admin (assumes test admin exists)
    await page.goto(`${FRONTEND_URL}/login`);
    await page.fill('input[name="email"]', 'admin@Tranzor.pt');
    await page.fill('input[name="password"]', 'AdminPass123!');
    await page.click('button[type="submit"]');

    // Navigate to content management
    await page.goto(`${FRONTEND_URL}/admin/content`);
    await expect(page.locator('h1')).toHaveText(/Conteúdos|Conteudos|Gestão de conteúdos/i);

    // Navigate to coupons management
    await page.goto(`${FRONTEND_URL}/admin/coupons`);
    await expect(page.locator('h1')).toHaveText(/Cupões|Cupon|Cupões de desconto|Cupões de desconto/i);
  });
});
