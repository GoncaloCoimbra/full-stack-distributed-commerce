# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> E2E - E-commerce Flow >> User Registration and Login Flow
- Location: tests\e2e.spec.ts:7:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:5174/account/profile"
Received: "http://localhost:5174/auth/register"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × locator resolved to <html lang="pt">…</html>
       - unexpected value "http://localhost:5174/auth/register"

```

```yaml
- main:
  - main:
    - main:
      - paragraph: — Free registration
      - heading "Create account" [level=2]
      - paragraph:
        - text: Already have an account?
        - link "Sign in →":
          - /url: /auth/login
      - text: Full name
      - textbox "Full name":
        - /placeholder: Maria Silva
        - text: John Doe
      - text: Email
      - textbox "Email":
        - /placeholder: your@email.com
        - text: test1785870084776@example.com
      - text: Password
      - textbox "Password":
        - /placeholder: ••••••••
        - text: TestPassword123!
      - button "Show password"
      - text: Excellent
      - list "Password":
        - listitem: At least 8 characters
        - listitem: Uppercase letter
        - listitem: Lowercase letter
        - listitem: Number or symbol
      - text: Confirm Password
      - textbox "Confirm Password":
        - /placeholder: ••••••••
        - text: TestPassword123!
      - button "Show password"
      - checkbox "Terms Terms e a Privacy Policy." [checked]
      - text: Terms
      - link "Terms":
        - /url: /terms
      - text: e a
      - link "Privacy Policy":
        - /url: /privacy
      - text: .
      - alert: Registro falhou
      - button "Create account"
      - paragraph:
        - text: By creating an account, you agree to our
        - link "Terms":
          - /url: /terms
        - text: e a
        - link "Privacy Policy":
          - /url: /privacy
        - text: .Your data is processed in accordance with GDPR.
  - dialog "Cookie consent":
    - paragraph: This site uses cookies
    - paragraph:
      - text: We use essential cookies and, with your permission, analytics to improve the experience.
      - link "Learn more":
        - /url: /cookies
    - button "Reject"
    - button "Accept cookies"
