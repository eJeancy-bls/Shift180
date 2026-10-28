// test-standalone.js — parcours complet du fichier unique en file://
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const file = 'file:///' + path.resolve('dist/shift180-hors-ligne.html').replace(/\\/g, '/');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e.message || e)));
  await p.goto(file);
  await p.waitForTimeout(3600);
  console.log('repli:', await p.evaluate(() => document.querySelectorAll('#board .magnet.minor').length));
  await p.click('#board .magnet', { force: true });
  await p.waitForTimeout(700);
  console.log('jour:', JSON.stringify(await p.evaluate(() => ({
    title: document.querySelector('#dayTitle').textContent,
    figs: [...document.querySelectorAll('.fig-art svg')].length,
    terms: [...document.querySelectorAll('.term')].length,
    tasks: [...document.querySelectorAll('#tasks input')].length,
    ed: !!document.querySelector('#ed')
  }))));
  // déplier un terme du lexique
  await p.locator('.term').first().click();
  const def = await p.evaluate(() => { const d = document.querySelector('.term-def'); return { open: !d.hidden, txt: d.textContent.slice(0, 40) }; });
  console.log('lexique:', JSON.stringify(def));
  // cocher les TP et valider
  await p.evaluate(() => [...document.querySelectorAll('#tasks input')].forEach(b => { b.checked = true; b.onchange(); }));
  await p.waitForTimeout(200);
  await p.click('#ok');
  await p.waitForTimeout(900);
  console.log('progression J1:', await p.evaluate(() => JSON.parse(localStorage.getItem('pbd.state.v2') || '{}').progress['1']));
  console.log('retour tableau magnets:', await p.evaluate(() => document.querySelectorAll('#board .magnet').length));
  // éditeur + console
  await p.click('#board .magnet', { force: true });
  await p.waitForTimeout(400);
  await p.fill('#ed', 'console.log(2+3)');
  await p.click('#run');
  await p.waitForTimeout(400);
  console.log('console:', JSON.stringify(await p.evaluate(() => document.querySelector('#con').textContent)));
  // thème sombre
  await p.click('.theme-toggle');
  await p.click('.theme-pop button[data-t="dark"]');
  await p.waitForTimeout(350);
  console.log('thème:', await p.evaluate(() => document.documentElement.getAttribute('data-theme')));
  await p.screenshot({ path: '.impeccable/review/standalone-day1-dark.png' });
  console.log('erreurs JS:', errs.length ? errs.join(' | ') : 'aucune');
  await b.close();
})();
