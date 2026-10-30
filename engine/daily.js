// Daily: "Today at the Makerspace" and the one-question daily challenge.
// Questions are built from the mini-game data, so editing a game's content updates the pool too.
(function () {
  const U = MS.util;
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const G = () => MS.data.games;
  let cached = {};
  const others = (all, right, n) => U.shuffle(all.filter((x) => x !== right)).slice(0, n);

  // Every question: { q, answer, wrong:[...], station }
  function pool() {
    const g = G(), qs = [];
    const add = (station, list) => list.forEach((x) => qs.push(Object.assign({ station }, x)));
    add("community", g.hours.questions);
    add("printing", g.printing.checks);
    add("laser", g.laser.materials.map((m) => ({
      q: "Is " + m.name + " safe to cut on the laser?",
      answer: m.safe ? "Yes — it's laser-safe" : "No — never laser it",
      wrong: [m.safe ? "No — never laser it" : "Yes — it's laser-safe"],
    })));
    const bins = g.recycling.bins;
    add("recycling", g.recycling.items.map((it) => {
      const right = bins.find((b) => b.id === it.bin).label;
      return { q: "Where does this go: " + it.name + "?", answer: right, wrong: bins.map((b) => b.label).filter((l) => l !== right) };
    }));
    add("tools", g.tools.tools.map((t) => ({
      q: "Which tool would you grab to: " + t.task.toLowerCase() + "?",
      answer: t.name, wrong: others(g.tools.tools, t, 3).map((o) => o.name),
    })));
    add("craft", g.craft.requests.map((r) => {
      const m = g.craft.machines.find((x) => x.id === r.machine);
      return { q: "Which machine? “" + r.text + "”", answer: m.name, wrong: others(g.craft.machines, m, 3).map((o) => o.name) };
    }));
    add("ideas", g.ideas.cards.map((c) => ({
      q: "Should this be made in the Makerspace? “" + c.text + "”",
      answer: c.ok ? "Yes, make it!" : "No, not here", wrong: [c.ok ? "No, not here" : "Yes, make it!"],
    })));
    return qs;
  }

  MS.daily = {
    pool,

    // Same question for everyone on the same day; choices keep their order while the page is open.
    question(date) {
      const key = MS.save.dayKey(date);
      if (cached.key === key) return cached.q;
      let h = 0;
      for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      const all = pool(), q = all[h % all.length];
      cached = { key, q: Object.assign({}, q, { choices: U.shuffle([q.answer].concat(q.wrong)) }) };
      return cached.q;
    },

    // Who's around today, from data/makerspace.js
    today(date) {
      const H = MS.data.makerspace.hours, day = DAYS[date.getDay()];
      const nextSession = () => {
        for (let i = 1; i <= 7; i++) {
          const s = H.sessions.find((x) => x.day === DAYS[(date.getDay() + i) % 7]);
          if (s) return s;
        }
        return null;
      };
      return {
        day,
        open: H.open,
        sessions: H.sessions.filter((s) => s.day === day),
        community: H.community.day === day ? H.community : null,
        next: nextSession(),
      };
    },
  };
})();
