// .devserver.js — mini serveur statique de vérification (dev only)
const http = require('http'), fs = require('fs'), path = require('path');
const root = process.cwd();
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
http.createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(root, p);
  fs.readFile(f, (e, d) => {
    if (e) { s.writeHead(404); s.end('404'); }
    else { s.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' }); s.end(d); }
  });
}).listen(8642, () => console.log('up on 8642'));
