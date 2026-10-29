// render.js — capture image par image (déterministe) puis assemblage via ffmpeg
// > node video/render.js [--fps 60] [--dur 24] [--t-end 12] (t-end : capture partielle pour test)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const FPS = Number((process.argv.includes('--fps') && process.argv[process.argv.indexOf('--fps') + 1]) || 60);
const DUR = Number((process.argv.includes('--dur') && process.argv[process.argv.indexOf('--dur') + 1]) || 24);
const T_END = Number((process.argv.includes('--t-end') && process.argv[process.argv.indexOf('--t-end') + 1]) || DUR);
const FRAMES = path.join(process.env.TEMP || '/tmp', 'opencode', 'frames');
const SCENE = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
const N = Math.round(T_END * FPS);

(async () => {
  fs.rmSync(FRAMES, { recursive: true, force: true });
  fs.mkdirSync(FRAMES, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 3840, height: 2160 } });
  const t0 = Date.now();
  await page.goto(SCENE, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  /* ---- validation numérique avant capture ---- */
  const check = await page.evaluate(() => {
    const bad = [];
    for (const t of [0.2, 1.5, 5, 8, 12, 15, 18, 22.5]) {
      window.__seek(t);
      document.querySelectorAll('#world *').forEach(n => {
        const tr = n.style && n.style.transform;
        if (tr && /nan|undefined/.test(tr)) bad.push(t + ' → ' + (n.id || n.className) + ' ' + tr);
      });
    }
    window.__seek(18);
    const cnt = document.getElementById('cnt').textContent;
    window.__seek(0.001);
    return { bad: bad.slice(0, 6), cnt18: cnt, tiles: document.querySelectorAll('.tile').length, lines: document.querySelectorAll('#lines line').length };
  });
  console.log('VALIDATION ·', JSON.stringify(check));
  if (check.bad.length || check.tiles !== 11 || check.lines !== 10 || check.cnt18 === '') {
    console.error('Échec validation — arrêt.'); await browser.close(); process.exit(1);
  }

  /* ---- capture ---- */
  let last = Date.now();
  for (let f = 0; f < N; f++) {
    const t = f / FPS;
    await page.evaluate(tt => window.__seek(tt), t);
    await page.screenshot({ type: 'jpeg', quality: 90, path: path.join(FRAMES, 'f' + String(f).padStart(6, '0') + '.jpg'), animations: 'disabled' });
    if (f % 120 === 0) {
      const dt = (Date.now() - last) / 120 / 1000;
      last = Date.now();
      const remain = ((N - f) * dt / 60).toFixed(1);
      console.log(`frame ${f}/${N} · ${dt.toFixed(2)}s/img · reste ≈ ${remain} min`);
    }
  }
  await browser.close();
  console.log('CAPTURE OK ·', N, 'images →', FRAMES, '·', ((Date.now() - t0) / 60000).toFixed(1), 'min');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
