const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const urls = ['http://localhost:5174/auth/register', 'http://localhost:5174/auth/login', 'http://localhost:5174/shop/enhanced'];
  for (const url of urls) {
    console.log('URL=', url);
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log('PAGE URL:', page.url());
    const email = page.locator('input[name="email"]');
    console.log('email count', await email.count());
    if (await email.count() > 0) {
      console.log('email visible', await email.first().isVisible());
      console.log('email enabled', await email.first().isEnabled());
      console.log('email editable', await email.first().isEditable());
      console.log('email style', await page.evaluate(el => window.getComputedStyle(el).cssText, await email.first().elementHandle()));
      console.log('email outerHTML', await page.evaluate(el => el.outerHTML, await email.first().elementHandle()));
    }
    const productCard = page.locator('[data-testid="product-card"]');
    console.log('product-card count', await productCard.count());
    if (await productCard.count() > 0) {
      console.log('product-card visible', await productCard.first().isVisible());
      console.log('product-card outerHTML', await page.evaluate(el => el.outerHTML, await productCard.first().elementHandle()));
    }
    console.log('h1 texts', await page.locator('h1').allTextContents());
    console.log('---');
  }
  await browser.close();
})();
