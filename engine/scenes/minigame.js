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
    g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(0, 0, 960, 44);
    D.text(g, (st.badge ? st.badge.icon + "  " : "") + data.title, 20, 29, { size: 20, bold: true, color: C.yellow });
    if (D.button(g, { x: 900, y: 5, w: 50, h: 34 }, "✕", { size: 18, color: "#3a4256" })) leave();
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
      g.fillStyle = "#262c3a"; g.fillRect(0, 0, 960, 600);
      header(g);

      if (phase === "intro") {
        D.panel(g, 120, 80, 720, 460);
        D.photo(g, st.photo, 150, 105, 260, 190, 12);
        D.text(g, data.title, 440, 140, { size: 30, bold: true, color: C.yellow });
        D.wrap(g, data.intro, 440, 185, 370, { size: 17, color: "#e8e8ee", baseline: "middle" });
        D.text(g, "You'll learn about:", 150, 335, { size: 16, bold: true, color: "#aab" });
        let y = 365;
        (data.learned || []).forEach((l) => { y += D.wrap(g, "• " + l, 150, y, 660, { size: 15, color: "#dde", baseline: "middle" }) + 4; });
        if (D.button(g, { x: 380, y: 470, w: 200, h: 50 }, "▶  Start", { size: 22, color: C.good })) start();
        return;
      }

      if (phase === "play") {
        g.save(); inst.draw(g); g.restore();
        return;
      }

      // result
      g.save(); inst.draw(g); g.restore();
      g.fillStyle = "rgba(15,18,26,0.75)"; g.fillRect(0, 0, 960, 600);
      D.panel(g, 140, 70, 680, 470);
      const r = result;
      D.text(g, r.won ? "🎉" : "🔧", 480, 140, { size: 52, emoji: true, align: "center" });
      D.text(g, r.won ? "Badge earned: " + st.badge.name + "!" : "Not quite — try again!", 480, 195, { size: 28, bold: true, align: "center", color: r.won ? C.good : C.yellow });
      if (r.scoreText) D.text(g, r.scoreText, 480, 226, { size: 16, align: "center", color: "#ccd" });
      D.text(g, "What you learned:", 180, 270, { size: 17, bold: true, color: "#aab" });
      let y = 300;
      (data.learned || []).forEach((l) => { y += D.wrap(g, "✔ " + l, 180, y, 600, { size: 16, color: "#eef", baseline: "middle" }) + 6; });

      if (r.won) {
        if (D.button(g, { x: 290, y: 465, w: 180, h: 50 }, "Back", { color: C.good })) leave();
        if (D.button(g, { x: 490, y: 465, w: 180, h: 50 }, "Play again", { color: "#3a4256" })) start();
      } else {
        if (D.button(g, { x: 290, y: 465, w: 180, h: 50 }, "Try again", { color: C.accent })) start();
        if (D.button(g, { x: 490, y: 465, w: 180, h: 50 }, "Back", { color: "#3a4256" })) leave();
      }
    },
  };
})();
