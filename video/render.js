// render.js — capture image par image (déterministe) puis assemblage via ffmpeg
// > node video/render.js [--fps 60] [--dur 80] [--t-end 12] [--part i/n]
// --part i/n : capture le segment i sur n en parallèle (numérotation globale des
// frames, même dossier) — ex. 3 terminaux : --part 1/3, --part 2/3, --part 3/3
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const FPS = Number((process.argv.includes('--fps') && process.argv[process.argv.indexOf('--fps') + 1]) || 60);
const DUR = Number((process.argv.includes('--dur') && process.argv[process.argv.indexOf('--dur') + 1]) || 80);
const T_END = Number((process.argv.includes('--t-end') && process.argv[process.argv.indexOf('--t-end') + 1]) || DUR);
const PART = (process.argv.includes('--part') && process.argv[process.argv.indexOf('--part') + 1]) || '1/1';
const [PI, PN] = PART.split('/').map(Number);
if (!PI || !PN || PI < 1 || PI > PN) { console.error('--part invalide (ex. 2/3)'); process.exit(1); }
const FRAMES = path.join(process.env.TEMP || '/tmp', 'opencode', 'frames');
const SCENE = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
const TOTAL = Math.round(T_END * FPS);
const G0 = Math.floor(TOTAL * (PI - 1) / PN);
const G1 = Math.floor(TOTAL * PI / PN);
/* --f-start/--f-end : capture d'un sous-intervalle (rattrapage après
   interruption — les frames déjà écrites ne sont pas recapturées) */
const av = n => process.argv.includes(n) ? Number(process.argv[process.argv.indexOf(n) + 1]) : undefined;
const F0 = Math.max(G0, av('--f-start') ?? G0);
const F1 = Math.min(G1, av('--f-end') ?? G1);
const N = F1 - F0;
const TAG = PN > 1 ? `[part ${PI}/${PN}] ` : '';

(async () => {
  if (PI === 1) fs.rmSync(FRAMES, { recursive: true, force: true });
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
    for (const t of [1, 4, 8, 12, 18, 26, 34, 42, 47, 52, 60, 66, 75]) {
      window.__seek(t);
      document.querySelectorAll('#world *').forEach(n => {
        const tr = n.style && n.style.transform;
        if (tr && /nan|undefined/.test(tr)) bad.push(t + ' → ' + (n.id || n.className) + ' ' + tr);
      });
    }
    window.__seek(63);
    const cnt = document.getElementById('cnt').textContent;
    window.__seek(0.001);
    return { bad: bad.slice(0, 6), cnt63: cnt, tiles: document.querySelectorAll('.tile').length, lines: document.querySelectorAll('#lines line').length };
  });
  console.log(TAG + 'VALIDATION ·', JSON.stringify(check));
  if (check.bad.length || check.tiles !== 11 || check.lines !== 10 || check.cnt63 !== '180') {
    console.error(TAG + 'Échec validation — arrêt.'); await browser.close(); process.exit(1);
  }

  /* ---- capture ---- */
  let last = Date.now();
  for (let f = F0; f < F1; f++) {
    const t = f / FPS;
    await page.evaluate(tt => window.__seek(tt), t);
    /* double rAF avant capture : garantit que le compositeur a peint la frame
       (les calques transformés 4K sinon perdent des tuiles de raster) */
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.screenshot({ type: 'jpeg', quality: 90, path: path.join(FRAMES, 'f' + String(f).padStart(6, '0') + '.jpg'), animations: 'disabled' });
    if ((f - F0) % 120 === 0) {
      const dt = (Date.now() - last) / 120 / 1000;
      last = Date.now();
      const remain = ((F1 - f) * dt / 60).toFixed(1);
      console.log(TAG + `frame ${f}/${F1} · ${dt.toFixed(2)}s/img · reste ≈ ${remain} min`);
    }
  }
  await browser.close();
  console.log(TAG + 'CAPTURE OK ·', N, 'images [' + F0 + '..' + (F1 - 1) + '] →', FRAMES, '·', ((Date.now() - t0) / 60000).toFixed(1), 'min');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
