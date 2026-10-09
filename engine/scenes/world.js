// World scene: the top-down Makerspace map you walk around.
(function () {
  const D = MS.draw, U = MS.util, I = MS.input;
  const S = MS.data.settings, C = S.colors;
  const MAP = MS.data.map;

  const player = { x: MAP.playerStart.x, y: MAP.playerStart.y, dir: "down", walkT: 0 };
  let solids = [];
  let moveTo = null;        // click-to-move destination
  let pending = null;       // thing to interact with on arrival
  let dots = [];
  let here = null, nearWheel = false;

  const stations = () => MS.data.stations;
  const center = (z) => ({ x: z.x + z.w / 2, y: z.y + z.h / 2 });
  const feet = (x, y) => ({ x: x - 9, y: y + 2, w: 18, h: 12 });
  const blocked = (x, y) => solids.some((r) => U.overlap(feet(x, y), r));

  function build() {
    const w = MAP.wheel;
    solids = MAP.walls.map((r) => r)
      .concat(MAP.props.filter((p) => (D.Props[p.type] || {}).solid).map(D.propRect))
      .concat([{ x: w.x - w.r, y: w.y - w.r, w: w.r * 2, h: w.r * 2 + 22 }]);
    if (!dots.length) for (let i = 0; i < 500; i++) dots.push([Math.random() * 960, Math.random() * 600, Math.random() < 0.5]);
  }

  function canPlay(st) {
    return S.debug || !S.wheel.requireSpin || MS.save.has(st.id) || MS.save.state.target === st.id;
  }

  function openStation(st) {
    const game = st.game && MS.games[st.game];
    const done = MS.save.has(st.id);
    const buttons = [];
    if (game) {
      const ok = canPlay(st);
      buttons.push({
        label: done ? "Play again" : ok ? "▶ Play mini-game" : "🔒 Spin the wheel to unlock",
        primary: ok, disabled: !ok,
        onClick: () => MS.engine.setScene("minigame", { station: st }),
      });
    }
    buttons.push({ label: "Close" });
    MS.ui.card({
      title: (st.badge ? st.badge.icon + " " : "") + st.name + (done ? "  ✅" : ""),
      photo: st.photo, blurb: st.blurb, facts: U.resolve(st.facts), buttons,
    });
  }

  function interact() {
    if (nearWheel) return MS.engine.setScene("wheel");
    if (here) openStation(here);
  }

  function showMakerPassPrompt() {
    MS.ui.card({
      title: "🏆 Every badge collected!",
      blurb: "You know your way around the Makerspace. Time to collect your Maker Pass.",
      buttons: [{ label: "Get my Maker Pass", primary: true, onClick: () => MS.engine.setScene("finale") }, { label: "Keep exploring" }],
    });
  }

  MS.scenes.world = {
    enter(params) {
      build();
      moveTo = pending = null;
      if (params.returnFrom) {
        const c = center(params.returnFrom.zone);
        if (!blocked(c.x, c.y)) { player.x = c.x; player.y = c.y; }
      }
      if (!MS.save.state.introSeen) {
        MS.save.set("introSeen", true);
        MS.ui.card({
          title: "Welcome, " + MS.save.state.name + "! 👋",
          photo: "community-area.jpg",
          blurb: "This is " + MS.data.makerspace.name + " — " + MS.data.makerspace.tagline,
          facts: [
            "Walk with WASD / arrow keys, or click where you want to go.",
            "Head to the prize WHEEL in the middle and press E to spin.",
            "The wheel sends you to a section. Explore it, then win its mini-game for a badge.",
            "Collect all " + MS.save.badgeStations().length + " badges to earn your Maker Pass!",
          ],
          buttons: [{ label: "Let's make!", primary: true }],
        });
      } else if (params.justWon && MS.save.allDone()) {
        showMakerPassPrompt();
      }
    },

    update(dt) {
      if (I.pressed("m")) MS.ui.toast(MS.audio.toggle() ? "🔊 Sound on" : "🔇 Sound off");
      if (MS.ui.isOpen()) return;

      // --- input
      let { x: ax, y: ay } = I.axis();
      if (ax || ay) { moveTo = pending = null; }
      if (I.mouse.clicked) {
        moveTo = { x: I.mouse.x, y: I.mouse.y };
        const w = MAP.wheel;
        pending = Math.hypot(I.mouse.x - w.x, I.mouse.y - w.y) < w.r + 10 ? "wheel"
          : stations().find((s) => U.inRect(I.mouse.x, I.mouse.y, s.zone)) || null;
      }
      if (moveTo) {
        const dx = moveTo.x - player.x, dy = moveTo.y - player.y;
        const d = Math.hypot(dx, dy);
        if (d < 6) moveTo = null; else { ax = dx / d; ay = dy / d; }
      }

      // --- movement with collision
      const len = Math.hypot(ax, ay);
      if (len > 0) {
        const sp = (S.player.speed * dt) / Math.max(1, len);
        const nx = player.x + ax * sp, ny = player.y + ay * sp;
        let moved = false;
        if (!blocked(nx, player.y)) { player.x = nx; moved = true; }
        if (!blocked(player.x, ny)) { player.y = ny; moved = true; }
        if (!moved) moveTo = null;
        player.dir = Math.abs(ax) > Math.abs(ay) ? (ax < 0 ? "left" : "right") : ay < 0 ? "up" : "down";
        player.walkT += dt;
      } else player.walkT = 0;

      // --- where am I?
      const w = MAP.wheel;
      nearWheel = Math.hypot(player.x - w.x, player.y - w.y) < w.r + 40;
      here = stations().find((s) => U.inRect(player.x, player.y, s.zone)) || null;

      if (pending === "wheel" && nearWheel) { pending = null; moveTo = null; return MS.engine.setScene("wheel"); }
      if (pending && pending !== "wheel" && here === pending) { pending = null; moveTo = null; openStation(here); }

      if (I.pressed("e", " ", "enter")) interact();
    },

    draw(g) {
      const t = MS.engine.time;
      // floor (terrazzo)
      g.fillStyle = C.floor; g.fillRect(0, 0, 960, 600);
      dots.forEach(([x, y, dark]) => { g.fillStyle = dark ? C.floorDots : "#b9b2a5"; g.fillRect(x, y, 2, 2); });
      // rugs under community area
      g.fillStyle = "rgba(90,90,100,0.12)"; g.fillRect(230, 170, 520, 120);

      // zones
      const target = MS.save.state.target;
      stations().forEach((s) => {
        const z = s.zone;
        g.fillStyle = s.color + "22";
        g.fillRect(z.x, z.y, z.w, z.h);
        if (s.id === target) {
          g.strokeStyle = s.color; g.lineWidth = 3 + Math.sin(t * 6) * 1.5;
          g.setLineDash([10, 6]); g.lineDashOffset = -t * 30;
          g.strokeRect(z.x + 2, z.y + 2, z.w - 4, z.h - 4);
          g.setLineDash([]);
        }
      });

      // walls
      MAP.walls.forEach((r) => { g.fillStyle = r.glass ? C.glass : C.wall; g.fillRect(r.x, r.y, r.w, r.h); });
      g.fillStyle = "rgba(150,200,230,0.08)"; g.fillRect(768, 18, 174, 254);
      g.fillStyle = "rgba(60,60,80,0.06)"; g.fillRect(768, 298, 174, 284);

      // props + player, sorted by depth
      // things that sit ON a bench (onBench) are drawn after the bench
      const list = MAP.props.map((p) => {
        const r = D.propRect(p);
        return { y: r.y + r.h + ((D.Props[p.type] || {}).onBench ? 200 : 0), f: () => D.drawProp(g, p) };
      });
      list.push({ y: player.y + 14, f: () => D.player(g, player.x, player.y, player.dir, player.walkT, MS.save.state.name) });
      list.push({ y: MAP.wheel.y + 30, f: () => drawWheel(g) });
      list.sort((a, b) => a.y - b.y).forEach((o) => o.f());

      // zone labels
      stations().forEach((s) => {
        const z = s.zone;
        const done = MS.save.has(s.id);
        const label = (done ? "✅ " : s.badge ? s.badge.icon + " " : "") + s.name;
        g.font = "bold 11px " + D.FONT;
        const tw = g.measureText(label).width + 14;
        const lx = U.clamp(z.x + z.w / 2 - tw / 2, 20, 940 - tw);
        const ly = z.y + z.h - 20;
        D.rr(g, lx, ly, tw, 18, 9, s.id === target ? s.color : "rgba(31,36,48,0.8)");
        D.text(g, label, lx + 7, ly + 13, { size: 11, bold: true, emoji: false });
      });

      // guidance arrow to target
      const ts = target && stations().find((s) => s.id === target);
      if (ts && !U.inRect(player.x, player.y, ts.zone)) {
        const c = center(ts.zone);
        const a = Math.atan2(c.y - player.y, c.x - player.x);
        const r = 34 + Math.sin(t * 6) * 3;
        g.save(); g.translate(player.x + Math.cos(a) * r, player.y - 6 + Math.sin(a) * r); g.rotate(a);
        g.fillStyle = ts.color; g.strokeStyle = "#fff"; g.lineWidth = 2;
        g.beginPath(); g.moveTo(10, 0); g.lineTo(-6, -8); g.lineTo(-6, 8); g.closePath(); g.fill(); g.stroke();
        g.restore();
      }

      // interaction prompt
      const prompt = nearWheel ? "E — Spin the wheel" : here ? "E — Explore " + here.name : null;
      if (prompt && !MS.ui.isOpen()) {
        g.font = "bold 13px " + D.FONT;
        const tw = g.measureText(prompt).width + 20;
        D.rr(g, player.x - tw / 2, player.y - 62, tw, 22, 11, "#1f2430");
        D.text(g, prompt, player.x, player.y - 47, { size: 13, bold: true, align: "center", color: C.yellow });
      }

      drawHud(g, ts);
    },
  };

  function drawWheel(g) {
    const w = MAP.wheel;
    const segs = MS.save.badgeStations();
    const rot = MS.engine.time * 0.4;
    g.fillStyle = "#555"; g.fillRect(w.x - 4, w.y + w.r - 6, 8, 22);
    g.fillStyle = "rgba(0,0,0,0.2)"; g.beginPath(); g.ellipse(w.x, w.y + w.r + 16, 26, 7, 0, 0, 7); g.fill();
    segs.forEach((s, i) => {
      const a0 = rot + (i / segs.length) * Math.PI * 2, a1 = rot + ((i + 1) / segs.length) * Math.PI * 2;
      g.fillStyle = MS.save.has(s.id) ? "#9aa0a6" : s.color;
      g.beginPath(); g.moveTo(w.x, w.y); g.arc(w.x, w.y, w.r, a0, a1); g.closePath(); g.fill();
    });
    g.strokeStyle = "#fff"; g.lineWidth = 4; g.beginPath(); g.arc(w.x, w.y, w.r, 0, 7); g.stroke();
    D.rr(g, w.x - 24, w.y - 12, 48, 24, 12, "#1f2430");
    D.text(g, "SPIN", w.x, w.y + 5, { size: 13, bold: true, align: "center", color: C.yellow });
    g.fillStyle = C.accent; g.beginPath(); g.moveTo(w.x - 8, w.y - w.r - 10); g.lineTo(w.x + 8, w.y - w.r - 10); g.lineTo(w.x, w.y - w.r + 6); g.fill();
  }

  function drawHud(g, ts) {
    const segs = MS.save.badgeStations();
    const got = segs.filter((s) => MS.save.has(s.id)).length;
    const w = 40 + segs.length * 26 + 70;
    const x = 480 - w / 2, y = 132;
    D.rr(g, x, y, w, 30, 15, "rgba(31,36,48,0.85)");
    segs.forEach((s, i) => {
      g.globalAlpha = MS.save.has(s.id) ? 1 : 0.25;
      D.text(g, s.badge.icon, x + 20 + i * 26, y + 22, { size: 17, emoji: true });
      g.globalAlpha = 1;
    });
    D.text(g, got + "/" + segs.length, x + w - 18, y + 20, { size: 14, bold: true, align: "right", color: C.yellow });
    if (ts) {
      const msg = "🎯 Go to: " + ts.name;
      g.font = "bold 12px " + D.FONT;
      const tw = g.measureText(msg).width + 20;
      D.rr(g, 480 - tw / 2, y + 34, tw, 20, 10, ts.color);
      D.text(g, msg, 480, y + 48, { size: 12, bold: true, align: "center" });
    } else if (MS.save.allDone()) {
      if (D.button(g, { x: 400, y: y + 36, w: 160, h: 26 }, "🏆 Maker Pass", { size: 13, color: C.good })) MS.engine.setScene("finale");
    }
  }
})();
