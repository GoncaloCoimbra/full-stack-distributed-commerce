const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const urls = ['http://localhost:5174/auth/register', 'http://localhost:5174/auth/login', 'http://localhost:5174/shop/enhanced'];
  for (const url of urls) {
    console.log('URL=', url);
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log('PAGE URL:', page.url());
    for (const selector of ['input[name="email"]', 'input[name="name"]', 'input[name="password"]', 'input[name="confirmPassword"]', 'input[id="lf-email"]']) {
      const count = await page.locator(selector).count();
      console.log(selector, count);
    }
    const titles = await page.locator('h1').allTextContents();
    console.log('h1 texts:', titles);
    const html = await page.content();
    console.log('content length', html.length);
    console.log('---');
  }
  await browser.close();
})();