- dialog "Cookie consent":
  - paragraph: This site uses cookies
  - paragraph:
    - text: We use essential cookies and, with your permission, analytics to improve the experience.
    - link "Learn more":
      - /url: /cookies
  - button "Reject"
  - button "Accept cookies"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const API_URL = 'http://localhost:3001/api/v1';
  4   | const FRONTEND_URL = 'http://localhost:5174';
  5   | 
  6   | test.describe('E2E - E-commerce Flow', () => {
  7   |   test('User Registration and Login Flow', async ({ page }) => {
  8   |     // Register
  9   |     await page.goto(`${FRONTEND_URL}/auth/register`, { waitUntil: 'networkidle' });
  10  |     await page.waitForSelector('input[name="email"]', { state: 'visible', timeout: 15000 });
  11  |     await page.waitForSelector('input[name="name"]', { state: 'visible', timeout: 15000 });
  12  |     
  13  |     const email = `test${Date.now()}@example.com`;
  14  |     await page.fill('input[name="email"]', email);
  15  |     await page.fill('input[name="password"]', 'TestPassword123!');
  16  |     await page.fill('input[name="name"]', 'John Doe');
  17  |     await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
  18  |     await page.check('input[type="checkbox"]');
  19  |     
  20  |     await page.click('button[type="submit"]');
  21  |     
  22  |     // Should be redirected to profile
> 23  |     await expect(page).toHaveURL(`${FRONTEND_URL}/account/profile`);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  24  |     await expect(page.locator('input[name="email"]').first()).toHaveValue(email);
  25  |     
  26  |     // Logout via API cleanup if available
  27  |     await page.goto(`${FRONTEND_URL}/auth/login`, { waitUntil: 'networkidle' });
  28  |     await page.waitForSelector('input[name="email"]', { state: 'visible', timeout: 15000 });
  29  |     await page.fill('input[name="email"]', email);
  30  |     await page.fill('input[name="password"]', 'TestPassword123!');
  31  |     await page.click('button[type="submit"]');
  32  |     
  33  |     await expect(page).toHaveURL(`${FRONTEND_URL}/account/profile`);
  34  |   });
  35  | 
  36  |   test('Product browsing and filtering', async ({ page }) => {
  37  |     await page.goto(`${FRONTEND_URL}/shop/enhanced`, { waitUntil: 'networkidle' });
  38  |     await page.waitForSelector('[data-testid="product-card"]', { state: 'visible', timeout: 15000 });
  39  |     
  40  |     // Check products are displayed
  41  |     const productCards = page.locator('[data-testid="product-card"]');
  42  |     await expect(productCards.first()).toBeVisible();
  43  |     
  44  |     // Filter by category using the visible category label
  45  |     await page.locator('label', { hasText: 'Artes' }).first().click();
  46  |     await expect(page.locator('label.filter-option.active', { hasText: 'Artes' })).toContainText('Artes');
  47  |   });
  48  | 
  49  |   test('Add to cart and checkout', async ({ page }) => {
  50  |     // Login first
  51  |     await page.goto(`${FRONTEND_URL}/auth/login`);
  52  |     const email = `checkout-test${Date.now()}@example.com`;
  53  |     // ... (login flow)
  54  |     
  55  |     // Add to cart
  56  |     await page.goto(`${FRONTEND_URL}/shop`);
  57  |     await page.click('[data-testid="product-card"] >> first');
  58  |     await page.click('[data-testid="add-to-cart"]');
  59  |     
  60  |     await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
  61  |     
  62  |     // Go to cart
  63  |     await page.goto(`${FRONTEND_URL}/cart`);
  64  |     
  65  |     // Verify item in cart
  66  |     const cartItem = await page.locator('[data-testid="cart-item"]');
  67  |     await expect(cartItem).toBeVisible();
  68  |     
  69  |     // Checkout
  70  |     await page.click('[data-testid="checkout-btn"]');
  71  |     
  72  |     // Should be on checkout page
  73  |     await expect(page).toHaveURL(/\/checkout/);
  74  |   });
  75  | 
  76  |   test('API - User Registration via REST', async () => {
  77  |     const response = await fetch(`${API_URL}/auth/register`, {
  78  |       method: 'POST',
  79  |       headers: { 'Content-Type': 'application/json' },
  80  |       body: JSON.stringify({
  81  |         email: `api-test${Date.now()}@example.com`,
  82  |         password: 'TestPassword123!',
  83  |         confirmPassword: 'TestPassword123!',
  84  |         name: 'Test User',
  85  |       }),
  86  |     });
  87  | 
  88  |     expect(response.status).toBe(201);
  89  |     const data = await response.json();
  90  |     expect(data.success).toBe(true);
  91  |     expect(data.user?.email).toBeTruthy();
  92  |     expect(data.user?.id).toBeTruthy();
  93  |     expect(data.message).toContain('Conta criada');
  94  | 
  95  |     const setCookieHeader = response.headers.get('set-cookie') ?? '';
  96  |     expect(setCookieHeader).toContain('token=');
  97  |   });
  98  | 
  99  |   test('API - Get Products with filters', async () => {
  100 |     const response = await fetch(
  101 |       `${API_URL}/products?page=1&limit=10&sortBy=createdAt&order=desc`,
  102 |       { method: 'GET' }
  103 |     );
  104 | 
  105 |     expect(response.status).toBe(200);
  106 |     const data = await response.json();
  107 |     expect(data.success).toBe(true);
  108 |     expect(Array.isArray(data.data)).toBe(true);
  109 |   });
  110 | 
  111 |   test('Admin Dashboard Access', async ({ page }) => {
  112 |     // Login as admin
  113 |     await page.goto(`${FRONTEND_URL}/auth/login`);
  114 |     await page.waitForSelector('input[name="email"]', { state: 'visible', timeout: 15000 });
  115 |     await page.fill('input[name="email"]', 'admin@tranzor.pt');
  116 |     await page.fill('input[name="password"]', 'ChangeMe123!');
  117 |     await page.click('button[type="submit"]');
  118 |     await page.waitForLoadState('networkidle');
  119 |     
  120 |     // Navigate to admin
  121 |     await page.goto(`${FRONTEND_URL}/admin`, { waitUntil: 'networkidle' });
  122 |     
  123 |     // Verify admin dashboard is visible
```