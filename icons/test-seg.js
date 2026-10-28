// test-seg.js — start.html : tabs offline/online
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8642/start.html#m=offline', { waitUntil: 'networkidle' });
  let [sel, panel] = await p.evaluate(() => [
    document.querySelector('.seg button[aria-selected="true"]').textContent.trim(),
    document.querySelector('#panelOnline').hidden,
  ]);
  console.log('tab actif:', sel, '| panelOnline caché:', panel);
  await p.locator('#tabOnline').click();
  await p.waitForTimeout(400);
  [sel, panel] = await p.evaluate(() => [
    document.querySelector('.seg button[aria-selected="true"]').textContent.trim(),
    document.querySelector('#panelOnline').hidden,
  ]);
  console.log('après clic →', sel, '| panelOnline caché:', panel);
  await p.screenshot({ path: '.impeccable/review/start-online-mobile.png' });
  await b.close();
})();
