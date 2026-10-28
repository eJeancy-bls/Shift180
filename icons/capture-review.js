// Vérification visuelle : accueil, start (2 modes), app (mobile replié), day (jour 1), login
// > node icons/capture-review.js
const { chromium } = require('playwright');
(async () => {
  const base = 'http://localhost:8642';
  const shots = [
    ['index-desktop.png', 'index.html', { width: 1440, height: 900 }],
    ['index-mobile.png', 'index.html', { width: 390, height: 844 }],
    ['start-offline-desktop.png', 'start.html#m=offline', { width: 1440, height: 900 }],
    ['start-offline-mobile.png', 'start.html#m=offline', { width: 390, height: 844 }],
    ['start-online-desktop.png', 'start.html#m=online', { width: 1440, height: 900 }],
    ['login-mobile.png', 'login.html', { width: 390, height: 844 }],
    ['day-j1-desktop.png', 'day.html?d=1', { width: 1440, height: 900 }],
    ['day-j1-mobile.png', 'day.html?d=1', { width: 390, height: 844 }],
    ['app-mobile.png', 'app.html', { width: 390, height: 844 }],
    ['app-desktop.png', 'app.html', { width: 1440, height: 900 }],
  ];
  const browser = await chromium.launch();
  for (const [name, path, vp] of shots) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    await page.goto(base + '/' + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: '.impeccable/review/' + name, fullPage: true });
    await ctx.close();
  }
  // app mobile attention : attendre 3.5 s pour la grille repliée
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(base + '/app.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3600);
  await p.screenshot({ path: '.impeccable/review/app-mobile-collapsed.png', fullPage: true });
  await ctx.close();
  await browser.close();
  console.log('captures ok');
})();
