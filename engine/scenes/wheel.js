// Wheel scene: spin to pick the next section to learn about.
(function () {
  const D = MS.draw, U = MS.util, I = MS.input;
  const S = MS.data.settings, C = S.colors;
  const CX = 225, CY = 400, R = 190;

  let segs = [], rot = 0, from = 0, to = 0, t = 0, spinning = false, chosen = null, lastSeg = -1;

  const segAt = (r) => {
    // which segment is under the pointer (top, angle -PI/2)
    const n = segs.length;
    let a = (-Math.PI / 2 - r) % (Math.PI * 2);
    if (a < 0) a += Math.PI * 2;
    return Math.floor((a / (Math.PI * 2)) * n) % n;
  };

  // replace the wheel in the history, so Back from the next view goes home
  const swap = (hash) => { history.replaceState(history.state, "", "#" + hash); MS.engine.route(); };

  function spin() {
    if (spinning) return;
    let pool = (S.wheel.skipCompleted ? segs.filter((s) => !MS.save.has(s.id)) : segs).filter(MS.save.canPlay);
    const next = MS.save.nextLevel();
    if (!pool.length && next && !MS.save.allDone()) {
      MS.ui.card({
        title: "🔒 That's everything unlocked so far!",
        blurb: "Come back on another day to reach Level " + next.level + " · " + next.name + " and unlock new sections. Or scan the QR code in any area to unlock it now.",
        buttons: [{ label: "Back", onClick: () => MS.back() }],
      });
      return;
    }
    if (!pool.length) {
      MS.ui.card({
        title: "🏆 The wheel is done with you!",
        blurb: "You've completed every section.",
        buttons: [{ label: "Get my Maker Pass", primary: true, onClick: () => swap("pass") }, { label: "Back", onClick: () => MS.back() }],
      });
      return;
    }
    chosen = U.pick(pool);
    const i = segs.indexOf(chosen), n = segs.length;
    const segCenter = ((i + 0.5) / n) * Math.PI * 2 + U.rand(-0.35, 0.35) * (Math.PI * 2 / n);
    from = rot;
    let target = -Math.PI / 2 - segCenter;
    while (target < from + Math.PI * 2 * 5) target += Math.PI * 2;
    to = target; t = 0; spinning = true;
  }

  function landed() {
    spinning = false;
    MS.audio.play("win");
    MS.ui.card({
      title: "🎯 " + chosen.name + "!",
      photo: chosen.photo,
      blurb: chosen.blurb + " Read up on it, then play its mini-game.",
      buttons: [
        { label: "▶ Play now", primary: true, onClick: () => swap("play/" + chosen.id) },
        { label: "Tell me more", onClick: () => swap(chosen.id) },
      ],
    });
  }

  MS.scenes.wheel = {
    enter() {
      segs = MS.save.badgeStations();
      spinning = false; chosen = null;
    },
    update(dt) {
      if (MS.ui.isOpen()) return;
      if (spinning) {
        t += dt / S.wheel.spinSeconds;
        const e = 1 - Math.pow(1 - Math.min(1, t), 3);
        rot = from + (to - from) * e;
        const s = segAt(rot);
        if (s !== lastSeg) { lastSeg = s; MS.audio.play("tick"); }
        if (t >= 1) landed();
      } else {
        if (I.pressed(" ", "enter", "e")) spin();
        if (I.pressed("escape")) MS.back();
      }
    },
    draw(g) {
      g.fillStyle = "#1f2430"; g.fillRect(0, 0, 450, 800);
      // rays
      g.save(); g.translate(CX, CY); g.rotate(MS.engine.time * 0.1);
      for (let i = 0; i < 16; i++) { g.rotate(Math.PI / 8); g.fillStyle = i % 2 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)"; g.beginPath(); g.moveTo(0, 0); g.lineTo(700, -90); g.lineTo(700, 90); g.fill(); }
      g.restore();

      D.text(g, "Spin the Maker Wheel!", CX, 110, { size: 28, bold: true, align: "center", color: C.yellow, shadow: "rgba(0,0,0,0.4)" });

      const n = segs.length;
      g.save(); g.translate(CX, CY); g.rotate(rot);
      segs.forEach((s, i) => {
        const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
        const done = MS.save.has(s.id);
        g.fillStyle = done ? "#5b6170" : MS.save.canPlay(s) ? s.color : "#3a4256";
        g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, a0, a1); g.closePath(); g.fill();
        g.strokeStyle = "#fff"; g.lineWidth = 3; g.stroke();
        g.save(); g.rotate((a0 + a1) / 2);
        D.text(g, s.badge.icon, R - 28, 8, { size: 22, emoji: true, align: "center" });
        D.text(g, (done ? "✓ " : MS.save.canPlay(s) ? "" : "🔒 ") + s.name, R - 48, 4, { size: 11, bold: true, align: "right" });
        g.restore();
      });
      g.restore();
      g.strokeStyle = C.yellow; g.lineWidth = 8; g.beginPath(); g.arc(CX, CY, R + 4, 0, 7); g.stroke();
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        g.fillStyle = Math.floor(MS.engine.time * 4 + i) % 2 ? "#fff" : C.yellow;
        g.beginPath(); g.arc(CX + Math.cos(a) * (R + 4), CY + Math.sin(a) * (R + 4), 4, 0, 7); g.fill();
      }
      // pointer
      g.fillStyle = C.accent; g.strokeStyle = "#fff"; g.lineWidth = 3;
      g.beginPath(); g.moveTo(CX - 18, CY - R - 30); g.lineTo(CX + 18, CY - R - 30); g.lineTo(CX, CY - R + 8); g.closePath(); g.fill(); g.stroke();

      if (!spinning && !MS.ui.isOpen()) {
        if (D.button(g, { x: CX - 50, y: CY - 50, w: 100, h: 100 }, "SPIN", { size: 24, color: C.accent })) spin();
        if (D.button(g, { x: 16, y: 724, w: 140, h: 52 }, "← Back", { size: 17, color: "#3a4256" })) MS.back();
      } else {
        D.rr(g, CX - 40, CY - 40, 80, 80, 40, "#1f2430", "#fff", 4);
      }
    },
  };
})();
