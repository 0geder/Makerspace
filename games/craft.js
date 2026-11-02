// Mini-game: CRAFT — "Match the Machine". A maker asks for something; tap the photo of the right machine.
MS.games.craft = {
  create(api) {
    const D = MS.draw, I = MS.input, U = MS.util, SP = MS.sprites, C = MS.data.settings.colors;
    const d = api.data;
    const me = MS.save.avatar();
    const customers = MS.data.characters.players.filter((p) => p.id !== me.id);
    const rounds = U.shuffle(d.requests).slice(0, d.rounds).map((r) => {
      const right = d.machines.find((m) => m.id === r.machine);
      const others = U.shuffle(d.machines.filter((m) => m.id !== r.machine)).slice(0, 3);
      return { text: r.text, right, choices: U.shuffle([right].concat(others)), who: U.pick(customers) };
    });
    const rect = (k) => ({ x: 16 + (k % 2) * 215, y: 290 + Math.floor(k / 2) * 196, w: 203, h: 184 });
    let i = 0, score = 0, time = d.secondsPerRequest, fb = null, t = 0;

    function choose(k) {
      if (fb) return;
      const R = rounds[i], ok = k >= 0 && R.choices[k] === R.right;
      const r = k >= 0 ? rect(k) : { x: 225, y: 250, w: 0 };
      if (ok) { score++; api.good(r.x + r.w / 2, r.y + 20); api.say(R.right.pop); }
      else { api.bad(r.x + r.w / 2, r.y + 20, k < 0 ? "⏰" : "✗"); api.say("That's a job for the " + R.right.name + ". " + R.right.pop); }
      fb = { ok, k, t: ok ? 1.0 : 1.8 };
    }

    return {
      update(dt) {
        t += dt;
        if (fb) {
          fb.t -= dt;
          if (fb.t <= 0) {
            fb = null; i++; time = d.secondsPerRequest;
            if (i >= rounds.length) {
              const ratio = score / rounds.length;
              api.finish(ratio >= d.passMark, score + " / " + rounds.length + " makers helped", ratio);
            }
          }
          return;
        }
        time -= dt;
        if (time <= 0) return choose(-1);
        rounds[i].choices.forEach((_, k) => { if (I.clickIn(rect(k)) || I.pressed(String(k + 1))) choose(k); });
      },
      draw(g) {
        if (i >= rounds.length) return;
        const R = rounds[i];
        // the maker asking
        const pose = fb ? (fb.ok ? SP.cheer(t) : "think") : "talk";
        SP.draw(g, R.who, pose, 66, 262, { h: 180 });
        D.rr(g, 132, 76, 302, 152, 16, "#fff");
        g.fillStyle = "#fff"; g.beginPath(); g.moveTo(134, 170); g.lineTo(116, 186); g.lineTo(134, 190); g.fill();
        D.wrap(g, "“" + R.text + "”", 283, 152, 276, { size: 18, bold: true, align: "center", valign: "middle", color: "#1f2430" });
        D.bar(g, 132, 240, 302, 10, fb ? 0 : time / d.secondsPerRequest, time < 2 ? C.bad : C.yellow);
        D.text(g, "Maker " + (i + 1) + " / " + rounds.length + "   ✔ " + score, 283, 274, { size: 14, align: "center", color: "#aab" });
        R.choices.forEach((m, k) => {
          const r = rect(k);
          const isRight = fb && m === R.right, isWrong = fb && k === fb.k && !fb.ok;
          D.rr(g, r.x, r.y, r.w, r.h, 14, isRight ? C.good : isWrong ? C.bad : MS.input.hover(r) && !fb ? "#3a4256" : "#2a3142", "rgba(255,255,255,0.2)", 2);
          D.photo(g, m.photo, r.x + 8, r.y + 8, r.w - 16, r.h - 54, 10);
          D.wrap(g, m.name, r.x + r.w / 2, r.y + r.h - 24, r.w - 12, { size: 16, bold: true, align: "center", valign: "middle" });
        });
      },
    };
  },
};
