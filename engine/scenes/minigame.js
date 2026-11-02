// Mini-game scene: wraps every game in /games.
//   ready  → the guide's "what is what" pop-up, how to play, your character, 3-2-1 (tap to skip)
//   play   → the game, with your character reacting in the header
//   result → stars, badge, cheering character, one "Remember" line, Next ▶ (spins the wheel again)
//
// A mini-game file registers itself like this:
//   MS.games.myGame = {
//     create(api) { return { update(dt) {}, draw(g) {} }; }
//   };
// api = { data, station,
//         good(x, y, label)            right move: sound, particles, "+1", character cheers
//         bad(x, y, label)             wrong move: buzz, shake, character says "oops"
//         say(text)                    the guide's pop-up at the bottom (never blocks play)
//         finish(won, scoreText, ratio) ratio 0..1 sets the stars }
(function () {
  const D = MS.draw, I = MS.input, FX = MS.fx, SP = MS.sprites;
  const S = MS.data.settings, C = S.colors;
  const HEADER = 56;

  let st, data, inst, phase, result, t = 0, react = null, lastCount = -1;
  const me = () => MS.save.avatar();
  const leave = () => MS.back(st.id);
  // the next round: back to the wheel, which spins by itself
  const next = () => { history.replaceState(history.state, "", "#wheel"); MS.engine.route(); };

  const stars = (ratio) => (ratio >= S.stars.three ? 3 : ratio >= S.stars.two ? 2 : 1);

  function start() {
    phase = "play"; t = 0; react = null;
    FX.reset();
    inst = MS.games[st.game].create({
      data, station: st,
      good(x, y, label) {
        MS.audio.play("good");
        FX.burst(x, y, C.good);
        FX.float(x, y - 10, label || "+1", C.good);
        react = { pose: "cheer", t: 0.8 };
      },
      bad(x, y, label) {
        MS.audio.play("bad");
        FX.shake(10);
        if (label) FX.float(x, y - 10, label, C.bad);
        react = { pose: "hit", t: 0.8 };
      },
      say: (text, seconds) => FX.say(text, seconds),
      finish(won, scoreText, ratio) {
        if (phase !== "play") return;
        const r = won ? (ratio == null ? 1 : ratio) : 0;
        result = { won, scoreText: scoreText || "", stars: won ? stars(r) : 0, t: 0, newBadge: won && !MS.save.has(st.id) };
        phase = "result";
        MS.save.set("played", true);
        if (won) { MS.save.award(st.id, result.stars); FX.confetti(90); }
        MS.audio.play(won ? "win" : "lose");
        FX.say((won ? "Remember: " : "Tip: ") + (data.remember || ""), 60);
      },
    });
  }

  function header(g) {
    g.fillStyle = C.wood; g.fillRect(0, 0, 450, HEADER);
    g.fillStyle = C.woodDark; g.fillRect(0, HEADER - 4, 450, 4);
    // your character's head and shoulders, reacting to every move
    const pose = react ? (react.pose === "cheer" ? SP.cheer(t) : react.pose) : "idle";
    g.save(); g.beginPath(); g.rect(0, 0, 70, HEADER); g.clip();
    SP.draw(g, me(), pose, 36, HEADER + 42, { h: 110, crop: 0.6 }); // head and shoulders only
    g.restore();
    D.text(g, (st.badge ? st.badge.icon + " " : "") + data.title, 74, 35, { size: 18, bold: true, color: C.ink });
    if (D.button(g, { x: 392, y: 6, w: 48, h: 40 }, "✕", { size: 20, color: C.woodDark })) leave();
  }

  function drawReady(g) {
    // the real photo of the section, faded, behind everything
    D.photo(g, st.photo, 0, 0, 450, 330, 0);
    const grd = g.createLinearGradient(0, 120, 0, 330);
    grd.addColorStop(0, "rgba(247,242,232,0)"); grd.addColorStop(1, C.bg);
    g.fillStyle = grd; g.fillRect(0, 0, 450, 330);
    D.rr(g, 16, 16, 200, 34, 17, st.color);
    D.text(g, (st.badge ? st.badge.icon + " " : "") + st.name, 116, 39, { size: 15, bold: true, align: "center", color: "#fff" });
    if (D.button(g, { x: 392, y: 12, w: 48, h: 40 }, "✕", { size: 20, color: C.woodDark })) return leave();

    D.wrap(g, data.title, 225, 300, 410, { size: 34, bold: true, align: "center", color: C.accent, shadow: "rgba(255,255,255,0.9)" });
    D.wrap(g, data.howTo || "", 225, 352, 400, { size: 19, bold: true, align: "center", color: C.ink });

    // your character, bouncing
    const bounce = Math.abs(Math.sin(t * 6)) * 18;
    SP.draw(g, me(), bounce > 9 ? "jump" : "idle", 225, 650 - bounce, { h: 160 });
    g.fillStyle = C.line; g.beginPath(); g.ellipse(225, 654, 40 - bounce / 2, 8, 0, 0, 7); g.fill();

    // 3 · 2 · 1 · GO
    const step = S.countdownSeconds / 4;
    const n = Math.max(0, 3 - Math.floor(t / step));
    const k = 1 - ((t / step) % 1);
    if (n !== lastCount) { lastCount = n; MS.audio.play(n > 0 ? "tick" : "drop"); }
    const label = n > 0 ? String(n) : "GO!";
    D.text(g, label, 225, 450, { size: 64 + k * 26, bold: true, align: "center", color: n > 0 ? C.yellow : C.good, shadow: "rgba(70,45,20,0.35)" });
    D.text(g, "Tap to start now", 225, 676, { size: 14, align: "center", color: C.muted });
  }

  function drawResult(g) {
    const r = result, a = Math.min(1, r.t * 3);
    g.globalAlpha = 0.96 * a; g.fillStyle = C.bg; g.fillRect(0, 0, 450, 800); g.globalAlpha = 1;
    if (r.won) { g.globalAlpha = 0.35 * a; g.fillStyle = C.yellow; g.beginPath(); g.arc(225, 230, 150, 0, 7); g.fill(); g.globalAlpha = 1; }
    if (r.t < 0.35) return;
    const pose = r.won ? SP.cheer(r.t) : "think";
    SP.draw(g, me(), pose, 225, 300, { h: 200 });
    // stars pop in one by one
    for (let i = 0; i < 3; i++) {
      const s = Math.min(1, Math.max(0, (r.t - 0.5 - i * 0.2) * 5));
      const on = i < r.stars;
      if (on && s > 0 && s < 0.25 && !r["star" + i]) { r["star" + i] = true; MS.audio.play("good"); FX.burst(150 + i * 75, 345, C.yellow, 10); }
      D.text(g, on ? "⭐" : "☆", 150 + i * 75, 370, { size: 40 + (on ? (1 - s) * 30 : 0), emoji: on, align: "center", color: C.speck });
    }
    let y = 420;
    const title = r.won ? (r.newBadge ? "Badge earned!" : "Nice one!") : "So close!";
    y += D.wrap(g, title, 225, y, 410, { size: 30, bold: true, align: "center", color: r.won ? C.good : C.accent });
    if (r.won && st.badge) y += D.wrap(g, st.badge.icon + " " + st.badge.name, 225, y + 4, 410, { size: 20, bold: true, align: "center", color: C.ink }) + 4;
    if (r.scoreText) y += D.wrap(g, r.scoreText, 225, y + 6, 410, { size: 15, align: "center", color: C.muted });
    if (r.won && st.training) D.wrap(g, "⚠️ A badge isn't machine training. Book a session first.", 225, y + 18, 400, { size: 14, bold: true, align: "center", color: "#a66a00" });

    const main = { x: 32, y: 572, w: 250, h: 64 }, home = { x: 294, y: 572, w: 124, h: 64 };
    const go = r.won ? next : start;
    if (D.button(g, main, r.won ? "Next ▶" : "↻ Try again", { size: 22, color: r.won ? C.good : C.accent }) || I.pressed(" ", "enter")) return go();
    if (D.button(g, home, "Home", { size: 18, color: C.woodDark })) leave();
  }

  MS.scenes.minigame = {
    get phase() { return phase; },
    get result() { return result; },
    enter(p) {
      st = p.station;
      data = MS.data.games[st.game];
      if (!data) throw new Error("Missing data/games/" + st.game + ".js");
      phase = "ready"; inst = null; result = null; t = 0; lastCount = -1;
      FX.reset();
      FX.say(st.tip, S.countdownSeconds + 2.5);
    },

    update(dt) {
      t += dt;
      FX.update(dt);
      if (react) { react.t -= dt; if (react.t <= 0) react = null; }
      if (I.pressed("m")) MS.ui.toast(MS.audio.toggle() ? "🔊 Sound on" : "🔇 Sound off");
      if (I.pressed("escape")) return leave();
      if (phase === "ready" && (t >= S.countdownSeconds || I.pressed(" ", "enter") || (I.mouse.clicked && I.mouse.y > 60))) {
        I.consumeClick();
        return start();
      }
      if (phase === "play") inst.update(dt);
      if (phase === "result") result.t += dt;
    },

    draw(g) {
      D.floor(g);
      if (phase === "ready") { drawReady(g); FX.drawBubble(g, 800); return; }

      const o = FX.offset();
      g.save(); g.translate(o.x, o.y);
      inst.draw(g);
      g.restore();
      FX.draw(g);
      if (phase === "play") { header(g); FX.drawBubble(g, 800); return; }
      drawResult(g);
      FX.draw(g);
      FX.drawBubble(g, 800);
    },
  };
})();
