// Draw: text, shapes, buttons, photos, map props and the player sprite.
(function () {
  const C = MS.data.settings.colors;
  const FONT = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';
  const EMOJI = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
  const images = {};

  const D = (MS.draw = {
    FONT,

    rr(g, x, y, w, h, r, fill, stroke, lw) {
      g.beginPath();
      g.roundRect ? g.roundRect(x, y, w, h, r) : g.rect(x, y, w, h);
      if (fill) { g.fillStyle = fill; g.fill(); }
      if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw || 2; g.stroke(); }
    },

    text(g, str, x, y, o) {
      o = o || {};
      g.font = (o.bold ? "bold " : "") + (o.size || 16) + "px " + (o.emoji ? EMOJI : FONT);
      g.fillStyle = o.color || "#fff";
      g.textAlign = o.align || "left";
      g.textBaseline = o.baseline || "alphabetic";
      if (o.shadow) {
        g.fillStyle = o.shadow;
        g.fillText(str, x + 2, y + 2);
        g.fillStyle = o.color || "#fff";
      }
      g.fillText(str, x, y);
    },

    // Wrapped text. Returns the total height used.
    wrap(g, str, x, y, maxW, o) {
      o = o || {};
      const size = o.size || 16;
      const lh = o.lineHeight || size * 1.3;
      g.font = (o.bold ? "bold " : "") + size + "px " + FONT;
      const words = String(str).split(" ");
      const lines = [];
      let line = "";
      for (const w of words) {
        const test = line ? line + " " + w : w;
        if (g.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
      }
      if (line) lines.push(line);
      const startY = o.valign === "middle" ? y - ((lines.length - 1) * lh) / 2 : y;
      lines.forEach((l, i) => D.text(g, l, x, startY + i * lh, Object.assign({}, o, { baseline: o.baseline || "middle" })));
      return lines.length * lh;
    },

    // Clickable button. Returns true when clicked this frame.
    button(g, r, label, o) {
      o = o || {};
      const hover = MS.input.hover(r) && !o.disabled;
      const base = o.disabled ? "#9aa0a6" : o.color || C.accent;
      D.rr(g, r.x, r.y + (hover ? 0 : 3), r.w, r.h, 10, "rgba(0,0,0,0.25)");
      D.rr(g, r.x, r.y - (hover ? 2 : 0), r.w, r.h, 10, base, o.border || null, 3);
      D.wrap(g, label, r.x + r.w / 2, r.y + r.h / 2 - (hover ? 2 : 0), r.w - 16,
        { size: o.size || 18, bold: true, align: "center", valign: "middle", color: o.textColor || "#fff" });
      if (!o.disabled && MS.input.clickIn(r)) { MS.audio.play("click"); return true; }
      return false;
    },

    img(name) {
      if (!images[name]) {
        const im = new Image();
        im.src = "assets/photos/" + name;
        images[name] = im;
      }
      return images[name];
    },

    // Draw a photo cropped to fill the rect ("object-fit: cover").
    photo(g, name, x, y, w, h, radius) {
      const im = D.img(name);
      g.save();
      g.beginPath();
      g.roundRect ? g.roundRect(x, y, w, h, radius || 8) : g.rect(x, y, w, h);
      g.clip();
      if (im.complete && im.naturalWidth) {
        const s = Math.max(w / im.naturalWidth, h / im.naturalHeight);
        const iw = im.naturalWidth * s, ih = im.naturalHeight * s;
        g.drawImage(im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
      } else {
        g.fillStyle = "#444";
        g.fillRect(x, y, w, h);
      }
      g.restore();
    },

    panel(g, x, y, w, h) {
      D.rr(g, x + 4, y + 6, w, h, 16, "rgba(0,0,0,0.3)");
      D.rr(g, x, y, w, h, 16, C.ui, "rgba(255,255,255,0.15)", 2);
    },

    bar(g, x, y, w, h, t, color) {
      D.rr(g, x, y, w, h, h / 2, "rgba(255,255,255,0.15)");
      if (t > 0) D.rr(g, x, y, Math.max(h, w * MS.util.clamp(t, 0, 1)), h, h / 2, color || C.good);
    },

    hearts(g, x, y, n, max) {
      for (let i = 0; i < max; i++) D.text(g, i < n ? "❤️" : "🤍", x + i * 26, y, { size: 20, emoji: true });
    },

    // ------------------------------------------------------------------
    //  PLAYER — little top-down maker
    // ------------------------------------------------------------------
    player(g, x, y, dir, walkT, name) {
      const P = MS.data.settings.player;
      const bob = Math.sin(walkT * 14) * 2;
      g.fillStyle = "rgba(0,0,0,0.2)";
      g.beginPath(); g.ellipse(x, y + 14, 13, 5, 0, 0, Math.PI * 2); g.fill();
      // legs
      g.fillStyle = "#2b3a55";
      g.fillRect(x - 7, y + 4, 5, 10 + (walkT ? bob : 0));
      g.fillRect(x + 2, y + 4, 5, 10 - (walkT ? bob : 0));
      // body
      D.rr(g, x - 10, y - 10 + bob * 0.3, 20, 18, 6, P.shirtColor);
      // head
      g.fillStyle = P.skinColor;
      g.beginPath(); g.arc(x, y - 17 + bob * 0.3, 10, 0, Math.PI * 2); g.fill();
      // hair / beanie
      g.fillStyle = P.hairColor;
      g.beginPath(); g.arc(x, y - 19 + bob * 0.3, 10, Math.PI, 0); g.fill();
      // eyes (facing)
      if (dir !== "up") {
        const ex = dir === "left" ? -3 : dir === "right" ? 3 : 0;
        g.fillStyle = "#fff";
        g.fillRect(x - 5 + ex, y - 17 + bob * 0.3, 3, 3);
        g.fillRect(x + 2 + ex, y - 17 + bob * 0.3, 3, 3);
      }
      if (name) D.text(g, name, x, y - 32, { size: 11, bold: true, align: "center", color: "#1f2430" });
    },
  });

  // ------------------------------------------------------------------
  //  PROPS — every drawable thing on the map. size = default [w,h].
  //  solid = the player can't walk through it.
  // ------------------------------------------------------------------
  const box = (g, x, y, w, h, fill, top) => {
    g.fillStyle = "rgba(0,0,0,0.18)"; g.fillRect(x + 3, y + 4, w, h);
    g.fillStyle = fill; g.fillRect(x, y, w, h);
    if (top) { g.fillStyle = top; g.fillRect(x, y, w, Math.min(6, h / 3)); }
  };

  D.Props = {
    pegboard: { solid: true, draw(g, p) {
      box(g, p.x, p.y, p.w, p.h, C.wood);
      g.fillStyle = "#a07c45";
      for (let i = 8; i < p.w; i += 14) for (let j = 6; j < p.h; j += 10) g.fillRect(p.x + i, p.y + j, 2, 2);
    } },
    bench: { solid: true, draw(g, p) {
      box(g, p.x, p.y, p.w, p.h, C.darkWood, "#9a6438");
      if (!p.plain && p.h < 60 && p.w > 150) { // a few tools
        const icons = ["🔨", "🪛", "📐", "✂️", "🗜️"];
        icons.forEach((ic, i) => D.text(g, ic, p.x + 18 + i * (p.w / 5.5), p.y + p.h / 2 + 6, { size: 14, emoji: true }));
      }
    } },
    stool: { solid: false, size: [16, 16], draw(g, p) {
      g.fillStyle = "rgba(0,0,0,0.15)"; g.beginPath(); g.arc(p.x + 9, p.y + 10, 8, 0, 7); g.fill();
      g.fillStyle = C.yellow; g.beginPath(); g.arc(p.x + 8, p.y + 8, 8, 0, 7); g.fill();
      g.fillStyle = "#c99a10"; g.fillRect(p.x + 5, p.y + 6, 6, 3);
    } },
    shelf: { solid: true, draw(g, p) {
      box(g, p.x, p.y, p.w, p.h, C.wood, "#b8955a");
      const items = ["🦜", "🗿", "📦", "🏆"];
      items.forEach((ic, i) => D.text(g, ic, p.x + 16 + i * 30, p.y + 34, { size: 18, emoji: true }));
    } },
    table: { solid: true, draw(g, p) {
      box(g, p.x, p.y, p.w, p.h, C.darkWood, "#9a6438");
      g.fillStyle = "#f6d84a"; g.fillRect(p.x + 12, p.y + 12, 10, 10);
      g.fillStyle = "#f28b82"; g.fillRect(p.x + 28, p.y + 16, 10, 10);
    } },
    desk: { solid: true, draw(g, p) {
      box(g, p.x, p.y, p.w, p.h, C.wood, "#b8955a");
      g.fillStyle = "#222"; g.fillRect(p.x + 25, p.y + 8, 40, 22);
      D.text(g, "💡", p.x + p.w - 18, p.y + 40, { size: 14, emoji: true });
    } },
    whiteboard: { solid: true, size: [100, 14], draw(g, p) {
      g.fillStyle = "#777"; g.fillRect(p.x, p.y, p.w, 14);
      g.fillStyle = "#fff"; g.fillRect(p.x + 3, p.y + 2, p.w - 6, 10);
      const cols = ["#f28b82", "#f6d84a", "#8bd17c", "#6ec6f0"];
      for (let i = 0; i < 10; i++) { g.fillStyle = cols[i % 4]; g.fillRect(p.x + 6 + i * 9, p.y + 4 + (i % 2) * 3, 6, 4); }
      g.fillStyle = "#ccc"; g.fillRect(p.x + 10, p.y + 14, 4, 40); g.fillRect(p.x + p.w - 14, p.y + 14, 4, 40);
      g.fillStyle = "#fff"; g.fillRect(p.x + 3, p.y + 20, p.w - 6, 60);
      g.strokeStyle = "#e57373"; g.lineWidth = 1.5;
      [[38, 42], [30, 58], [50, 58]].forEach(([cx, cy]) => { g.beginPath(); g.arc(p.x + cx + 10, p.y + cy, 14, 0, 7); g.stroke(); });
      for (let i = 0; i < 8; i++) { g.fillStyle = cols[i % 4]; g.fillRect(p.x + 75 + (i % 2) * 9, p.y + 26 + Math.floor(i / 2) * 12, 7, 7); }
    }, rect: (p) => ({ x: p.x, y: p.y, w: p.w, h: 82 }) },
    printer3d: { solid: false, onBench: true, size: [40, 46], draw(g, p) {
      box(g, p.x, p.y, 40, 46, "#2b2f36");
      g.fillStyle = "#4a90e2"; g.fillRect(p.x + 4, p.y + 36, 32, 3);
      g.fillStyle = "#11151a"; g.fillRect(p.x + 5, p.y + 8, 30, 26);
      g.fillStyle = "#e0e0e0"; g.fillRect(p.x + 6, p.y + 2, 28, 5);
      g.fillStyle = ["#e2583e", "#f2c230", "#2f80ed", "#fff"][Math.floor(MS.engine.time * 2 + p.x) % 4];
      g.fillRect(p.x + 14 + Math.sin(MS.engine.time * 3 + p.y) * 8, p.y + 26, 10, 4);
    } },
    laser: { solid: true, size: [110, 70], draw(g, p) {
      box(g, p.x, p.y, 110, 70, p.color || "#6f8fd1");
      if (p.stripe) { g.fillStyle = p.stripe; g.fillRect(p.x + 80, p.y, 6, 70); }
      g.fillStyle = "#1c1c1c"; g.fillRect(p.x + 8, p.y + 8, 66, 40);
      g.fillStyle = "rgba(255,80,80,0.6)"; g.fillRect(p.x + 20 + (Math.sin(MS.engine.time * 4) + 1) * 22, p.y + 20, 3, 3);
      g.fillStyle = "#d32f2f"; g.beginPath(); g.arc(p.x + 96, p.y + 56, 6, 0, 7); g.fill();
      g.fillStyle = "#ffeb3b"; g.beginPath(); g.arc(p.x + 96, p.y + 56, 3, 0, 7); g.fill();
    } },
    duct: { solid: false, draw(g, p) {
      g.fillStyle = "#b0b6bc"; g.beginPath(); g.arc(p.x, p.y + 10, 9, 0, 7); g.fill();
      g.strokeStyle = "#8a9096"; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y + 10, 5, 0, 7); g.stroke();
    } },
    crate: { solid: true, size: [36, 40], draw(g, p) {
      box(g, p.x, p.y, 36, 40, "#c9a368");
      g.fillStyle = "#e7cf9f"; g.fillRect(p.x + 4, p.y + 4, 10, 20); g.fillRect(p.x + 18, p.y + 6, 12, 16);
    } },
    qr: { solid: false, onBench: true, draw(g, p) {
      g.fillStyle = "#e7cf9f"; g.fillRect(p.x, p.y, 16, 18);
      g.fillStyle = "#333";
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if ((i + j) % 2 === 0) g.fillRect(p.x + 3 + i * 4, p.y + 4 + j * 4, 3, 3);
    } },
    cricut: { solid: false, onBench: true, draw(g, p) { box(g, p.x, p.y, 44, 14, "#7fa7b0"); g.fillStyle = "#cfe3e8"; g.fillRect(p.x + 4, p.y + 4, 36, 3); } },
    press: { solid: false, onBench: true, draw(g, p) { box(g, p.x, p.y, 36, 24, "#333"); g.fillStyle = "#d35400"; g.fillRect(p.x + 4, p.y + 4, 28, 14); } },
    mugpress: { solid: false, onBench: true, draw(g, p) { box(g, p.x, p.y, 24, 20, "#222"); D.text(g, "☕", p.x + 4, p.y + 16, { size: 12, emoji: true }); } },
    paperprinter: { solid: false, onBench: true, draw(g, p) { box(g, p.x, p.y, 40, 24, "#3a3a3a"); g.fillStyle = "#fff"; g.fillRect(p.x + 8, p.y - 4, 24, 6); } },
    scanner: { solid: false, onBench: true, draw(g, p) {
      box(g, p.x, p.y, 26, 12, "#111");
      g.fillStyle = "#4fc3f7"; [5, 11, 17].forEach((dx) => g.fillRect(p.x + dx, p.y + 4, 3, 3));
    } },
    tv: { solid: false, draw(g, p) { g.fillStyle = "#111"; g.fillRect(p.x, p.y, p.w || 70, 6); } },
    bin: { solid: true, size: [28, 34], draw(g, p) {
      box(g, p.x, p.y, 28, 34, p.color);
      D.text(g, p.label, p.x + 14, p.y + 24, { size: 14, bold: true, align: "center", color: "#fff" });
    } },
    extruder: { solid: true, size: [70, 60], draw(g, p) {
      box(g, p.x, p.y, 70, 60, "#5b3a22");
      g.fillStyle = "rgba(200,230,255,0.5)"; g.fillRect(p.x + 4, p.y + 4, 62, 40);
      const cols = ["#e67e22", "#111", "#fff", "#5dade2"];
      for (let i = 0; i < 40; i++) { g.fillStyle = cols[i % 4]; g.fillRect(p.x + 6 + ((i * 13) % 56), p.y + 24 + ((i * 7) % 18), 3, 3); }
      D.text(g, "🦜", p.x + 30, p.y + 28, { size: 20, emoji: true });
    } },
    door: { solid: false, draw(g, p) {
      g.fillStyle = "rgba(150,200,230,0.6)"; g.fillRect(p.x, p.y, p.w, 18);
      D.text(g, "MAKERSPACE", p.x + p.w / 2, p.y + 13, { size: 11, bold: true, align: "center", color: "#1f2430" });
    } },
    checkin: { solid: true, size: [30, 22], draw(g, p) {
      box(g, p.x, p.y, 30, 22, "#e7cf9f");
      g.fillStyle = "#333";
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2 === 0) g.fillRect(p.x + 8 + i * 5, p.y + 6 + j * 5, 4, 4);
    } },
    lockers: { solid: true, size: [70, 50], draw(g, p) {
      box(g, p.x, p.y, p.w, 50, C.wood);
      g.strokeStyle = "#a07c45"; g.lineWidth = 1;
      for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) g.strokeRect(p.x + 2 + i * (p.w - 4) / 5, p.y + 3 + j * 15, (p.w - 4) / 5, 15);
    }, rect: (p) => ({ x: p.x, y: p.y, w: p.w, h: 50 }) },
    couch: { solid: true, size: [50, 40], draw(g, p) {
      box(g, p.x, p.y, 50, 40, "#c62828");
      g.fillStyle = "#e53935"; g.fillRect(p.x + 6, p.y + 10, 38, 24);
    } },
    extinguisher: { solid: false, draw(g, p) { D.rr(g, p.x, p.y, 10, 22, 4, "#d32f2f"); g.fillStyle = "#222"; g.fillRect(p.x + 3, p.y - 4, 4, 5); } },
  };

  D.propRect = (p) => {
    const def = D.Props[p.type];
    if (def && def.rect) return def.rect(p);
    const size = (def && def.size) || [20, 20];
    return { x: p.x, y: p.y, w: p.w || size[0], h: p.h || size[1] };
  };
  D.drawProp = (g, p) => { const def = D.Props[p.type]; if (def) def.draw(g, p); };
})();
