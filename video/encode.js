// encode.js — assemble les images capturées en MP4 4K 60 fps (+ version 1080p + poster)
// Prérequis : ffmpeg avec libx264 (décompressé dans %TEMP%\opencode\ffmpeg)
// > node video/encode.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FRAMES = path.join(process.env.TEMP || '/tmp', 'opencode', 'frames');
const FFMPEG = path.join(process.env.TEMP || '/tmp', 'opencode', 'ffmpeg', 'ffmpeg-9.0.2-essentials_build', 'bin', 'ffmpeg.exe');
const OUT = path.join(__dirname, 'out');
const FPS = 60, DUR = 80;

fs.mkdirSync(OUT, { recursive: true });
if (!fs.existsSync(FFMPEG)) { console.error('ffmpeg introuvable :', FFMPEG); process.exit(1); }
const run = cmd => { console.log('>', cmd.slice(0, 160) + '…'); execSync(cmd, { stdio: ['ignore', 'ignore', 'inherit'] }); };

/* 1) master 4K 60 fps */
const mp4 = path.join(OUT, 'Shift180-teaser-4K60.mp4');
run(`"${FFMPEG}" -y -f image2 -framerate ${FPS} -i "${path.join(FRAMES, 'f%06d.jpg')}" -frames:v ${DUR * FPS} -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p -movflags +faststart "${mp4}"`);

/* 2) poster (miniature) — frame à t=62s (compteur 180 + badge validé) */
run(`"${FFMPEG}" -y -i "${mp4}" -ss 62 -frames:v 1 -q:v 2 "${path.join(OUT, 'Shift180-teaser-poster.jpg')}"`);

/* 3) version légère 1080p 60 fps (partage rapide) */
run(`"${FFMPEG}" -y -i "${mp4}" -vf scale=1920:1080:flags=lanczos -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -movflags +faststart "${path.join(OUT, 'Shift180-teaser-1080p60.mp4')}"`);

for (const f of fs.readdirSync(OUT)) {
  const s = fs.statSync(path.join(OUT, f));
  console.log((s.size / 1048576).toFixed(1) + ' Mo', '·', f);
}
console.log('ENCODAGE OK →', OUT);
