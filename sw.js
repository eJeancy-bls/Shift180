// sw.js — PWA service worker : network-first pour les pages (toujours frais), cache-first pour les assets, hors ligne géré
const V = 'pbd-v13';   // v13 : pastilles vidéo YouTube (Grafikart/Graven) dans les pages de cours
const SHELL = [
  'index.html', 'app.html', 'day.html', 'start.html', 'login.html', 'credits.html',
  'style.css', 'core.js', 'app.js', 'day.js', 'data.js', 'figures.js', 'videos.js', 'config.js', 'login.js',
  'lessons-d1-15.js', 'lessons-d16-30.js', 'lessons-d31-45.js', 'lessons-d46-60.js',
  'manifest.webmanifest', 'icons/logo.svg',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png',
  'icons/icon-maskable-192.png', 'icons/icon-maskable-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await c.addAll(SHELL).catch(err => console.warn('[sw] precache partiel', err));
    self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // API Supabase : réseau d'abord, pas de cache des données privées
  if (/supabase\.co|supabase\.in/.test(url.host)) return;

  e.respondWith((async () => {
    const c = await caches.open(V);
    try {
      // CDNs : stale-while-revalidate
      if (url.origin !== location.origin) {
        const hit = await c.match(e.request);
        const net = fetch(e.request).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
        return hit || await net;
      }
      // Pages HTML : network-first (toujours frais en ligne, cache en secours hors ligne)
      const isDoc = e.request.destination === 'document' || (e.request.headers.get('accept') || '').includes('text/html');
      if (isDoc) {
        try {
          const net = await fetch(e.request);
          if (net && net.ok) c.put(e.request, net.clone());
          return net;
        } catch {
          const hit = await c.match(e.request, { ignoreSearch: true });
          return hit || await c.match('index.html');
        }
      }
      // Assets : cache-first (hors ligne), mise à jour en arrière-plan
      // Exception : core.js est critique pour la mise à jour auto -> network-first
      const isCore = url.pathname.endsWith('/core.js') || url.pathname === 'core.js';
      if (isCore) {
        try {
          const net = await fetch(e.request);
          if (net && net.ok) c.put(e.request, net.clone());
          return net;
        } catch {
          const hit = await c.match(e.request);
          if (hit) return hit;
        }
      }
      const hit = await c.match(e.request);
      if (hit) {
        fetch(e.request).then(r => { if (r && r.ok) c.put(e.request, r.clone()); }).catch(() => {});
        return hit;
      }
      const net = await fetch(e.request).catch(() => null);
      if (net && net.ok) { c.put(e.request, net.clone()); return net; }
      return new Response('', { status: 504 });
    } catch (err) {
      // Dernier recours : ne jamais renvoyer une page d'erreur brute
      if (e.request.destination === 'document') {
        const hit = await c.match('index.html');
        if (hit) return hit;
      }
      return new Response('', { status: 504 });
    }
  })());
});