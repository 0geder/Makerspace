// Mini-game: 3D PRINTING — stack layers, then answer quick-check questions.
MS.games.printing = {
  create(api) {
    const D = MS.draw, I = MS.input, C = MS.data.settings.colors;
    const d = api.data;
    const LH = 24, PLATE_Y = 740;
    const colors = ["#e2583e", "#f2c230", "#2f80ed", "#ffffff", "#2eaa5c"];
    const plate = { x: 95, w: 260 };
    const layers = [];
    const falling = [];
    let cur = { x: 36, w: d.startWidth, dir: 1 }, speed = d.startSpeed, cam = 0, phase = "stack", quiz = null;

    const topY = (n) => PLATE_Y - (n + 1) * LH + cam;

    function drop() {
      const below = layers.length ? layers[layers.length - 1] : plate;
      const l = Math.max(cur.x, below.x), r = Math.min(cur.x + cur.w, below.x + below.w);
      MS.audio.play("drop");
      if (r - l <= 2) {
        falling.push({ x: cur.x, w: cur.w, y: topY(layers.length), v: 0, c: colors[layers.length % colors.length] });
        return api.finish(false, "The layer had nothing underneath to stick to! (" + layers.length + " layers)");
      }
      if (cur.x < l) falling.push({ x: cur.x, w: l - cur.x, y: topY(layers.length), v: 0, c: colors[layers.length % colors.length] });
      if (cur.x + cur.w > r) falling.push({ x: r, w: cur.x + cur.w - r, y: topY(layers.length), v: 0, c: colors[layers.length % colors.length] });
      layers.push({ x: l, w: r - l });
      if (layers.length >= d.layersToWin) {
        phase = "check";
        quiz = MS.Quiz(MS.util.shuffle(d.checks), { area: { x: 16, y: 92, w: 418, h: 690 } });
        return;
      }
      speed += d.speedUp;
      cur = { x: layers.length % 2 ? 414 - (r - l) : 36, w: r - l, dir: layers.length % 2 ? -1 : 1 };
    }

    return {
      update(dt) {
        falling.forEach((f) => { f.v += 900 * dt; f.y += f.v * dt; });
        if (phase === "check") {
          quiz.update(dt);
          if (quiz.done) api.finish(quiz.correct / quiz.total >= d.passMark, d.layersToWin + " layers printed · " + quiz.correct + " / " + quiz.total + " checks right");
          return;
        }
        cur.x += cur.dir * speed * dt;
        if (cur.x < 36) { cur.x = 36; cur.dir = 1; }
        if (cur.x + cur.w > 414) { cur.x = 414 - cur.w; cur.dir = -1; }
        const want = Math.max(0, (layers.length - 18) * LH);
        cam += (want - cam) * Math.min(1, dt * 5);
        if (I.pressed(" ", "enter") || (I.mouse.clicked && I.mouse.y > 56)) drop(); // not the ✕ in the header
      },
      draw(g) {
        if (phase === "check") {
          D.text(g, "✅ Print complete! Quick check:", 225, 80, { size: 16, bold: true, align: "center", color: C.good });
          return quiz.draw(g);
        }
        // printer frame
        D.rr(g, 16, 68, 418, 720, 16, "#2b2f36");
        D.rr(g, 26, 78, 398, 700, 10, "#11151a");
        g.fillStyle = "#4a90e2"; g.fillRect(26, 78, 398, 4);
        // plate
        g.fillStyle = "#555"; g.fillRect(plate.x - 20, PLATE_Y + cam, plate.w + 40, 14);
        g.fillStyle = "#777"; g.fillRect(plate.x, PLATE_Y + cam, plate.w, 4);
        layers.forEach((l, i) => {
          g.fillStyle = colors[i % colors.length]; g.fillRect(l.x, topY(i), l.w, LH - 2);
          g.fillStyle = "rgba(0,0,0,0.15)"; g.fillRect(l.x, topY(i) + LH - 6, l.w, 4);
        });
        falling.forEach((f) => { g.fillStyle = f.c; g.globalAlpha = 0.7; g.fillRect(f.x, f.y, f.w, LH - 2); g.globalAlpha = 1; });
        // moving layer + nozzle
        const y = topY(layers.length);
        g.fillStyle = colors[layers.length % colors.length];
        g.fillRect(cur.x, y, cur.w, LH - 2);
        const nx = cur.x + cur.w / 2;
        g.fillStyle = "#ccc"; g.fillRect(26, y - 70, 398, 6);
        D.rr(g, nx - 26, y - 70, 52, 40, 6, "#e0e0e0");
        g.fillStyle = "#c0392b"; g.beginPath(); g.moveTo(nx - 8, y - 30); g.lineTo(nx + 8, y - 30); g.lineTo(nx, y - 4); g.fill();
        // HUD
        D.text(g, "Layer " + (layers.length + 1) + " / " + d.layersToWin, 40, 112, { size: 18, bold: true, color: C.yellow });
        D.text(g, "Tap to drop", 410, 112, { size: 14, align: "right", color: "#aab" });
      },
    };
  },
};
