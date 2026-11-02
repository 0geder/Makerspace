// Mini-game: IDEAS — "Make It or Skip It". Swipe or tap ✔ / ✘ on project ideas.
MS.games.ideas = {
  create(api) {
    const D = MS.draw, I = MS.input, C = MS.data.settings.colors;
    const d = api.data;
    const cards = MS.util.shuffle(d.cards).slice(0, d.rounds || d.cards.length);
    const no = { x: 16, y: 584, w: 203, h: 80 }, yes = { x: 231, y: 584, w: 203, h: 80 };
    let i = 0, score = 0, fb = null, slide = 0;

    function answer(sayYes) {
      if (fb) return;
      const ok = sayYes === cards[i].ok;
      if (ok) { score++; api.good(sayYes ? 332 : 117, 560); } else api.bad(sayYes ? 332 : 117, 560, "✗");
      fb = { ok, dir: sayYes ? 1 : -1, t: 1.8 };
    }

    return {
      update(dt) {
        if (fb) {
          fb.t -= dt;
          slide = fb.t < 0.35 ? (0.35 - fb.t) / 0.35 : 0;
          if (fb.t <= 0 || (fb.t < 1.4 && (I.mouse.clicked || I.pressed(" ", "enter")))) {
            fb = null; slide = 0; i++;
            if (i >= cards.length) {
              const ratio = score / cards.length;
              api.finish(ratio >= d.passMark, score + " / " + cards.length + " ideas judged right", ratio);
            }
          }
          return;
        }
        if (I.pressed("arrowright", "d", "y") || I.swipe > 0) answer(true);
        else if (I.pressed("arrowleft", "a", "n") || I.swipe < 0) answer(false);
      },
      draw(g) {
        if (i >= cards.length) return;
        const c = cards[i];
        D.text(g, "Idea " + (i + 1) + " / " + cards.length + "   ✔ " + score, 225, 92, { size: 16, align: "center", color: "#ccd" });
        const off = fb ? fb.dir * slide * 500 : 0;
        g.save(); g.translate(225 + off, 330); g.rotate(fb ? fb.dir * slide * 0.3 : 0);
        D.rr(g, -195, -205, 400, 410, 18, "rgba(0,0,0,0.3)");
        D.rr(g, -200, -210, 400, 410, 18, "#f3efe6", fb ? (fb.ok ? C.good : C.bad) : null, 6);
        D.text(g, "💡", 0, -140, { size: 44, emoji: true, align: "center" });
        D.wrap(g, c.text, 0, -40, 350, { size: 22, bold: true, align: "center", valign: "middle", color: "#222" });
        if (fb) {
          D.text(g, c.ok ? "✔ MAKE IT" : "✘ SKIP IT", 0, 70, { size: 24, bold: true, align: "center", color: c.ok ? "#1e7a42" : "#a83232" });
          D.wrap(g, c.why, 0, 125, 350, { size: 17, align: "center", valign: "middle", color: "#333" });
        }
        g.restore();
        if (!fb) {
          if (D.button(g, no, "✘  Skip it", { color: C.bad, size: 22 })) answer(false);
          if (D.button(g, yes, "✔  Make it", { color: C.good, size: 22 })) answer(true);
        }
      },
    };
  },
};
