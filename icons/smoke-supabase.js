// smoke-supabase.js — vérifie que login.html détecte le backend branché
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 844 } })).newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  await page.goto('http://localhost:8642/login.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const txt = await page.evaluate(() => document.body.innerText);
  const wired = !txt.includes('Synchronisation à brancher');
  const btns = await page.evaluate(() => [...document.querySelectorAll('button, a')].map(b => b.innerText.trim()).filter(t => t && t.length < 40));
  console.log('Backend détecté par la page :', wired ? 'OUI ✅' : 'NON ❌ (badge « Synchronisation à brancher » encore visible)');
  console.log('Boutons visibles :', JSON.stringify(btns));
  await page.screenshot({ path: '.impeccable/review/smoke-login-supabase.png', fullPage: true });
  console.log(errs.length ? 'ERREURS: ' + errs.join(' | ') : 'Zéro erreur JS ✅');
  await browser.close();
})();
