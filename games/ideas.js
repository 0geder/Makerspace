// Mini-game: IDEAS — swipe ✔ / ✘ on project ideas.
MS.games.ideas = {
  create(api) {
    const D = MS.draw, I = MS.input, C = MS.data.settings.colors;
    const d = api.data;
    const cards = MS.util.shuffle(d.cards);
    const no = { x: 16, y: 600, w: 203, h: 72 }, yes = { x: 231, y: 600, w: 203, h: 72 };
    let i = 0, score = 0, fb = null, slide = 0;

    function answer(sayYes) {
      if (fb) return;
      const ok = sayYes === cards[i].ok;
      if (ok) score++;
      MS.audio.play(ok ? "good" : "bad");
      fb = { ok, dir: sayYes ? 1 : -1, t: 2.0 };
    }

    return {
      update(dt) {
        if (fb) {
          fb.t -= dt;
          slide = fb.t < 0.4 ? (0.4 - fb.t) / 0.4 : 0;
          if (fb.t <= 0 || (fb.t < 1.6 && (I.mouse.clicked || I.pressed(" ", "enter")))) {
            fb = null; slide = 0; i++;
            if (i >= cards.length) api.finish(score / cards.length >= d.passMark, score + " / " + cards.length + " ideas judged right");
          }
          return;
        }
        if (I.pressed("arrowright", "d", "y") || I.swipe > 0) answer(true);
        if (I.pressed("arrowleft", "a", "n") || I.swipe < 0) answer(false);
      },
      draw(g) {
        if (i >= cards.length) return;
        const c = cards[i];
        D.text(g, "Idea " + (i + 1) + " / " + cards.length + "   ✔ " + score, 225, 92, { size: 16, align: "center", color: "#ccd" });
        const off = fb ? fb.dir * slide * 500 : 0;
        g.save(); g.translate(225 + off, 340); g.rotate(fb ? fb.dir * slide * 0.3 : 0);
        D.rr(g, -195, -205, 400, 420, 18, "rgba(0,0,0,0.3)");
        D.rr(g, -200, -210, 400, 420, 18, "#f3efe6", fb ? (fb.ok ? C.good : C.bad) : null, 6);
        D.text(g, "💡", 0, -140, { size: 44, emoji: true, align: "center" });
        D.wrap(g, c.text, 0, -40, 350, { size: 22, bold: true, align: "center", valign: "middle", color: "#222" });
        if (fb) D.wrap(g, (c.ok ? "✔ Make it! " : "✘ Not here. ") + c.why, 0, 110, 350, { size: 17, align: "center", valign: "middle", color: fb.ok ? "#1e7a42" : "#a83232" });
        g.restore();
        if (!fb) {
          if (D.button(g, no, "✘  Not here", { color: C.bad, size: 20 })) answer(false);
          if (D.button(g, yes, "✔  Make it", { color: C.good, size: 20 })) answer(true);
          D.text(g, "…or swipe the card ← / →", 225, 712, { size: 14, align: "center", color: "#aab" });
        } else {
          D.text(g, "Tap to continue", 225, 640, { size: 15, align: "center", color: "#aab" });
        }
      },
    };
  },
};
