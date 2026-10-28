// sw.js — PWA service worker : app-shell cache-first (marche hors ligne), stale-while-revalidate pour les CDN
const V = 'pbd-v3';   // v3 : leçons 1-60 actualisées (source « Chapitre I WEB » + banque d'exercices chaînes)
const SHELL = [
  'index.html', 'app.html', 'day.html', 'start.html', 'login.html', 'credits.html',
  'style.css', 'core.js', 'app.js', 'day.js', 'data.js', 'figures.js', 'config.js', 'login.js',
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

  // CDNs : stale-while-revalidate (permet le mode hors ligne après 1re visite en ligne)
  if (url.origin !== location.origin) {
    e.respondWith((async () => {
      const c = await caches.open(V);
      const hit = await c.match(e.request);
      const net = fetch(e.request).then(r => { c.put(e.request, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })());
    return;
  }

  // App shell : cache-first (instant, hors ligne)
  e.respondWith((async () => {
    const c = await caches.open(V);
    const hit = await c.match(e.request, { ignoreSearch: true });
    if (hit) {
      fetch(e.request).then(r => c.put(e.request, r.clone())).catch(() => {});
      return hit;
    }
    const net = await fetch(e.request).catch(() => null);
    if (net) { c.put(e.request, net.clone()); return net; }
    if (e.request.destination === 'document') {
      return (await c.match('app.html')) || (await c.match('index.html'));
    }
    return new Response('', { status: 504 });
  })());
});
