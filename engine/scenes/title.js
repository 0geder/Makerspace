// Title scene: name entry, continue / new game.
(function () {
  const D = MS.draw;
  const S = MS.data.settings;
  const icons = ["🔨", "🖨️", "⚡", "♻️", "🎨", "💡", "📐", "🪛", "🧵", "🦜"];
  let floaters = [];

  function showMenu() {
    const st = MS.save.state;
    const done = Object.keys(st.badges).length;
    const total = MS.save.badgeStations().length;
    const hasSave = !!st.name;
    MS.ui.card({
      title: S.title,
      blurb: S.subtitle + " " + MS.data.makerspace.host + ".",
      noEscape: true,
      html:
        '<label class="field">What should we call you?<input id="name" maxlength="16" value="' +
        MS.ui.esc(st.name || "") + '" placeholder="' + MS.ui.esc(S.player.defaultName) + '"></label>' +
        (hasSave ? '<p class="small">Saved progress: ' + done + " / " + total + " badges.</p>" : "") +
        '<p class="small">Move: WASD / arrows or click · Interact: E / Space · Sound: M</p>',
      buttons: [
        {
          label: hasSave ? "Continue" : "Start",
          primary: true,
          onClick: (ov) => {
            const name = (ov.querySelector("#name").value || "").trim() || S.player.defaultName;
            MS.save.set("name", name);
            MS.engine.setScene("world");
          },
        },
      ].concat(hasSave ? [{
        label: "New game",
        onClick: (ov) => {
          const name = (ov.querySelector("#name").value || "").trim();
          MS.save.reset();
          if (name) MS.save.set("name", name);
          showMenu();
        },
      }] : []),
    });
    const input = document.getElementById("name");
    if (input) input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") document.querySelector(".card-buttons .primary").click();
    });
  }

  MS.scenes.title = {
    enter() {
      floaters = Array.from({ length: 26 }, () => ({
        x: Math.random() * 960, y: Math.random() * 600,
        s: 18 + Math.random() * 22, v: 10 + Math.random() * 25, ic: MS.util.pick(icons),
      }));
      showMenu();
    },
    update(dt) {
      floaters.forEach((f) => { f.y -= f.v * dt; if (f.y < -30) { f.y = 630; f.x = Math.random() * 960; } });
      if (!MS.ui.isOpen()) showMenu();
    },
    draw(g) {
      const grd = g.createLinearGradient(0, 0, 0, 600);
      grd.addColorStop(0, "#1f2430"); grd.addColorStop(1, "#3a2d4a");
      g.fillStyle = grd; g.fillRect(0, 0, 960, 600);
      g.globalAlpha = 0.5;
      floaters.forEach((f) => D.text(g, f.ic, f.x, f.y, { size: f.s, emoji: true }));
      g.globalAlpha = 1;
    },
  };
})();
