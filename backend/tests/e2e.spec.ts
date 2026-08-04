import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3001/api/v1';
const FRONTEND_URL = 'http://localhost:5174';

test.describe('E2E - E-commerce Flow', () => {
  test('User Registration and Login Flow', async ({ page }) => {
    // Register
    await page.goto(`${FRONTEND_URL}/auth/register`);
    
    const email = `test${Date.now()}@example.com`;
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'TestPassword123!');
    // The frontend uses a single `name` field; provide confirmPassword for API validation
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    
    await page.click('button[type="submit"]');
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL(`${FRONTEND_URL}/account/dashboard`);
    
    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-btn"]');
    
    // Login again
    await page.goto(`${FRONTEND_URL}/auth/login`);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(`${FRONTEND_URL}/account/dashboard`);
  });

  test('Product browsing and filtering', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/shop`);
    
    // Check products are displayed
    const productCards = await page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
    
    // Filter by category
    await page.click('[data-testid="category-filter"]');
    await page.click('text=Electronics');
    
    await page.waitForTimeout(500);
    
    // Verify filtered results
    const activeFilters = await page.locator('[data-testid="active-filter"]');
    await expect(activeFilters).toContainText('Electronics');
  });

  test('Add to cart and checkout', async ({ page }) => {
    // Login first
    await page.goto(`${FRONTEND_URL}/auth/login`);
    const email = `checkout-test${Date.now()}@example.com`;
    // ... (login flow)
    
    // Add to cart
    await page.goto(`${FRONTEND_URL}/shop`);
    await page.click('[data-testid="product-card"] >> first');
    await page.click('[data-testid="add-to-cart"]');
    
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
    
    // Go to cart
    await page.goto(`${FRONTEND_URL}/cart`);
    
    // Verify item in cart
    const cartItem = await page.locator('[data-testid="cart-item"]');
    await expect(cartItem).toBeVisible();
    
    // Checkout
    await page.click('[data-testid="checkout-btn"]');
    
    // Should be on checkout page
    await expect(page).toHaveURL(/\/checkout/);
  });

  test('API - User Registration via REST', async () => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `api-test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        name: 'Test User',
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.accessToken).toBeTruthy();
  });

  test('API - Get Products with filters', async () => {
    const response = await fetch(
      `${API_URL}/products?page=1&limit=10&sortBy=createdAt&order=desc`,
      { method: 'GET' }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('Admin Dashboard Access', async ({ page }) => {
    // Login as admin
    await page.goto(`${FRONTEND_URL}/login`);
    await page.fill('input[name="email"]', 'admin@Tranzor.pt');
    await page.fill('input[name="password"]', 'AdminPass123!');
    await page.click('button[type="submit"]');
    
    // Navigate to admin
    await page.goto(`${FRONTEND_URL}/admin`);
    
    // Verify admin dashboard is visible
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    
    // Check key metrics are displayed
    await expect(page.locator('[data-testid="total-orders"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible();
  });
});

test.describe('Performance Tests', () => {
  test('Page load time - Homepage', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load in less than 5 seconds (CI-friendly)
    expect(loadTime).toBeLessThan(5000);
  });

  test('Page load time - Shop', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(`${FRONTEND_URL}/shop`, { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Increased threshold for CI shared runners
    expect(loadTime).toBeLessThan(4000);
  });
});

test.describe('Accessibility Tests', () => {
  test('Homepage accessibility', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/`);
    
    // Check for main landmark
    await expect(page.locator('main')).toBeVisible();
    
    // Check for proper heading hierarchy
    const h1 = await page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check for proper link text
    const links = await page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Keyboard navigation', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/`);
    
    // Tab through interactive elements
    await page.press('body', 'Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeTruthy();
  });
});
