# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin_cms.spec.ts >> Admin CMS basic checks >> Admin can access Content and Coupons pages
- Location: tests\admin_cms.spec.ts:70:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('h1.adm-title') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - main [ref=e4]:
    - generic [ref=e5]:
      - main [ref=e6]:
        - generic [ref=e7]:
          - complementary [ref=e8]:
            - generic [ref=e9]:
              - link [ref=e10] [cursor=pointer]:
                - /url: /
              - generic [ref=e12]:
                - generic [ref=e13]: Welcome back
                - heading [level=1] [ref=e14]: Your account. Your office. Your office..
                - paragraph [ref=e15]: Access your Tranzor account and manage orders, invoices and shopping lists in one click.
              - list [ref=e16]:
                - listitem [ref=e17]:
                  - generic [ref=e23]: Rastreio de encomendas em tempo real
                - listitem [ref=e24]:
                  - generic [ref=e28]: Pontos de fidelidade em cada compra
                - listitem [ref=e29]:
                  - generic [ref=e33]: Lista de favoritos e histórico de compras
                - listitem [ref=e34]:
                  - generic [ref=e39]: Reposição rápida de pedidos anteriores
              - generic [ref=e40]: Tranzor · Loja de exemplo · Portugal
          - main [ref=e41]:
            - generic [ref=e42]:
              - generic [ref=e43]:
                - paragraph [ref=e44]: — Client area
                - heading "Sign in" [level=2] [ref=e45]
                - paragraph [ref=e46]:
                  - text: New customer?
                  - link "Create a free account →" [ref=e47] [cursor=pointer]:
                    - /url: /auth/register
              - generic [ref=e48]:
                - generic [ref=e49]:
                  - generic [ref=e50]: Email
                  - textbox "Email" [ref=e52]:
                    - /placeholder: your@email.com
                - generic [ref=e53]:
                  - generic [ref=e54]:
                    - generic [ref=e55]: Password
                    - link "Forgot?" [ref=e56] [cursor=pointer]:
                      - /url: /auth/forgot
                  - generic [ref=e57]:
                    - textbox "Password" [ref=e58]:
                      - /placeholder: ••••••••
                    - button "Show password" [ref=e59] [cursor=pointer]
                - button "Sign in" [disabled] [ref=e63]
              - generic [ref=e67]: ou
              - link "Business / B2B access" [ref=e68] [cursor=pointer]:
                - /url: /auth/b2b
              - paragraph [ref=e71]:
                - text: By signing in, you agree to our
                - link "Terms" [ref=e72] [cursor=pointer]:
                  - /url: /terms
                - text: e
                - link "Privacy Policy" [ref=e73] [cursor=pointer]:
                  - /url: /privacy
                - text: .
      - dialog "Cookie consent" [ref=e74]:
        - generic [ref=e81]:
          - paragraph [ref=e82]: This site uses cookies
          - paragraph [ref=e83]:
            - text: We use essential cookies and, with your permission, analytics to improve the experience.
            - link "Learn more" [ref=e84] [cursor=pointer]:
              - /url: /cookies
        - generic [ref=e85]:
          - button "Reject" [ref=e86] [cursor=pointer]
          - button "Accept cookies" [ref=e87] [cursor=pointer]
  - dialog "Cookie consent" [ref=e88]:
    - generic [ref=e95]:
      - paragraph [ref=e96]: This site uses cookies
      - paragraph [ref=e97]:
        - text: We use essential cookies and, with your permission, analytics to improve the experience.
        - link "Learn more" [ref=e98] [cursor=pointer]:
          - /url: /cookies
    - generic [ref=e99]:
      - button "Reject" [ref=e100] [cursor=pointer]
      - button "Accept cookies" [ref=e101] [cursor=pointer]
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
  14 |     role: 'admin'
  15 |   };
  16 | 
  17 |   const response = await page.request.post(`${API_URL}/auth/register`, {
  18 |     headers: { 'Content-Type': 'application/json' },
  19 |     data: JSON.stringify(payload),
  20 |   });
  21 | 
  22 |   if (response.status() === 201 || response.status() === 409) {
  23 |     return;
  24 |   }
  25 | 
  26 |   const body = await response.text();
  27 |   throw new Error(`Failed to ensure admin user: ${response.status()} ${body}`);
  28 | }
  29 | 
  30 | async function signInAdminWithCookie(page: Parameters<typeof test>[0]['page']) {
  31 |   const payload = {
  32 |     email: ADMIN_EMAIL,
  33 |     password: ADMIN_PASSWORD,
  34 |   };
  35 | 
  36 |   const response = await page.request.post(`${API_URL}/auth/login`, {
  37 |     headers: { 'Content-Type': 'application/json' },
  38 |     data: JSON.stringify(payload),
  39 |   });
  40 | 
  41 |   if (response.status() !== 200) {
  42 |     const body = await response.text();
  43 |     throw new Error(`Admin login failed: ${response.status()} ${body}`);
  44 |   }
  45 | 
  46 |   const setCookie = response.headers()['set-cookie'];
  47 |   if (!setCookie) {
  48 |     throw new Error('No auth cookie returned from backend login');
  49 |   }
  50 | 
  51 |   const tokenMatch = /token=([^;]+)/.exec(setCookie);
  52 |   if (!tokenMatch) {
  53 |     throw new Error('Failed to parse auth token from set-cookie header');
  54 |   }
  55 | 
  56 |   await page.context().addCookies([
  57 |     {
  58 |       name: 'token',
  59 |       value: tokenMatch[1],
  60 |       domain: 'localhost',
  61 |       path: '/',
  62 |       httpOnly: true,
  63 |       sameSite: 'Lax',
  64 |       secure: false,
  65 |     },
  66 |   ]);
  67 | }
  68 | 
  69 | test.describe('Admin CMS basic checks', () => {
  70 |   test('Admin can access Content and Coupons pages', async ({ page }) => {
  71 |     await ensureAdminUser(page);
  72 |     await signInAdminWithCookie(page);
  73 | 
  74 |     await page.goto(`${FRONTEND_URL}/admin/content`, { waitUntil: 'networkidle' });
> 75 |     await page.waitForSelector('h1.adm-title', { state: 'visible', timeout: 15000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  76 |     await expect(page.locator('h1.adm-title')).toHaveText(/Gestão de conteúdos/i);
  77 | 
  78 |     await page.goto(`${FRONTEND_URL}/admin/coupons`, { waitUntil: 'networkidle' });
  79 |     await page.waitForSelector('h1.adm-title', { state: 'visible', timeout: 15000 });
  80 |     await expect(page.locator('h1.adm-title')).toHaveText(/Cupões de desconto/i);
  81 |   });
  82 | });
  83 | 
```