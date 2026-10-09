// Mini-game: RECYCLING — send each item to the right bin before time runs out.
MS.games.recycling = {
  create(api) {
    const D = MS.draw, I = MS.input, U = MS.util, C = MS.data.settings.colors;
    const d = api.data;
    let pool = [];
    while (pool.length < d.rounds) pool = pool.concat(U.shuffle(d.items));
    pool = pool.slice(0, d.rounds);
    const bw = (900 - (d.bins.length - 1) * 16) / d.bins.length;
    const rect = (k) => ({ x: 30 + k * (bw + 16), y: 400, w: bw, h: 170 });
    let i = 0, score = 0, time = d.secondsPerItem, fb = null;

    function choose(k) {
      if (fb) return;
      const ok = k >= 0 && d.bins[k].id === pool[i].bin;
      if (ok) score++;
      MS.audio.play(ok ? "good" : "bad");
      fb = { ok, k, t: ok ? 0.6 : 1.4 };
    }

    return {
      update(dt) {
        if (fb) {
          fb.t -= dt;
          if (fb.t <= 0) {
            fb = null; i++; time = d.secondsPerItem;
            if (i >= pool.length) api.finish(score / pool.length >= d.passMark, score + " / " + pool.length + " sorted correctly");
          }
          return;
        }
        time -= dt;
        if (time <= 0) return choose(-1);
        d.bins.forEach((b, k) => { if (I.clickIn(rect(k)) || I.pressed(String(k + 1))) choose(k); });
      },
      draw(g) {
        if (i >= pool.length) return;
        const it = pool[i];
        D.text(g, "Item " + (i + 1) + " / " + pool.length + "   ✔ " + score, 30, 80, { size: 16, color: "#ccd" });
        D.rr(g, 330, 100, 300, 190, 18, "#f3efe6", fb ? (fb.ok ? C.good : C.bad) : null, 6);
        D.text(g, it.icon, 480, 190, { size: 70, emoji: true, align: "center" });
        D.text(g, it.name, 480, 262, { size: 20, bold: true, align: "center", color: "#222" });
        D.bar(g, 330, 305, 300, 10, time / d.secondsPerItem, time < 2 ? C.bad : C.yellow);
        if (fb && !fb.ok) D.text(g, "→ " + d.bins.find((b) => b.id === it.bin).label, 480, 350, { size: 20, bold: true, align: "center", color: C.yellow });
        d.bins.forEach((b, k) => {
          const r = rect(k);
          const isAns = fb && b.id === it.bin;
          const hov = MS.input.hover(r) && !fb;
          D.rr(g, r.x, r.y - (hov ? 6 : 0), r.w, r.h, 14, b.color, isAns ? "#fff" : null, 5);
          D.text(g, b.icon, r.x + r.w / 2, r.y + 72 - (hov ? 6 : 0), { size: 44, emoji: true, align: "center" });
          D.wrap(g, b.label, r.x + r.w / 2, r.y + 118 - (hov ? 6 : 0), r.w - 16, { size: 17, bold: true, align: "center", valign: "middle", color: b.color === "#f2c230" || b.color === "#d9b77e" ? "#222" : "#fff" });
          D.text(g, String(k + 1), r.x + 14, r.y + 24, { size: 14, bold: true, color: "rgba(0,0,0,0.5)" });
        });
      },
    };
  },
};
