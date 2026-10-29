// still.js — export d'images fixes (PNG sans perte) de la scène à des instants donnés
// > node video/still.js "22:Shift180-teaser-fin-22s.png" "23.5:Shift180-teaser-finale.png"
// Format "temps:nom" ; les fichiers sont écrits dans video/out/
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'out');
const SCENE = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
const shots = process.argv.slice(2).map(s => {
  const [t, name] = s.split(':');
  return { t: Number(t), out: path.join(OUT, name) };
});
if (!shots.length || shots.some(s => !s.out || Number.isNaN(s.t))) {
  console.error('Usage : node video/still.js "22:image.png" "23.5:image2.png"');
  process.exit(1);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 3840, height: 2160 } });
  await page.goto(SCENE, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  for (const { t, out } of shots) {
    await page.evaluate(tt => window.__seek(tt), t);
    await page.screenshot({ type: 'png', path: out, animations: 'disabled' });
    console.log('OK', t + 's →', out);
  }
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
