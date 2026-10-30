// Save: progress stored in the browser. Works (without saving) if storage is blocked.
(function () {
  const KEY = "makerspace-quest-v1";
  const blank = () => ({ name: "", badges: {}, introSeen: false, scanned: {}, days: [], daily: null, streak: 0, goal: null });

  let state = blank();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = Object.assign(blank(), JSON.parse(raw));
  } catch (e) { /* storage unavailable */ }

  const write = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  };

  MS.save = {
    get state() { return state; },
    set(field, value) { state[field] = value; write(); },
    award(stationId) { state.badges[stationId] = true; write(); },
    scan(stationId) { state.scanned[stationId] = true; write(); },
    has: (stationId) => !!state.badges[stationId],
    // keeps the visit history: starting over shouldn't re-lock levels you came back for
    reset() { state = Object.assign(blank(), { days: state.days }); write(); },

    // daily challenge: one answer per day; the streak counts right answers in a row (gaps between visits are fine)
    answerDaily(date, ok) {
      state.daily = { day: MS.save.dayKey(date), ok };
      state.streak = ok ? state.streak + 1 : 0;
      write();
    },
    dailyDone: (date) => !!state.daily && state.daily.day === MS.save.dayKey(date),

    // --- visits & levels. A visit = a calendar day (local time) the game was opened.
    dayKey: (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"),
    visit(date) {
      const k = MS.save.dayKey(date);
      if (!state.days.includes(k)) { state.days.push(k); write(); }
    },
    visits: () => state.days.length,
    // the highest level reached, e.g. { level: 2, name: "Member", visits: 2 }
    level() {
      const L = MS.data.settings.levels;
      return L.filter((l) => MS.save.visits() >= l.visits).pop() || L[0];
    },
    nextLevel: () => MS.data.settings.levels.find((l) => MS.save.visits() < l.visits) || null,
    // a mini-game is playable once its level is reached, or early if its QR code was scanned
    canPlay: (st) => MS.data.settings.debug || !st.level || MS.save.level().level >= st.level ||
      !!state.scanned[st.id] || MS.save.has(st.id),

    // Stations that give a badge
    badgeStations: () => MS.data.stations.filter((s) => s.game && MS.games[s.game]),
    remaining: () => MS.save.badgeStations().filter((s) => !state.badges[s.id]),
    allDone: () => MS.save.remaining().length === 0,
  };

  MS.save.visit(new Date());
})();
