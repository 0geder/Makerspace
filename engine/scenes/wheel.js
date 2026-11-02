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

  // Nothing left to spin for: today's run is complete (or the whole game is).
  function dayComplete() {
    const next = MS.save.nextLevel(), got = MS.save.badgeStations().filter((s) => MS.save.has(s.id)).length;
    const total = MS.save.badgeStations().length;
    MS.audio.play("win");
    if (MS.save.allDone()) {
      return MS.ui.card({
        title: "🏆 Every badge collected!",
        blurb: "You know the Makerspace inside out. Your Maker Pass is ready.",
        noEscape: true,
        buttons: [{ label: "Get my Maker Pass", primary: true, onClick: () => swap("pass") }, { label: "Home", onClick: () => MS.back() }],
      });
    }
    MS.ui.card({
      title: "🎉 Day " + MS.save.visits() + " complete!",
      blurb: "You've played everything unlocked today: " + got + " / " + total + " badges, ⭐ " + MS.save.totalStars() + ".",
      facts: [
        next ? "Come back on another day to reach Level " + next.level + " · " + next.name + " and unlock new sections." : "Replay any section from the home page to get 3 stars.",
        "Can't wait? Scan the QR code in any area of the space to unlock it right now.",
      ],
      noEscape: true,
      buttons: [{ label: "Home", primary: true, onClick: () => MS.back() }],
    });
  }

  function spin() {
    if (spinning) return;
    const pool = (S.wheel.skipCompleted ? segs.filter((s) => !MS.save.has(s.id)) : segs).filter(MS.save.canPlay);
    if (!pool.length) return dayComplete();
    chosen = U.pick(pool);
    const i = segs.indexOf(chosen), n = segs.length;
    const segCenter = ((i + 0.5) / n) * Math.PI * 2 + U.rand(-0.35, 0.35) * (Math.PI * 2 / n);
    from = rot;
    let target = -Math.PI / 2 - segCenter;
    while (target < from + Math.PI * 2 * 3) target += Math.PI * 2;
    to = target; t = 0; spinning = true; landedFor = -1;
  }

  // landed: show where for a moment, then straight into the game
  function landed() {
    spinning = false;
    landedFor = 0;
    MS.audio.play("win");
    MS.fx.burst(CX, CY - R - 10, chosen.color, 24);
  }

  let landedFor = -1, autoIn = 0;

  // Paint the wheel's segments, icons and labels into an offscreen canvas once per visit.
  let face = null;
  function paintFace() {
    const px = Math.max(2, MS.engine.pxScale || 2);
    face = document.createElement("canvas");
    face.width = face.height = Math.ceil(R * 2 * px);
    const f = face.getContext("2d");
    f.scale(px, px); f.translate(R, R);
    const n = segs.length;
    segs.forEach((s, i) => {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
      const done = MS.save.has(s.id), open = MS.save.canPlay(s);
      f.fillStyle = done ? "#cfc5b3" : open ? s.color : "#e8dfcf";
      f.beginPath(); f.moveTo(0, 0); f.arc(0, 0, R, a0, a1); f.closePath(); f.fill();
      f.strokeStyle = "#fff"; f.lineWidth = 3; f.stroke();
      f.save(); f.rotate((a0 + a1) / 2);
      D.text(f, s.badge.icon, R - 28, 8, { size: 22, emoji: true, align: "center" });
      D.text(f, (done ? "✓ " : open ? "" : "🔒 ") + s.name, R - 48, 4, { size: 11, bold: true, align: "right", color: open && !done ? "#fff" : C.muted });
      f.restore();
    });
  }

  MS.scenes.wheel = {
    enter() {
      segs = MS.save.badgeStations();
      spinning = false; chosen = null; landedFor = -1;
      paintFace();
      autoIn = 0.25; // spins by itself, a beat after it appears
      MS.fx.reset();
    },
    update(dt) {
      MS.fx.update(dt);
      if (MS.ui.isOpen()) return;
      if (autoIn > 0) { autoIn -= dt; if (autoIn <= 0) spin(); }
      if (spinning) {
        t += dt / S.wheel.spinSeconds;
        const e = 1 - Math.pow(1 - Math.min(1, t), 3);
        rot = from + (to - from) * e;
        const s = segAt(rot);
        if (s !== lastSeg) { lastSeg = s; MS.audio.play("tick"); }
        if (t >= 1) landed();
      } else if (landedFor >= 0) {
        landedFor += dt;
        if (landedFor >= S.wheel.landPause || I.mouse.clicked || I.pressed(" ", "enter")) { landedFor = -1; swap("play/" + chosen.id); }
      } else {
        if (I.pressed(" ", "enter", "e")) spin();
        if (I.pressed("escape")) MS.back();
      }
    },
    draw(g) {
      D.floor(g);
      // rays
      g.save(); g.translate(CX, CY); g.rotate(MS.engine.time * 0.1);
      for (let i = 0; i < 16; i++) { g.rotate(Math.PI / 8); g.fillStyle = i % 2 ? "rgba(242,194,48,0.10)" : "rgba(226,88,62,0.07)"; g.beginPath(); g.moveTo(0, 0); g.lineTo(700, -90); g.lineTo(700, 90); g.fill(); }
      g.restore();

      if (landedFor >= 0) {
        const pop = Math.min(1, landedFor * 6);
        D.rr(g, 225 - 190 * pop, 70, 380 * pop, 64, 32, chosen.color, "#fff", 3);
        if (pop > 0.9) D.text(g, "🎯 " + chosen.name + "!", CX, 112, { size: 26, bold: true, align: "center", color: "#fff", shadow: "rgba(0,0,0,0.25)" });
      } else {
        D.text(g, spinning ? "Spinning…" : "Spin the Maker Wheel!", CX, 110, { size: 30, bold: true, align: "center", color: C.accent, shadow: "rgba(255,255,255,0.9)" });
      }
      D.text(g, "⭐ " + MS.save.totalStars() + "   🏅 " + segs.filter((s) => MS.save.has(s.id)).length + " / " + segs.length, CX, 160, { size: 16, bold: true, align: "center", color: C.muted });

      // the face is drawn once (see paintFace) and only rotated here: rotated emoji text is slow
      g.save(); g.translate(CX, CY); g.rotate(rot);
      if (face) g.drawImage(face, -R, -R, R * 2, R * 2);
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

      // your character, watching the wheel
      const me = MS.save.avatar();
      const pose = landedFor >= 0 ? MS.sprites.cheer(landedFor) : spinning ? "show" : "idle";
      MS.sprites.draw(g, me, pose, 340, 790, { h: 170 });

      const idle = !spinning && landedFor < 0 && autoIn <= 0 && !MS.ui.isOpen();
      if (idle) {
        if (D.button(g, { x: CX - 50, y: CY - 50, w: 100, h: 100 }, "SPIN", { size: 24, color: C.accent })) spin();
      } else {
        D.rr(g, CX - 40, CY - 40, 80, 80, 40, C.wall, C.wood, 5);
        if (chosen && landedFor >= 0) D.text(g, chosen.badge.icon, CX, CY + 14, { size: 38, emoji: true, align: "center" });
      }
      if (!MS.ui.isOpen() && D.button(g, { x: 16, y: 724, w: 140, h: 52 }, "← Home", { size: 17, color: C.woodDark })) MS.back();
      MS.fx.draw(g);
    },
  };
})();
