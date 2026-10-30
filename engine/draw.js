// Draw: text, shapes, buttons and photos on the canvas.
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
  });
})();
