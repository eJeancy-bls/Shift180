// Preview du logo : grande taille + simulation favicon à petite échelle
// > node icons/preview.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const svgAbs = path.resolve('icons/logo.svg').replace(/\\/g, '/');
  const html = `<html><body style="margin:0;background:#fbf6ed;font:12px 'Segoe UI',sans-serif;color:#3f3e52">
    <div style="display:flex;gap:16px;align-items:flex-end;padding:18px">
      <img src="${svgAbs}" style="width:120px;border-radius:24px;box-shadow:0 2px 4px rgba(63,62,82,.10),0 10px 24px -8px rgba(63,62,82,.22)">
      <img src="${svgAbs}" style="width:56px;border-radius:12px">
      <img src="${svgAbs}" style="width:34px;border-radius:8px">
      <img src="${svgAbs}" style="width:16px">
      <img src="${svgAbs}" style="width:32px">
    </div>
    <div style="text-align:center;padding:0 0 18px"><img src="${svgAbs}" style="width:220px;border-radius:44px"></div>
  </body></html>`;
  const file = path.resolve('icons/.preview.html');
  fs.writeFileSync(file, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 420, height: 330 } });
  await page.goto('file:///' + file.replace(/\\/g, '/'));
  await page.screenshot({ path: '.impeccable/review/logo-preview.png' });
  await browser.close();
  fs.unlinkSync(file);
  console.log('ok');
})();
