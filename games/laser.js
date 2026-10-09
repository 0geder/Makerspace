// Mini-game: LASER — catch laser-safe materials, dodge dangerous ones.
MS.games.laser = {
  create(api) {
    const D = MS.draw, I = MS.input, U = MS.util, C = MS.data.settings.colors;
    const d = api.data;
    const safe = d.materials.filter((m) => m.safe), unsafe = d.materials.filter((m) => !m.safe);
    const bed = { x: 410, y: 540, w: 140, h: 20 };
    const items = [];
    let spawn = 0.5, catches = 0, lives = d.lives, msg = null, flash = 0;

    return {
      update(dt) {
        const ax = I.axis().x;
        if (ax) bed.x += ax * 480 * dt;
        else if (I.mouse.moved) bed.x = I.mouse.x - bed.w / 2;
        bed.x = U.clamp(bed.x, 20, 940 - bed.w);
        flash = Math.max(0, flash - dt);
        if (msg) { msg.t -= dt; if (msg.t <= 0) msg = null; }

        spawn -= dt;
        if (spawn <= 0) {
          spawn = d.spawnEvery * U.rand(0.7, 1.3);
          const m = Math.random() < 0.55 ? U.pick(safe) : U.pick(unsafe);
          items.push({ m, x: U.rand(30, 820), y: 50, w: 120, h: 42, v: d.fallSpeed * U.rand(0.85, 1.2) + catches * 6 });
        }
        for (let k = items.length - 1; k >= 0; k--) {
          const it = items[k];
          it.y += it.v * dt;
          const hit = it.y + it.h >= bed.y && it.y + it.h <= bed.y + 30 && it.x < bed.x + bed.w && it.x + it.w > bed.x;
          if (hit) {
            items.splice(k, 1);
            if (it.m.safe) { catches++; MS.audio.play("good"); if (catches >= d.catchesToWin) api.finish(true, catches + " safe sheets cut · " + lives + " lives left"); }
            else {
              lives--; flash = 0.4; MS.audio.play("bad");
              msg = { text: "⚠️ " + it.m.name + ": " + it.m.why, t: 3 };
              if (lives <= 0) api.finish(false, catches + " / " + d.catchesToWin + " safe sheets caught");
            }
          } else if (it.y > 620) items.splice(k, 1);
        }
      },
      draw(g) {
        g.fillStyle = flash ? "rgba(214,69,69,0.25)" : "rgba(0,0,0,0)"; g.fillRect(0, 44, 960, 556);
        items.forEach((it) => {
          D.rr(g, it.x + 3, it.y + 4, it.w, it.h, 4, "rgba(0,0,0,0.3)");
          D.rr(g, it.x, it.y, it.w, it.h, 4, it.m.color, "rgba(0,0,0,0.4)", 2);
          const dark = ["#3a3a3a", "#8b5a2b", "#a9825a"].includes(it.m.color);
          D.wrap(g, it.m.name, it.x + it.w / 2, it.y + it.h / 2, it.w - 10, { size: 14, bold: true, align: "center", valign: "middle", color: dark ? "#fff" : "#222" });
        });
        // laser bed
        D.rr(g, bed.x - 6, bed.y, bed.w + 12, bed.h + 10, 4, "#6f8fd1");
        g.fillStyle = "#1c1c1c"; g.fillRect(bed.x, bed.y + 4, bed.w, 10);
        g.fillStyle = "rgba(255,60,60,0.8)"; g.fillRect(bed.x + bed.w / 2 - 1, bed.y - 18, 2, 20);
        // HUD
        D.text(g, "✂️ " + catches + " / " + d.catchesToWin, 20, 76, { size: 18, bold: true });
        D.hearts(g, 850, 76, lives, d.lives);
        D.text(g, "Catch SAFE materials · Dodge the dangerous ones", 480, 76, { size: 15, align: "center", color: "#aab" });
        if (msg) {
          D.rr(g, 160, 96, 640, 56, 10, "rgba(214,69,69,0.92)");
          D.wrap(g, msg.text, 480, 124, 610, { size: 15, bold: true, align: "center", valign: "middle" });
        }
      },
    };
  },
};
