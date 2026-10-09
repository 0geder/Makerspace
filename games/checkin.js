// Mini-game: CHECK-IN — click the onboarding steps in the right order.
MS.games.checkin = {
  create(api) {
    const D = MS.draw, I = MS.input, C = MS.data.settings.colors;
    const d = api.data;
    const cards = MS.util.shuffle(d.steps.map((t, i) => ({ t, i, done: false, shake: 0 })));
    const rows = Math.ceil(cards.length / 2);
    const h = Math.min(100, 430 / rows - 18);
    const rect = (k) => ({ x: 70 + (k % 2) * 420, y: 130 + Math.floor(k / 2) * (h + 18), w: 400, h });
    let next = 0, lives = d.lives;

    return {
      update(dt) {
        cards.forEach((c, k) => {
          c.shake = Math.max(0, c.shake - dt);
          if (c.done || !I.clickIn(rect(k))) return;
          if (c.i === next) {
            c.done = true; next++; MS.audio.play("good");
            if (next === cards.length) api.finish(true, "Lives left: " + lives + " / " + d.lives);
          } else {
            c.shake = 0.4; lives--; MS.audio.play("bad");
            if (lives <= 0) api.finish(false, "You got " + next + " of " + cards.length + " steps in order.");
          }
        });
      },
      draw(g) {
        D.text(g, next < cards.length ? "Which step comes #" + (next + 1) + "?" : "All in order!", 480, 92, { size: 24, bold: true, align: "center" });
        D.hearts(g, 800, 98, lives, d.lives);
        cards.forEach((c, k) => {
          const r = rect(k);
          const off = c.shake ? Math.sin(c.shake * 60) * 6 : 0;
          const fill = c.done ? C.good : c.shake ? C.bad : MS.input.hover(r) ? "#3a4256" : "#2a3142";
          D.rr(g, r.x + off, r.y, r.w, r.h, 14, fill, "rgba(255,255,255,0.2)", 2);
          if (c.done) {
            D.rr(g, r.x + 12, r.y + r.h / 2 - 18, 36, 36, 18, "#fff");
            D.text(g, String(c.i + 1), r.x + 30, r.y + r.h / 2 + 7, { size: 20, bold: true, align: "center", color: C.good });
          }
          D.wrap(g, c.t, r.x + off + r.w / 2 + (c.done ? 20 : 0), r.y + r.h / 2, r.w - 90, { size: 17, align: "center", valign: "middle" });
        });
      },
    };
  },
};
