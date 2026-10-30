// Mini-game scene: wraps every game in /games with an intro and result screen.
//
// A mini-game file registers itself like this:
//   MS.games.myGame = {
//     create(api) { return { update(dt) {}, draw(g) {} }; }
//   };
// api = { data, station, finish(won, scoreText) }
(function () {
  const D = MS.draw, I = MS.input;
  const C = MS.data.settings.colors;

  let st, data, inst, phase, result;
  const leave = () => MS.back(st.id);

  function start() {
    phase = "play";
    inst = MS.games[st.game].create({
      data, station: st,
      finish(won, scoreText) {
        if (phase !== "play") return;
        phase = "result";
        result = { won, scoreText: scoreText || "" };
        MS.audio.play(won ? "win" : "lose");
        if (won) MS.save.award(st.id);
      },
    });
  }

  function header(g) {
    g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(0, 0, 450, 56);
    D.text(g, (st.badge ? st.badge.icon + "  " : "") + data.title, 16, 36, { size: 18, bold: true, color: C.yellow });
    if (D.button(g, { x: 392, y: 8, w: 48, h: 40 }, "✕", { size: 20, color: "#3a4256" })) leave();
  }

  // bullet list from y; returns the y below it
  function bullets(g, items, mark, y) {
    items.forEach((l) => { y += D.wrap(g, mark + " " + l, 34, y, 382, { size: 15, color: "#e8e8ee" }) + 6; });
    return y;
  }

  MS.scenes.minigame = {
    get phase() { return phase; },
    get result() { return result; },
    enter(p) {
      st = p.station;
      data = MS.data.games[st.game];
      if (!data) throw new Error("Missing data/games/" + st.game + ".js");
      phase = "intro"; inst = null; result = null;
    },

    update(dt) {
      if (I.pressed("m")) MS.ui.toast(MS.audio.toggle() ? "🔊 Sound on" : "🔇 Sound off");
      if (I.pressed("escape")) return leave();
      if (phase === "intro" && I.pressed(" ", "enter")) return start();
      if (phase === "play") inst.update(dt);
    },

    draw(g) {
      g.fillStyle = "#262c3a"; g.fillRect(0, 0, 450, 800);

      if (phase === "intro") {
        D.panel(g, 16, 72, 418, 712);
        D.photo(g, st.photo, 32, 88, 386, 200, 12);
        let y = 320;
        y += D.wrap(g, data.title, 225, y, 386, { size: 26, bold: true, align: "center", color: C.yellow }) + 8;
        y += D.wrap(g, data.intro, 34, y, 382, { size: 16, color: "#e8e8ee" }) + 18;
        D.text(g, "You'll learn about:", 34, y, { size: 15, bold: true, color: "#aab" });
        bullets(g, data.learned || [], "•", y + 28);
        if (D.button(g, { x: 115, y: 708, w: 220, h: 56 }, "▶  Start", { size: 22, color: C.good })) start();
        return header(g);
      }

      g.save(); inst.draw(g); g.restore();
      if (phase === "play") return header(g);

      // result
      g.fillStyle = "rgba(15,18,26,0.8)"; g.fillRect(0, 0, 450, 800);
      D.panel(g, 16, 72, 418, 712);
      const r = result;
      D.text(g, r.won ? "🎉" : "🔧", 225, 150, { size: 52, emoji: true, align: "center" });
      let y = 200;
      y += D.wrap(g, r.won ? "Badge earned: " + st.badge.name + "!" : "Not quite — try again!", 225, y, 386, { size: 24, bold: true, align: "center", color: r.won ? C.good : C.yellow }) + 4;
      if (r.scoreText) y += D.wrap(g, r.scoreText, 225, y, 386, { size: 15, align: "center", color: "#ccd" });
      D.text(g, "What you learned:", 34, y + 24, { size: 16, bold: true, color: "#aab" });
      bullets(g, data.learned || [], "✔", y + 54);

      const left = { x: 32, y: 708, w: 186, h: 56 }, right = { x: 232, y: 708, w: 186, h: 56 };
      if (r.won) {
        if (D.button(g, left, "Back", { color: C.good })) leave();
        if (D.button(g, right, "Play again", { color: "#3a4256" })) start();
      } else {
        if (D.button(g, left, "Try again", { color: C.accent })) start();
        if (D.button(g, right, "Back", { color: "#3a4256" })) leave();
      }
      header(g);
    },
  };
})();
