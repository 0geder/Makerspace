// Mini-game: HOURS — "Open or Closed?". A day + time appears; tap OPEN or CLOSED.
// Whether it's open is worked out from data/makerspace.js by MS.daily.status().
MS.games.hours = {
  create(api) {
    const D = MS.draw, I = MS.input, U = MS.util, C = MS.data.settings.colors;
    const d = api.data, H = MS.data.makerspace.hours, DAYS = MS.daily.DAYS;
    const fmt = (h) => (h % 12 || 12) + (h < 12 ? "am" : "pm");

    // a mix of open and closed times
    const all = [];
    DAYS.forEach((_, day) => d.times.forEach((hour) => all.push(Object.assign({ day, hour }, MS.daily.status(day, hour)))));
    const open = U.shuffle(all.filter((c) => c.open)), shut = U.shuffle(all.filter((c) => !c.open));
    const nOpen = Math.min(open.length, Math.ceil(d.cards / 2));
    const cards = U.shuffle(open.slice(0, nOpen).concat(shut.slice(0, d.cards - nOpen)));

    const no = { x: 16, y: 520, w: 203, h: 110 }, yes = { x: 231, y: 520, w: 203, h: 110 };
    let i = 0, score = 0, time = d.secondsPerCard, fb = null;

    function explain(c) {
      if (c.open) return "Open! " + c.why.join(" · ");
      const s = H.sessions.find((x) => x.day === DAYS[c.day]);
      return "Closed then. Open " + H.open.days + ", " + H.open.time + "." + (s ? " " + s.day + "s: " + s.host + "'s session " + s.time + "." : "");
    }

    function answer(sayOpen) {
      if (fb) return;
      const c = cards[i], ok = sayOpen === c.open;
      const r = sayOpen ? yes : sayOpen === false ? no : { x: 225, y: 300, w: 0, h: 0 };
      if (ok) { score++; api.good(r.x + r.w / 2, r.y); } else api.bad(r.x + r.w / 2, r.y, sayOpen == null ? "⏰" : "✗");
      api.say(explain(c));
      fb = { ok, t: ok ? 1.1 : 1.8 };
    }

    return {
      update(dt) {
        if (fb) {
          fb.t -= dt;
          if (fb.t <= 0) {
            fb = null; i++; time = d.secondsPerCard;
            if (i >= cards.length) {
              const ratio = score / cards.length;
              api.finish(ratio >= d.passMark, score + " / " + cards.length + " right", ratio);
            }
          }
          return;
        }
        time -= dt;
        if (time <= 0) return answer(null);
        if (I.clickIn(yes) || I.pressed("arrowright", "o") || I.swipe > 0) answer(true);
        else if (I.clickIn(no) || I.pressed("arrowleft", "c") || I.swipe < 0) answer(false);
      },
      draw(g) {
        if (i >= cards.length) return;
        const c = cards[i];
        D.text(g, "Card " + (i + 1) + " / " + cards.length + "   ✔ " + score, 225, 92, { size: 16, align: "center", color: "#ccd" });
        // the calendar card
        const col = fb ? (c.open ? C.good : C.bad) : "#f3efe6";
        D.rr(g, 55, 118, 340, 330, 22, "rgba(0,0,0,0.3)");
        D.rr(g, 50, 112, 340, 330, 22, col);
        D.rr(g, 50, 112, 340, 70, 22, C.accent);
        g.fillStyle = C.accent; g.fillRect(50, 150, 340, 32); // square off the bottom corners
        D.text(g, DAYS[c.day].toUpperCase(), 220, 160, { size: 28, bold: true, align: "center" });
        D.text(g, "🕒", 220, 270, { size: 64, emoji: true, align: "center" });
        D.text(g, fmt(c.hour), 220, 372, { size: 60, bold: true, align: "center", color: fb ? "#fff" : "#1f2430" });
        if (fb) D.text(g, c.open ? "OPEN" : "CLOSED", 220, 422, { size: 22, bold: true, align: "center" });
        D.bar(g, 50, 462, 340, 10, fb ? 0 : time / d.secondsPerCard, time < 2 ? C.bad : C.yellow);
        if (!fb) {
          if (D.button(g, no, "CLOSED", { color: C.bad, size: 26 })) answer(false);
          if (D.button(g, yes, "OPEN", { color: C.good, size: 26 })) answer(true);
        }
      },
    };
  },
};
