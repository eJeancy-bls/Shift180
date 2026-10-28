// test-flux-index.js — accueil : clic carte → choix mode → bouton Commencer → start.html
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8642/', { waitUntil: 'networkidle' });
  const card = p.locator('#modeRail .mode-card').first();
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await p.waitForTimeout(500);
  console.log('modeChoice:', await p.evaluate(() => localStorage.getItem('pbd.modeChoice')));
  console.log('strip:', await p.evaluate(() => document.querySelector('#chosenTxt').textContent));
  await p.locator('#startBtn').click();
  await p.waitForTimeout(600);
  console.log('arrivée:', p.url());
  const on = await p.evaluate(() => {
    const a = document.querySelector('.seg button[aria-pressed="true"], .seg button.active');
    return a ? a.textContent.trim() : '(?)';
  });
  console.log('segment actif sur start:', on);
  await p.screenshot({ path: '.impeccable/review/start-from-index-mobile.png' });
  await b.close();
})();
