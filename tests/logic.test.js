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
  for (const f of ["data/settings.js", "data/makerspace.js", "data/stations.js", "data/characters.js", ...games, "engine/core.js", "engine/save.js", "engine/daily.js"]) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, "..", f), "utf8"), ctx, { filename: f });
  }
  return ctx.MS;
}
// arrays made inside the sandbox have their own prototype: compare them as JSON
const same = (a, b) => assert.strictEqual(JSON.stringify(a), JSON.stringify(b));
// Read stations and levels from the data, so staff can edit hours, levels and stations freely.
const station = (MS, id) => MS.data.stations.find((s) => s.id === id);
const byLevel = (MS, n) => MS.data.stations.find((s) => s.game && s.level === n);
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dateFor = (dayName) => { const d = new Date(2026, 9, 25, 9); while (DAYS[d.getDay()] !== dayName) d.setDate(d.getDate() + 1); return d; };

// first visit: level 1 only
let MS = boot();
assert.strictEqual(MS.save.visits(), 1);
assert.strictEqual(MS.save.level().level, 1);
const L = MS.data.settings.levels, top = L[L.length - 1];
const first = byLevel(MS, 1), last = byLevel(MS, top.level);
assert.ok(MS.save.canPlay(first));
assert.ok(!MS.save.canPlay(last));

// dates are local: 00:30 on 30 Oct in UTC+2 is still the 30th (UTC says the 29th)
assert.strictEqual(MS.save.dayKey(new Date(2026, 9, 30, 0, 30)), "2026-10-30");

// reopening on the same day is not a new visit; new days are
MS.save.visit(new Date());
assert.strictEqual(MS.save.visits(), 1);
for (let i = 1; i < top.visits; i++) MS.save.visit(new Date(2020, 0, i, 12));
assert.strictEqual(MS.save.visits(), top.visits);
assert.strictEqual(MS.save.level().name, top.name);
assert.ok(MS.save.canPlay(last));
assert.strictEqual(MS.save.nextLevel(), null);

// starting over keeps your visits
MS.save.reset();
assert.strictEqual(MS.save.visits(), top.visits);

// scanning an area's QR unlocks only that area early
MS = boot();
const locked = MS.data.stations.filter((s) => s.game && s.level > 1);
MS.save.scan(locked[0].id);
assert.ok(MS.save.canPlay(locked[0]));
assert.ok(!MS.save.canPlay(locked[1]));

// saves from before levels existed still load, with their badges
MS = boot({ name: "Old", badges: { [last.id]: true }, target: null, introSeen: true });
assert.ok(MS.save.has(last.id) && MS.save.canPlay(station(MS, last.id)));
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

// today: a session day lists its session; the meetup shows on its day; other days point to the next session
const H = MS.data.makerspace.hours, s0 = H.sessions[0];
assert.ok(MS.daily.today(dateFor(s0.day)).sessions.includes(s0));
assert.ok(MS.daily.today(dateFor(H.community.day)).community);
const quiet = DAYS.find((d) => !H.sessions.some((s) => s.day === d));
if (quiet) assert.ok(H.sessions.includes(MS.daily.today(dateFor(quiet)).next));

// opening hours ("Open or Closed?" game): the strings in data/makerspace.js parse
same(MS.daily.hourRange("9am – 3pm"), [9, 15]);
same(MS.daily.hourRange("2pm – 5pm"), [14, 17]);
same(MS.daily.hourRange("2 – 5pm"), [14, 17]);
same(MS.daily.hourRange("11 – 1pm"), [11, 13]);
same(MS.daily.dayRange("Monday – Friday"), [1, 2, 3, 4, 5]);
same(MS.daily.dayRange("Tuesday"), [2]);
[H.open.time, H.community.time, ...H.sessions.map((s) => s.time)].forEach((t) => assert.ok(MS.daily.hourRange(t), t));
// inside the open hours is open, the middle of the night never is, and every session is open with its host named
const [o0] = MS.daily.hourRange(H.open.time), od = MS.daily.dayRange(H.open.days)[0];
assert.ok(MS.daily.status(od, o0).open);
assert.ok(!MS.daily.status(od, 3).open);
H.sessions.forEach((s) => {
  const st = MS.daily.status(DAYS.indexOf(s.day), MS.daily.hourRange(s.time)[0]);
  assert.ok(st.open && st.why.some((w) => w.includes(s.host)), s.host);
});
// the game's card times give both open and closed answers, so it can deal a mix
const times = MS.data.games.hours.times, all = [];
DAYS.forEach((_, d) => times.forEach((h) => all.push(MS.daily.status(d, h).open)));
assert.ok(all.includes(true) && all.includes(false));

// stars: the best result is kept, and a badge always counts at least one star
MS = boot();
const st1 = byLevel(MS, 1);
MS.save.award(st1.id, 3); MS.save.award(st1.id, 1);
assert.strictEqual(MS.save.stars(st1.id), 3);
MS.games[st1.game] = {}; // badge stations need their game logic loaded; the tests don't load /games
assert.strictEqual(MS.save.totalStars(), 3);
MS = boot({ name: "Old", badges: { [st1.id]: true } });
assert.strictEqual(MS.save.stars(st1.id), 1);
assert.strictEqual(MS.save.avatar().id, MS.data.characters.players[0].id);

// every mini-game is short (≤ 6 rounds) and has the one-liners the ready / result screens need
const G = MS.data.games;
for (const [id, g] of Object.entries(G)) {
  assert.ok(g.title && g.howTo && g.remember, id + ": title, howTo and remember");
  const len = g.rounds || g.cards || g.targetHits || g.layersToWin || g.catchesToWin || (g.steps && g.steps.length);
  assert.ok(len && len <= 6, id + " has " + len + " rounds");
}
MS.data.stations.filter((s) => s.game).forEach((s) => assert.ok(s.tip, s.id + " has a tip"));

console.log("ok — save / visit / level / daily / hours / stars logic");
