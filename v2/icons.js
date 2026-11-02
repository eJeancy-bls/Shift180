// v2/icons.js — bibliothèque d'icônes standard (style Lucide, stroke-width 2, inline SVG zéro dépendance)
// Usage : <span data-icon="home" data-size="24"></span> puis mountIcons()
const V2_ICONS = {
  'home': `<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>`,
  'book-open': `<path d="M12 6.5C9.5 4.5 6 4 2 4v14c4 0 7.5.5 10 2.5 2.5-2 6-2.5 10-2.5V4c-4 0-7.5.5-10 2.5zM12 6.5V21"/>`,
  'user-round': `<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>`,
  'play': `<path d="M6 4l14 8-14 8z"/>`,
  'share': `<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>`,
  'wifi': `<path d="M5 12.5a15 15 0 0 1 14 0"/><path d="M8.5 16a9 9 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>`,
  'wifi-off': `<path d="M5 12.5a15 15 0 0 1 11-1.5"/><path d="m3 3 18 18"/><path d="M8.5 16a9 9 0 0 1 6-1"/><circle cx="12" cy="19.5" r="1"/>`,
  'magnet': `<path d="M6 3v8a6 6 0 0 0 12 0V3"/><path d="M6 3h4v4H6zM14 3h4v4h-4z"/>`,
  'lock': `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
  'clock': `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  'check': `<path d="M20 6 9 17l-5-5"/>`,
  'arrow-left': `<path d="M19 12H5M12 19l-7-7 7-7"/>`,
  'send': `<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>`
};
function mountIcons(root) {
  (root || document).querySelectorAll('[data-icon]').forEach(el => {
    const path = V2_ICONS[el.dataset.icon];
    if (!path) return;
    const size = el.dataset.size || 24;
    el.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  });
}
window.mountIcons = mountIcons;
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => mountIcons());
else mountIcons();

