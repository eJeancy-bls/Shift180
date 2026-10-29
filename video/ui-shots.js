// ui-shots.js — captures 4K des pages de la plateforme pour la vidéo
// > node .devserver.js (port 8642) puis : node video/ui-shots.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = 'http://localhost:8642';
const OUT = path.join(__dirname, 'assets');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 2,            // rendu net 3200×1800 (retina)
  });
  const page = await ctx.newPage();
  const progress = {};
  for (let i = 1; i <= 43; i++) progress[i] = '2020-01-0' + (1 + (i % 9));
  const seed = pr => localStorage.setItem('pbd.state.v2', JSON.stringify({ progress: pr, pending: {} }));
  const fakeAuth = () => {
    const ta = document.getElementById('topbarAuth');
    if (ta) ta.innerHTML = '<a class="chip-btn small auth-me"><span class="ava ava-letter">E</span><b>Emmanuel</b></a>';
  };

  const shot = async (file, url, opts = {}) => {
    await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(opts.wait || 1600);
    if (opts.seed) await page.evaluate(seed, opts.seed);
    if (opts.seed || opts.theme) await page.reload({ waitUntil: 'domcontentloaded' });
    if (opts.seed || opts.theme) await page.waitForTimeout(opts.wait || 1600);
    if (opts.theme) await page.evaluate(t => localStorage.setItem('pbd.theme', t), opts.theme);
    if (opts.seed || opts.theme) await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(opts.wait || 1800);
    await page.evaluate(fakeAuth);
    if (opts.fill) await page.evaluate(v => { const ed = document.querySelector('#ed'); if (ed) ed.value = v; }, opts.fill);
    if (opts.click) { await page.click(opts.click); await page.waitForTimeout(opts.clickWait || 1500); }
    if (opts.edHeight) await page.evaluate(h => { const ed = document.querySelector('#ed'); if (ed) ed.style.height = h + 'px'; }, opts.edHeight);
    if (opts.sel) {
      await page.evaluate(s => {
        const e = document.querySelector(s);
        if (e) window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 70);
      }, opts.sel);
    }
    if (opts.scroll) await page.evaluate(y => window.scrollTo(0, y), opts.scroll || 0);
    await page.waitForTimeout(450);
    await page.screenshot({ type: 'jpeg', quality: 92, path: path.join(OUT, file) });
    console.log('✓', file);
  };

  const seedDay = (() => { const p = {}; for (let i = 1; i <= 11; i++) p[i] = '2020-01-01'; return p; })();

  await shot('home.jpg', '/index.html');
  await shot('start.jpg', '/start.html');
  await shot('login.jpg', '/login.html');
  await shot('board-light.jpg', '/app.html', { seed: progress });
  await shot('board-dark.jpg', '/app.html', { seed: progress, theme: 'dark' });
  await shot('day.jpg', '/day.html?d=12', { seed: seedDay, theme: 'light' });
  // console : code exécuté (aperçu + sortie console visibles)
  await shot('day-console.jpg', '/day.html?d=12', {
    seed: seedDay, theme: 'dark',
    fill: '<div style="display:flex; gap:12px; justify-content:center">\n  <span style="background:#e6e1f9; padding:10px 22px; border-radius:12px">A</span>\n  <span style="background:#d5ecd9; padding:10px 22px; border-radius:12px">B</span>\n  <span style="background:#ffe3c2; padding:10px 22px; border-radius:12px">C</span>\n</div>\n<script>console.log("Flexbox : 3 boîtes alignées — jour 12 validé");<\/script>',
    click: '#run', clickWait: 1800, edHeight: 230, sel: '#ed'
  });
  // vidéos : lecteur YouTube ouvert dans le panneau
  await shot('videos.jpg', '/day.html?d=12', { seed: seedDay, theme: 'dark', click: '.yt-pill', clickWait: 5000, sel: '.vidpan' });
  await shot('credits.jpg', '/credits.html');

  await browser.close();
  console.log('Captures OK →', OUT);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
