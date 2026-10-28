// gen-icons.js — génère les PNG PWA depuis icons/logo.svg via Playwright (chromium)
// > node gen-icons.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const svgAbs = path.resolve('icons/logo.svg').replace(/\\/g, '/');
  const targets = [
    { size: 512, out: 'icons/icon-512.png', mask: false },
    { size: 192, out: 'icons/icon-192.png', mask: false },
    { size: 180, out: 'icons/icon-180.png', mask: false },
    { size: 512, out: 'icons/icon-maskable-512.png', mask: true },
    { size: 192, out: 'icons/icon-maskable-192.png', mask: true },
    { size: 64, out: 'icons/favicon-64.png', mask: false }
  ];
  const browser = await chromium.launch();
  for (const t of targets) {
    // maskable : le logo occupe seulement 72% du carré (zone sûre du masque Android)
    const inner = t.mask ? t.size * 0.72 : t.size;
    const bg = t.mask ? 'transparent' : '#fbf6ed';
    const html = `<html><body style="margin:0"><div style="width:${t.size}px;height:${t.size}px;display:grid;place-items:center;background:${bg}"><img src="file:///${svgAbs}" style="width:${inner}px"></div></body></html>`;
    const file = path.resolve('icons/.render.html');
    fs.writeFileSync(file, html);
    const page = await browser.newPage({ viewport: { width: t.size, height: t.size } });
    await page.goto('file:///' + file.replace(/\\/g, '/'));
    await page.screenshot({ path: t.out, omitBackground: t.mask });
    await page.close();
    fs.unlinkSync(file);
    console.log('wrote', t.out);
  }
  await browser.close();
})();
