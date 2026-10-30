// Save: progress stored in the browser. Works (without saving) if storage is blocked.
(function () {
  const KEY = "makerspace-quest-v1";
  const blank = () => ({ name: "", badges: {}, introSeen: false, scanned: {} });

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
    reset() { state = blank(); write(); },

    // Stations that give a badge
    badgeStations: () => MS.data.stations.filter((s) => s.game && MS.games[s.game]),
    remaining: () => MS.save.badgeStations().filter((s) => !state.badges[s.id]),
    allDone: () => MS.save.remaining().length === 0,
  };
})();
