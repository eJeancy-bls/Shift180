// Vérifie en masse les vidéos : node yt-verify.js id1 id2 ...
const ids = process.argv.slice(2);
(async () => {
  for (const id of ids) {
    try {
      const r = await fetch('https://www.youtube.com/oembed?url=https%3A//www.youtube.com/watch%3Fv%3D' + id + '&format=json');
      if (!r.ok) { console.log(id, '· ERREUR HTTP', r.status); continue; }
      const j = await r.json();
      console.log(id, '·', j.author_name, '·', j.title);
    } catch (e) { console.log(id, '· ERR', e.message); }
  }
})();
