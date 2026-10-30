// Finale scene: the Maker Pass certificate (the "you won" screen).
(function () {
  const D = MS.draw;
  const C = MS.data.settings.colors;
  let confetti = [];

  function certificate() {
    const M = MS.data.makerspace, esc = MS.ui.esc;
    const st = MS.save.state;
    const badges = MS.save.badgeStations().map((s) =>
      '<span class="badge' + (MS.save.has(s.id) ? "" : " missing") + '">' + s.badge.icon + " " + esc(s.badge.name) + "</span>").join("");
    const list = (arr) => "<ul>" + arr.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>";
    const h = M.hours;
    const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

    MS.ui.card({
      wide: true,
      noEscape: true,
      html:
        '<div class="pass">' +
        '<div class="pass-head"><div class="pass-title">MAKER PASS</div><div class="pass-sub">' + esc(M.name) + " · " + esc(M.host) + "</div></div>" +
        '<p class="pass-name">' + esc(st.name) + '</p><p class="small">has completed Makerspace onboarding on ' + esc(date) + "</p>" +
        '<div class="badges">' + badges + "</div>" +
        '<div class="cols">' +
        "<div><h3>Golden rules</h3>" + list(M.golden_rules) + "</div>" +
        "<div><h3>When</h3>" + list([
          h.open.days + ", " + h.open.time,
          ...h.sessions.map((s) => s.day + " " + s.time + " (" + s.host + ")"),
          h.community.name + ": " + h.community.day + " " + h.community.time,
        ]) +
        "<h3>How it works</h3>" + list(M.howItWorks) + "</div>" +
        "<div><h3>Our values</h3>" + list(M.values.notes.filter((n) => n.in.includes("makerspace")).map((n) => n.text)) +
        "<h3>Good projects are…</h3><p class=\"small\">" + esc(M.shouldIMakeIt.join(" · ")) + "</p></div>" +
        "</div>" +
        '<p class="small">Still curious? Ask the team: ' + esc(M.openQuestions.join(" · ")) + "</p>" +
        "</div>",
      buttons: [
        { label: "🖨️ Print my Maker Pass", primary: true, keepOpen: true, onClick: () => window.print() },
        { label: "Back", onClick: () => MS.back() },
        { label: "Start over", onClick: () => { MS.save.reset(); location.replace("#"); } },
      ],
    });
  }

  MS.scenes.finale = {
    enter() {
      MS.audio.play("win");
      confetti = Array.from({ length: 150 }, () => ({
        x: Math.random() * 960, y: Math.random() * -600, v: 60 + Math.random() * 120,
        c: MS.util.pick([C.yellow, C.accent, C.good, "#2f80ed", "#9b59b6"]), s: 4 + Math.random() * 6, r: Math.random() * 6,
      }));
      certificate();
    },
    update(dt) {
      confetti.forEach((p) => { p.y += p.v * dt; p.r += dt * 4; if (p.y > 620) { p.y = -10; p.x = Math.random() * 960; } });
      if (!MS.ui.isOpen()) certificate();
    },
    draw(g) {
      g.fillStyle = "#1f2430"; g.fillRect(0, 0, 960, 600);
      confetti.forEach((p) => { g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
      D.text(g, "🏆", 480, 80, { size: 40, emoji: true, align: "center" });
    },
  };
})();
