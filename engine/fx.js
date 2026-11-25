// FX: game feel. Particles, floating text, screen shake, and the guide's pop-up bubble.
// Mini-games don't call this directly: they use api.good / api.bad / api.say (scenes/minigame.js).
(function () {
  const D = MS.draw, U = MS.util;
  const C = MS.data.settings.colors;
  let parts = [], floats = [], shake = 0, bubble = null;

  MS.fx = {
    reset() { parts = []; floats = []; shake = 0; bubble = null; },

    burst(x, y, color, n) {
      for (let i = 0; i < (n || 14); i++) {
        const a = Math.random() * Math.PI * 2, v = U.rand(80, 260);
        parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, life: U.rand(0.4, 0.8), c: color || C.yellow, s: U.rand(3, 7) });
      }
    },
    confetti(n) {
      const cols = [C.yellow, C.accent, C.good, "#2f80ed", "#9b59b6"];
      for (let i = 0; i < (n || 80); i++) {
        parts.push({ x: U.rand(0, 450), y: U.rand(-200, 0), vx: U.rand(-40, 40), vy: U.rand(60, 200), life: U.rand(2, 4), c: U.pick(cols), s: U.rand(4, 8), spin: true });
      }
    },
    float(x, y, text, color) { floats.push({ x, y, text, color: color || C.yellow, life: 0.9 }); },
    shake(amount) { shake = Math.max(shake, amount || 8); },

    // The guide's pop-up: one line, bottom of the screen, never blocks play.
    say(text, seconds) { if (text) bubble = { text, t: seconds || Math.max(2.6, text.length / 16), age: 0 }; },
    get bubble() { return bubble; },

    update(dt) {
      parts.forEach((p) => { p.vy += (p.spin ? 30 : 500) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; });
      parts = parts.filter((p) => p.life > 0 && p.y < 820);
      floats.forEach((f) => { f.y -= 50 * dt; f.life -= dt; });
      floats = floats.filter((f) => f.life > 0);
      shake = Math.max(0, shake - dt * 40);
      if (bubble) { bubble.age += dt; bubble.t -= dt; if (bubble.t <= 0) bubble = null; }
    },

    // call before drawing the game: returns the shake offset to translate by
    offset: () => (shake ? { x: U.rand(-shake, shake), y: U.rand(-shake, shake) } : { x: 0, y: 0 }),

    draw(g) {
      parts.forEach((p) => {
        g.globalAlpha = Math.min(1, p.life * 2);
        g.fillStyle = p.c;
        if (p.spin) { g.save(); g.translate(p.x, p.y); g.rotate(p.y / 30); g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); }
        else g.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
      });
      g.globalAlpha = 1;
      floats.forEach((f) => {
        g.globalAlpha = Math.min(1, f.life * 2);
        D.text(g, f.text, f.x, f.y, { size: 26, bold: true, align: "center", color: f.color, shadow: "rgba(255,255,255,0.95)" });
      });
      g.globalAlpha = 1;
    },

    // The guide robot + speech bubble along the bottom edge.
    drawBubble(g, y) {
      if (!bubble) return;
      const slide = Math.min(1, bubble.age * 6) * Math.min(1, bubble.t * 4);
      const by = (y || 800) + (1 - slide) * 140;
      g.save();
      g.globalAlpha = slide;
      MS.sprites.draw(g, MS.data.characters.guide, "talk", 52, by + 4, { h: 112 });
      g.font = "bold 15px " + D.FONT;
      const h = Math.max(54, 20 * Math.ceil(g.measureText(bubble.text).width / 300) + 22);
      D.rr(g, 99, by - h - 23, 342, h, 14, "rgba(70,45,20,0.2)");
      D.rr(g, 96, by - h - 26, 342, h, 14, "#fff", MS.data.settings.colors.wood, 3);
      g.fillStyle = "#fff"; g.beginPath(); g.moveTo(98, by - 62); g.lineTo(84, by - 52); g.lineTo(98, by - 44); g.fill();
      D.wrap(g, bubble.text, 267, by - 26 - h / 2, 316, { size: 15, bold: true, align: "center", valign: "middle", color: "#1f2430", lineHeight: 20 });
      g.restore();
    },
  };
})();
