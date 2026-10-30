// Mini-game: VALUES — place each sticky note in the right part of the Venn diagram.
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

    return {
      update(dt) {
        if (fb) {
          fb.t -= dt;
          if (fb.t <= 0) {
            fb = null; i++;
            if (i >= notes.length) api.finish(correct / notes.length >= d.passMark, correct + " / " + notes.length + " notes placed correctly");
          }
          return;
        }
        if (!I.mouse.clicked) return;
        const inside = circles.filter((c) => Math.hypot(I.mouse.x - c.x, I.mouse.y - c.y) < R).map((c) => c.id);
        if (!inside.length) return;
        const note = notes[i];
        const ok = key(inside) === key(note.in);
        if (ok) { correct++; placed.push({ x: I.mouse.x, y: I.mouse.y, t: note.text }); }
        MS.audio.play(ok ? "good" : "bad");
        fb = { ok, t: ok ? 0.7 : 2.0, answer: note.in };
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
        placed.forEach((p) => { D.rr(g, p.x - 7, p.y - 7, 14, 14, 2, C.yellow); });

        // current sticky note
        if (i < notes.length) {
          g.save(); g.translate(225, 126); g.rotate(-0.02);
          D.rr(g, -165, -48, 340, 100, 4, "rgba(0,0,0,0.25)");
          D.rr(g, -170, -52, 340, 100, 4, fb ? (fb.ok ? "#8bd17c" : "#f28b82") : "#f6d84a");
          D.wrap(g, notes[i].text, 0, -2, 310, { size: 20, bold: true, align: "center", valign: "middle", color: "#2a2a2a" });
          g.restore();
        }
        D.text(g, "Note " + Math.min(i + 1, notes.length) + " / " + notes.length + "   ✔ " + correct, 225, 640, { size: 16, align: "center", color: "#ccd" });
        if (fb && !fb.ok) D.wrap(g, "It belongs in: " + label(fb.answer), 225, 690, 400, { size: 18, bold: true, align: "center", color: C.yellow });
        else D.wrap(g, "Tap inside the circle (or overlap) where this value belongs.", 225, 690, 400, { size: 15, align: "center", color: "#aab" });
      },
    };
  },
};
