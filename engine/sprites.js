// Sprites: draws the Kenney characters from their sheets (see data/characters.js).
(function () {
  const CH = MS.data.characters;
  const F = CH.frame;
  const sheets = {};

  const sheet = (c) => {
    if (!sheets[c.id]) { const im = new Image(); im.src = c.sheet; sheets[c.id] = im; }
    return sheets[c.id];
  };
  const cell = (pose) => {
    const i = Math.max(0, CH.poses.indexOf(pose));
    return { x: (i % F.cols) * F.w, y: Math.floor(i / F.cols) * F.h };
  };

  MS.sprites = {
    // preload every sheet so the first frame isn't empty
    preload() { CH.players.concat(CH.guide).forEach(sheet); },

    // Draw character `c` (an entry of players / guide) with its feet at (x, y).
    //   o.h: height in game pixels (default 160) · o.flip: face left · o.crop: 0..1 of the frame from the top
    draw(g, c, pose, x, y, o) {
      o = o || {};
      const im = sheet(c);
      if (!im.complete || !im.naturalWidth) return;
      const h = o.h || 160, w = (h * F.w) / F.h, crop = o.crop || 1;
      const p = cell(pose);
      g.save();
      g.translate(x, y);
      if (o.flip) g.scale(-1, 1);
      g.drawImage(im, p.x, p.y, F.w, F.h * crop, -w / 2, -h, w, h * crop);
      g.restore();
    },

    // pose for a walk cycle at time t (seconds)
    walk: (t, fps) => "walk" + (Math.floor(t * (fps || 12)) % 8),
    cheer: (t) => (Math.floor(t * 5) % 2 ? "cheer1" : "cheer0"),

    // An HTML element showing one pose (for the home page). size = height in CSS px.
    html(c, pose, size, cls) {
      const h = size, w = (size * F.w) / F.h, s = h / F.h;
      const p = cell(pose);
      const rows = Math.ceil(CH.poses.length / F.cols);
      return `<span class="sprite ${cls || ""}" role="img" aria-label="${MS.ui.esc(c.name)}" style="width:${w}px;height:${h}px;` +
        `background-image:url('${c.sheet}');background-size:${F.cols * F.w * s}px ${rows * F.h * s}px;` +
        `background-position:-${p.x * s}px -${p.y * s}px"></span>`;
    },
  };
})();
