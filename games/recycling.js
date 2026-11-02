// Mini-game: RECYCLING — "Bin It". Tap the right bin for each item before time runs out.
MS.games.recycling = {
  create(api) {
    const D = MS.draw, I = MS.input, U = MS.util, C = MS.data.settings.colors;
    const d = api.data;
    let pool = [];
    while (pool.length < d.rounds) pool = pool.concat(U.shuffle(d.items));
    pool = pool.slice(0, d.rounds);
    // bins in a 2-column grid, kept above the guide's pop-up
    const rows = Math.ceil(d.bins.length / 2), bw = 203, bh = Math.min(130, 300 / rows - 12);
    const rect = (k) => ({ x: 16 + (k % 2) * (bw + 12), y: 676 - (rows - Math.floor(k / 2)) * (bh + 12), w: bw, h: bh });
    let i = 0, score = 0, time = d.secondsPerItem, fb = null;

    function choose(k) {
      if (fb) return;
      const it = pool[i], right = d.bins.find((b) => b.id === it.bin);
      const ok = k >= 0 && d.bins[k].id === it.bin;
      const r = k >= 0 ? rect(k) : { x: 225, y: 230, w: 0 };
      if (ok) { score++; api.good(r.x + r.w / 2, r.y + 10); api.say(right.icon + " " + right.pop); }
      else { api.bad(r.x + r.w / 2, r.y + 10, k < 0 ? "⏰" : "✗"); api.say(it.name + " → " + right.label + ". " + right.pop); }
      fb = { ok, k, t: ok ? 0.8 : 1.6 };
    }

    return {
      update(dt) {
        if (fb) {
          fb.t -= dt;
          if (fb.t <= 0) {
            fb = null; i++; time = d.secondsPerItem;
            if (i >= pool.length) {
              const ratio = score / pool.length;
              api.finish(ratio >= d.passMark, score + " / " + pool.length + " sorted right", ratio);
            }
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
        D.text(g, "Item " + (i + 1) + " / " + pool.length + "   ✔ " + score, 16, 90, { size: 16, color: "#ccd" });
        // the item drops in
        const drop = fb ? 0 : Math.max(0, 1 - (d.secondsPerItem - time) * 5) * -60;
        D.rr(g, 65, 108 + drop, 320, 200, 18, "#f3efe6", fb ? (fb.ok ? C.good : C.bad) : null, 6);
        D.text(g, it.icon, 225, 205 + drop, { size: 70, emoji: true, align: "center" });
        D.wrap(g, it.name, 225, 276 + drop, 290, { size: 20, bold: true, align: "center", valign: "middle", color: "#222" });
        D.bar(g, 65, 322, 320, 10, fb ? 0 : time / d.secondsPerItem, time < 1.5 ? C.bad : C.yellow);
        d.bins.forEach((b, k) => {
          const r = rect(k);
          const isAns = fb && b.id === it.bin;
          const hov = MS.input.hover(r) && !fb;
          D.rr(g, r.x, r.y - (hov ? 6 : 0), r.w, r.h, 14, b.color, isAns ? "#fff" : null, 5);
          D.text(g, b.icon, r.x + r.w / 2, r.y + r.h * 0.45 - (hov ? 6 : 0), { size: 38, emoji: true, align: "center" });
          D.wrap(g, b.label, r.x + r.w / 2, r.y + r.h * 0.76 - (hov ? 6 : 0), r.w - 16, { size: 17, bold: true, align: "center", valign: "middle", color: b.color === "#f2c230" || b.color === "#d9b77e" ? "#222" : "#fff" });
        });
      },
    };
  },
};
