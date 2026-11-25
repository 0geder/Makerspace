// Mini-game: CHECK-IN — "Check-In Dash". Tap the steps in order; your character runs to the door.
MS.games.checkin = {
  create(api) {
    const D = MS.draw, I = MS.input, SP = MS.sprites, C = MS.data.settings.colors;
    const d = api.data;
    const n = d.steps.length;
    const cards = MS.util.shuffle(d.steps.map((s, i) => ({ s, i, done: false, shake: 0 })));
    const rows = Math.ceil(n / 2), h = Math.min(170, 400 / rows - 12);
    const rect = (k) => ({ x: 16 + (k % 2) * 215, y: 270 + Math.floor(k / 2) * (h + 12), w: 203, h });
    const START = 60, DOOR = 380;
    let next = 0, lives = d.lives, x = START, t = 0;

    return {
      update(dt) {
        t += dt;
        const target = START + ((DOOR - START) * next) / n;
        x += Math.sign(target - x) * Math.min(Math.abs(target - x), 260 * dt);
        cards.forEach((c, k) => {
          c.shake = Math.max(0, c.shake - dt);
          if (c.done || !I.clickIn(rect(k))) return;
          const r = rect(k);
          if (c.i === next) {
            c.done = true; next++;
            api.good(r.x + r.w / 2, r.y + 20, "#" + next);
            api.say(c.s.pop);
            if (next === n) api.finish(true, "Lives left: " + lives + " / " + d.lives, lives / d.lives);
          } else {
            c.shake = 0.4; lives--;
            api.bad(r.x + r.w / 2, r.y + 20, "✗");
            api.say("Not yet! Think: what has to happen before that?");
            if (lives <= 0) api.finish(false, "You got " + next + " of " + n + " steps in order.");
          }
        });
      },
      draw(g) {
        // the corridor to the Makerspace doors
        D.rr(g, 16, 72, 418, 160, 14, "#e9e4da");
        g.fillStyle = "#cfc8bb"; for (let i = 0; i < 60; i++) g.fillRect(24 + ((i * 53) % 400), 190 + ((i * 17) % 36), 3, 3);
        D.rr(g, DOOR + 8, 84, 40, 130, 4, "rgba(120,180,220,0.6)", "#8fa6b8", 3);
        D.text(g, "🚪", DOOR + 28, 160, { size: 30, emoji: true, align: "center" });
        // little flags for each step along the floor
        for (let i = 0; i < n; i++) {
          const fx = START + ((DOOR - START) * (i + 1)) / n;
          D.text(g, i < next ? "✅" : "⬜", fx, 222, { size: 16, emoji: true, align: "center" });
        }
        const moving = Math.abs(START + ((DOOR - START) * next) / n - x) > 1;
        const pose = next === n ? SP.cheer(t) : moving ? SP.walk(t) : "idle";
        SP.draw(g, MS.save.avatar(), pose, x, 212, { h: 120 });

        D.text(g, next < n ? "Step #" + (next + 1) + "?" : "You're in!", 16, 258, { size: 21, bold: true, color: C.ink });
        D.hearts(g, 352, 258, lives, d.lives);
        cards.forEach((c, k) => {
          const r = rect(k);
          const off = c.shake ? Math.sin(c.shake * 60) * 6 : 0;
          const fill = c.done ? C.good : c.shake ? C.bad : MS.input.hover(r) ? C.tileHover : C.tile;
          D.rr(g, r.x + off + 2, r.y + 4, r.w, r.h, 16, C.line);
          D.rr(g, r.x + off, r.y, r.w, r.h, 16, fill, c.done || c.shake ? null : C.wood, 3);
          if (c.done) D.text(g, String(c.i + 1), r.x + 22, r.y + 32, { size: 22, bold: true, align: "center", color: "#fff" });
          D.wrap(g, c.s.text, r.x + off + r.w / 2, r.y + r.h / 2, r.w - 24, { size: 17, bold: true, align: "center", valign: "middle", color: c.done || c.shake ? "#fff" : C.ink });
        });
      },
    };
  },
};
