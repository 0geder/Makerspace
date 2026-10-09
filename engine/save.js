// Save: progress stored in the browser. Works (without saving) if storage is blocked.
(function () {
  const KEY = "makerspace-quest-v1";
  const blank = () => ({ name: "", badges: {}, target: null, introSeen: false });

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
    award(stationId) { state.badges[stationId] = true; if (state.target === stationId) state.target = null; write(); },
    has: (stationId) => !!state.badges[stationId],
    reset() { state = blank(); write(); },

    // Stations that give a badge
    badgeStations: () => MS.data.stations.filter((s) => s.game && MS.games[s.game]),
    remaining: () => MS.save.badgeStations().filter((s) => !state.badges[s.id]),
    allDone: () => MS.save.remaining().length === 0,
  };
})();
