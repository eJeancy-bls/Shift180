// install.js — PWA : popup d'installation (1re visite) + bouton permanent (compte)
(function () {
  const KEY = 'pbd.install.dismissed';
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  }

  function platform() {
    const ua = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
    if (/Android/.test(ua)) return 'android';
    if (/Mac/.test(ua)) return 'mac';
    if (/Win/.test(ua)) return 'windows';
    if (/Linux/.test(ua)) return 'linux';
    return 'other';
  }

  function instructions() {
    const p = platform();
    if (p === 'ios') return "Sur iPhone/iPad : touche le bouton Partager (carré avec flèche) puis « Sur l'écran d'accueil ».";
    if (p === 'android') return "Sur Android : menu ⋮ puis « Installer l'application » ou « Ajouter à l'écran d'accueil ».";
    if (p === 'mac') return "Sur Mac (Safari) : menu Partage → « Ajouter au Dock ». Sur Chrome/Edge : icône d'installation dans la barre d'adresse.";
    if (p === 'windows') return "Sur Windows (Chrome/Edge) : icône d'installation dans la barre d'adresse, ou menu ⋮ → « Installer Shift180 ».";
    if (p === 'linux') return "Sur Linux (Chrome/Edge) : menu ⋮ → « Installer Shift180 ».";
    return "Utilise le menu de ton navigateur pour « Installer » ou « Ajouter à l'écran d'accueil ».";
  }

  function buildModal() {
    const wrap = document.createElement('div');
    wrap.className = 'install-modal';
    wrap.innerHTML = `
      <div class="install-card">
        <h2>📲 Installer Shift180</h2>
        <p>Accède à la plateforme comme une vraie app, même hors ligne, depuis ton écran d'accueil.</p>
        <div class="install-actions">
          <button class="btn mint" id="installNow">Installer maintenant</button>
          <button class="btn btn-ghost" id="installLater">Plus tard</button>
        </div>
        <p class="install-hint">${instructions()}</p>
      </div>`;
    document.body.appendChild(wrap);
    const now = wrap.querySelector('#installNow');
    now.onclick = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        wrap.remove();
      } else {
        alert(instructions());
      }
    };
    wrap.querySelector('#installLater').onclick = () => {
      localStorage.setItem(KEY, '1');
      wrap.remove();
    };
    return wrap;
  }

  window.PWAInstall = {
    open() { if (!isStandalone()) buildModal(); },
    canPrompt() { return !!deferredPrompt; }
  };

  // Popup à la première visite
  window.addEventListener('load', () => {
    if (isStandalone()) return;
    if (localStorage.getItem(KEY)) return;
    setTimeout(() => buildModal(), 1200);
    localStorage.setItem(KEY, '1');
  });
})();