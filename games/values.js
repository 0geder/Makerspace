// Mini-game: VALUES — "Sticky Flick". Tap where each sticky note belongs in the Venn diagram.
MS.games.values = {
  create(api) {
    const D = MS.draw, I = MS.input, U = MS.util, C = MS.data.settings.colors;
    const d = api.data;
    const V = MS.data.makerspace.values;
    const pos = { makerspace: [225, 330], hpi: [163, 448], dschool: [287, 448] };
    const R = 108;
    const circles = V.circles.map((c, i) => {
      const p = pos[c.id] || [225 + Math.cos(i * 2.1) * 70, 400 + Math.sin(i * 2.1) * 70];
      return Object.assign({ x: p[0], y: p[1] }, c);
    });
    const notes = U.shuffle(V.notes).slice(0, Math.min(d.rounds, V.notes.length));
    const placed = [];
    let i = 0, correct = 0, fb = null;
    const key = (arr) => arr.slice().sort().join("+");
    const label = (arr) => arr.map((id) => circles.find((c) => c.id === id).label).join(" + ");
    (d.tips || []).slice(0, 1).forEach((tip) => api.say(tip));

    return {
      update(dt) {
        if (fb) {
          fb.t -= dt;
          if (fb.t <= 0) {
            fb = null; i++;
            if (i >= notes.length) {
              const ratio = correct / notes.length;
              api.finish(ratio >= d.passMark, correct + " / " + notes.length + " notes placed right", ratio);
            }
          }
          return;
        }
        if (!I.mouse.clicked) return;
        const inside = circles.filter((c) => Math.hypot(I.mouse.x - c.x, I.mouse.y - c.y) < R).map((c) => c.id);
        if (!inside.length) return;
        const note = notes[i];
        const ok = key(inside) === key(note.in);
        if (ok) {
          correct++;
          placed.push({ x: I.mouse.x, y: I.mouse.y });
          api.good(I.mouse.x, I.mouse.y);
          api.say("“" + note.text + "” → " + label(note.in));
        } else {
          api.bad(I.mouse.x, I.mouse.y, "✗");
          api.say("“" + note.text + "” belongs in: " + label(note.in));
        }
        fb = { ok, t: ok ? 0.7 : 1.6, answer: note.in };
      },
      draw(g) {
        // board
        D.rr(g, 16, 196, 418, 412, 10, "#f7f7f2", "#9aa0a6", 6);
        circles.forEach((c) => {
          const hl = fb && !fb.ok && fb.answer.includes(c.id);
          g.fillStyle = c.color + (hl ? "40" : "14");
          g.beginPath(); g.arc(c.x, c.y, R, 0, 7); g.fill();
          g.strokeStyle = c.color; g.lineWidth = hl ? 6 : 3; g.stroke();
        });
        D.text(g, circles[0].label, circles[0].x, circles[0].y - R - 8, { size: 20, bold: true, align: "center", color: circles[0].color });
        if (circles[1]) D.text(g, circles[1].label, circles[1].x - R + 6, circles[1].y + R + 20, { size: 18, bold: true, color: circles[1].color });
        if (circles[2]) D.text(g, circles[2].label, circles[2].x + R - 6, circles[2].y + R + 20, { size: 18, bold: true, align: "right", color: circles[2].color });
        placed.forEach((p) => { D.rr(g, p.x - 9, p.y - 9, 18, 18, 2, C.yellow, "rgba(0,0,0,0.2)", 1); });

        // current sticky note
        if (i < notes.length) {
          g.save(); g.translate(225, 126); g.rotate(-0.02);
          D.rr(g, -165, -48, 340, 100, 4, "rgba(0,0,0,0.25)");
          D.rr(g, -170, -52, 340, 100, 4, fb ? (fb.ok ? "#8bd17c" : "#f28b82") : "#f6d84a");
          D.wrap(g, notes[i].text, 0, -2, 310, { size: 20, bold: true, align: "center", valign: "middle", color: "#2a2a2a" });
          g.restore();
        }
        // progress dots
        notes.forEach((_, k) => D.text(g, k < i ? "●" : k === i ? "◉" : "○", 225 + (k - (notes.length - 1) / 2) * 22, 640, { size: 16, align: "center", color: k <= i ? C.yellow : "#5b6170" }));
      },
    };
  },
};
