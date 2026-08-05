# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin_cms.spec.ts >> Admin CMS basic checks >> Admin can access Content and Coupons pages
- Location: tests\admin_cms.spec.ts:54:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('h1.adm-title') to be visible

```

# Page snapshot

```yaml
- generic [ref=f3e3]:
  - main [ref=f3e4]:
    - generic [ref=f3e5]:
      - main [ref=f3e6]:
        - generic [ref=f3e7]:
          - complementary [ref=f3e8]:
            - generic [ref=f3e9]:
              - link [ref=f3e10] [cursor=pointer]:
                - /url: /
              - generic [ref=f3e12]:
                - generic [ref=f3e13]: Welcome back
                - heading [level=1] [ref=f3e14]: Your account. Your office. Your office..
                - paragraph [ref=f3e15]: Access your Tranzor account and manage orders, invoices and shopping lists in one click.
              - list [ref=f3e16]:
                - listitem [ref=f3e17]:
                  - generic [ref=f3e23]: Rastreio de encomendas em tempo real
                - listitem [ref=f3e24]:
                  - generic [ref=f3e28]: Pontos de fidelidade em cada compra
                - listitem [ref=f3e29]:
                  - generic [ref=f3e33]: Lista de favoritos e histórico de compras
                - listitem [ref=f3e34]:
                  - generic [ref=f3e39]: Reposição rápida de pedidos anteriores
              - generic [ref=f3e40]: Tranzor · Loja de exemplo · Portugal
          - main [ref=f3e41]:
            - generic [ref=f3e42]:
              - generic [ref=f3e43]:
                - paragraph [ref=f3e44]: — Client area
                - heading "Sign in" [level=2] [ref=f3e45]
                - paragraph [ref=f3e46]:
                  - text: New customer?
                  - link "Create a free account →" [ref=f3e47] [cursor=pointer]:
                    - /url: /auth/register
              - generic [ref=f3e48]:
                - generic [ref=f3e49]:
                  - generic [ref=f3e50]: Email
                  - textbox "Email" [ref=f3e52]:
                    - /placeholder: your@email.com
                - generic [ref=f3e53]:
                  - generic [ref=f3e54]:
                    - generic [ref=f3e55]: Password
                    - link "Forgot?" [ref=f3e56] [cursor=pointer]:
                      - /url: /auth/forgot
                  - generic [ref=f3e57]:
                    - textbox "Password" [ref=f3e58]:
                      - /placeholder: ••••••••
                    - button "Show password" [ref=f3e59] [cursor=pointer]
                - button "Sign in" [disabled] [ref=f3e63]
              - generic [ref=f3e67]: ou
              - link "Business / B2B access" [ref=f3e68] [cursor=pointer]:
                - /url: /auth/b2b
              - paragraph [ref=f3e71]:
                - text: By signing in, you agree to our
                - link "Terms" [ref=f3e72] [cursor=pointer]:
                  - /url: /terms
                - text: e
                - link "Privacy Policy" [ref=f3e73] [cursor=pointer]:
                  - /url: /privacy
                - text: .
      - dialog "Cookie consent" [ref=f3e74]:
        - generic [ref=f3e81]:
          - paragraph [ref=f3e82]: This site uses cookies
          - paragraph [ref=f3e83]:
            - text: We use essential cookies and, with your permission, analytics to improve the experience.
            - link "Learn more" [ref=f3e84] [cursor=pointer]:
              - /url: /cookies
        - generic [ref=f3e85]:
          - button "Reject" [ref=f3e86] [cursor=pointer]
          - button "Accept cookies" [ref=f3e87] [cursor=pointer]
  - dialog "Cookie consent" [ref=f3e88]:
    - generic [ref=f3e95]:
      - paragraph [ref=f3e96]: This site uses cookies
      - paragraph [ref=f3e97]:
        - text: We use essential cookies and, with your permission, analytics to improve the experience.
        - link "Learn more" [ref=f3e98] [cursor=pointer]:
          - /url: /cookies
    - generic [ref=f3e99]:
      - button "Reject" [ref=f3e100] [cursor=pointer]
      - button "Accept cookies" [ref=f3e101] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const FRONTEND_URL = 'http://localhost:5174';
  4  | const API_URL = 'http://localhost:3001/api/v1';
  5  | const ADMIN_EMAIL = 'admin@tranzor.pt';
  6  | const ADMIN_PASSWORD = 'ChangeMe123!';
  7  | 
  8  | async function ensureAdminUser(page: Parameters<typeof test>[0]['page']) {
  9  |   const payload = {
  10 |     name: 'Admin Test User',
  11 |     email: ADMIN_EMAIL,
  12 |     password: ADMIN_PASSWORD,
  13 |     confirmPassword: ADMIN_PASSWORD,
  14 |     role: 'admin',
  15 |     agreeTerms: true
  16 |   };
  17 | 
  18 |   const response = await page.request.post(`${API_URL}/auth/register`, {
  19 |     headers: { 'Content-Type': 'application/json' },
  20 |     data: JSON.stringify(payload),
  21 |   });
  22 | 
  23 |   if (response.status() === 201 || response.status() === 409) {
  24 |     return;
  25 |   }
  26 | 
  27 |   const body = await response.text();
  28 |   throw new Error(`Failed to ensure admin user: ${response.status()} ${body}`);
  29 | }
  30 | 
  31 | async function signInAdmin(page: Parameters<typeof test>[0]['page']) {
  32 |   const response = await page.request.post(`${API_URL}/auth/login`, {
  33 |     headers: { 'Content-Type': 'application/json' },
  34 |     data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  35 |   });
  36 | 
  37 |   expect(response.ok()).toBeTruthy();
  38 |   const body = await response.json();
  39 |   expect(body.success).toBeTruthy();
  40 |   expect(body.token).toBeTruthy();
  41 | 
  42 |   await page.goto(FRONTEND_URL, { waitUntil: 'domcontentloaded' });
  43 |   await page.evaluate((token) => {
  44 |     localStorage.setItem('auth_token', token);
  45 |   }, body.token);
  46 | 
  47 |   await page.reload({ waitUntil: 'networkidle' });
  48 |   await expect.poll(async () => page.evaluate(() => localStorage.getItem('auth_token'))).toBeTruthy();
  49 | 
  50 |   await page.goto(`${FRONTEND_URL}/admin/content`, { waitUntil: 'networkidle' });
  51 | }
  52 | 
  53 | test.describe('Admin CMS basic checks', () => {
  54 |   test('Admin can access Content and Coupons pages', async ({ page }) => {
  55 |     await ensureAdminUser(page);
  56 |     await signInAdmin(page);
  57 | 
  58 |     await page.goto(`${FRONTEND_URL}/admin/content`, { waitUntil: 'networkidle' });
> 59 |     await page.waitForSelector('h1.adm-title', { state: 'visible', timeout: 15000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  60 |     await expect(page.locator('h1.adm-title')).toHaveText(/Gestão de conteúdos/i);
  61 | 
  62 |     await page.goto(`${FRONTEND_URL}/admin/coupons`, { waitUntil: 'networkidle' });
  63 |     await page.waitForSelector('h1.adm-title', { state: 'visible', timeout: 15000 });
  64 |     await expect(page.locator('h1.adm-title')).toHaveText(/Cupões de desconto/i);
  65 |   });
  66 | });
  67 | 
```