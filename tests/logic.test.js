// Self-check for the save / visit / level logic. Run: node tests/logic.test.js
const fs = require("fs"), path = require("path"), vm = require("vm"), assert = require("assert");
process.env.TZ = "Africa/Kigali"; // UTC+2 like the space, so a UTC date bug shows up after midnight

// Load the browser scripts into a sandbox with a fake localStorage.
function boot(saved) {
  const store = { "makerspace-quest-v1": saved ? JSON.stringify(saved) : null };
  const ctx = { console, localStorage: { getItem: (k) => store[k] || null, setItem: (k, v) => (store[k] = v) } };
  ctx.window = ctx;
  vm.createContext(ctx);
  const games = fs.readdirSync(path.join(__dirname, "..", "data/games")).filter((f) => f.endsWith(".js")).map((f) => "data/games/" + f);
  for (const f of ["data/settings.js", "data/makerspace.js", "data/stations.js", ...games, "engine/core.js", "engine/save.js", "engine/daily.js"]) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, "..", f), "utf8"), ctx, { filename: f });
  }
  return ctx.MS;
}
const station = (MS, id) => MS.data.stations.find((s) => s.id === id);

// first visit: level 1 only
let MS = boot();
assert.strictEqual(MS.save.visits(), 1);
assert.strictEqual(MS.save.level().level, 1);
assert.ok(MS.save.canPlay(station(MS, "entrance")));
assert.ok(!MS.save.canPlay(station(MS, "laser")));

// dates are local: 00:30 on 30 Oct in UTC+2 is still the 30th (UTC says the 29th)
assert.strictEqual(MS.save.dayKey(new Date(2026, 9, 30, 0, 30)), "2026-10-30");

// reopening on the same day is not a new visit; new days are
MS.save.visit(new Date());
assert.strictEqual(MS.save.visits(), 1);
["2020-01-01", "2020-01-02", "2020-01-03"].forEach((d) => MS.save.visit(new Date(d + "T12:00:00")));
assert.strictEqual(MS.save.visits(), 4);
assert.strictEqual(MS.save.level().name, "Maker");
assert.ok(MS.save.canPlay(station(MS, "laser")));
assert.strictEqual(MS.save.nextLevel(), null);

// starting over keeps your visits
MS.save.reset();
assert.strictEqual(MS.save.visits(), 4);

// scanning an area's QR unlocks it early
MS = boot();
MS.save.scan("laser");
assert.ok(MS.save.canPlay(station(MS, "laser")));
assert.ok(!MS.save.canPlay(station(MS, "printing")));

// saves from before levels existed still load, with their badges
MS = boot({ name: "Old", badges: { tools: true }, target: null, introSeen: true });
assert.ok(MS.save.has("tools") && MS.save.canPlay(station(MS, "tools")));
assert.strictEqual(MS.save.visits(), 1);

// daily challenge: same question all day, and every question is answerable
const day = new Date(2026, 9, 27, 9), later = new Date(2026, 9, 27, 18);
assert.strictEqual(MS.daily.question(day).q, MS.daily.question(later).q);
MS.daily.pool().forEach((q) => {
  assert.ok(q.answer && q.wrong.length >= 1 && !q.wrong.includes(q.answer), q.q);
  assert.ok(MS.data.stations.some((s) => s.id === q.station), q.station);
});
MS.save.answerDaily(day, true); MS.save.answerDaily(new Date(2026, 9, 28), true);
assert.strictEqual(MS.save.state.streak, 2);
assert.ok(MS.save.dailyDone(new Date(2026, 9, 28, 20)) && !MS.save.dailyDone(new Date(2026, 9, 29)));
MS.save.answerDaily(new Date(2026, 9, 29), false);
assert.strictEqual(MS.save.state.streak, 0);

// today: 27 Oct 2026 is a Tuesday (session + meetup); Saturday points to Monday's session
const tue = MS.daily.today(day);
assert.strictEqual(tue.day, "Tuesday");
assert.ok(tue.sessions.length === 1 && tue.community);
assert.strictEqual(MS.daily.today(new Date(2026, 9, 31)).next.day, "Monday");

console.log("ok — save / visit / level / daily logic");
