// Home scene: the phone-first home page. Plain HTML that scrolls like a web page.
//   enter({})          → the list of sections
//   enter({ station }) → that section, big (QR codes in the space land here: index.html?at=<id>)
//   enter({ pass })    → the Maker Pass
(function () {
  const S = MS.data.settings, M = MS.data.makerspace;
  const esc = (s) => MS.ui.esc(s);
  const U = MS.util;
  let listScroll = 0;

  const root = () => document.getElementById("home");
  const photo = (name) => "assets/photos/" + esc(name);
  const badgeCount = () => {
    const all = MS.save.badgeStations();
    return { got: all.filter((s) => MS.save.has(s.id)).length, total: all.length };
  };

  // First visit: Bolt says hi, pick a maker, PLAY. Two taps to the first game.
  function firstHero() {
    const st = MS.save.state, me = MS.save.avatar(), G = MS.data.characters.guide;
    return `<section class="hero first">
      <h1 class="logo">${esc(S.title)}</h1>
      <div class="guide-row">${MS.sprites.html(G, "wide", 104, "bob")}
        <p class="bubble">Hey, I'm ${esc(G.name)}! Pick your maker. Each mini-game takes about 30 seconds. Let's go!</p></div>
      <div class="pick">${MS.data.characters.players.map((p) => `<button class="pick-btn${p.id === me.id ? " on" : ""}" data-act="avatar" data-id="${esc(p.id)}" aria-pressed="${p.id === me.id}">
          ${MS.sprites.html(p, p.id === me.id ? "cheer0" : "idle", 92)}<small>${esc(p.name)}</small></button>`).join("")}</div>
      <input id="name" class="name-in" maxlength="16" placeholder="Your name (optional)" autocomplete="nickname" value="${esc(st.name || "")}">
      <button class="btn play" data-act="play">▶ PLAY</button>
      <p class="small center">${esc(M.host)} · mini-games, pop-up tips, badges</p>
    </section>`;
  }

  function hero() {
    const st = MS.save.state, me = MS.save.avatar();
    if (!st.played) return firstHero();
    const { got, total } = badgeCount();
    const lv = MS.save.level(), next = MS.save.nextLevel(), n = MS.save.visits();
    const playable = MS.save.remaining().filter(MS.save.canPlay).length;
    // nothing new to play today? offer the weakest game for more stars instead
    const retry = MS.save.badgeStations().filter((s) => MS.save.has(s.id) && MS.save.stars(s.id) < 3)
      .sort((a, b) => MS.save.stars(a.id) - MS.save.stars(b.id))[0];
    const main = got === total
      ? `<button class="btn play" data-go="pass">🏆 My Maker Pass</button>`
      : playable ? `<button class="btn play" data-act="play">▶ PLAY</button>`
      : retry ? `<button class="btn play" style="font-size:19px" data-go="play/${esc(retry.id)}">↻ Go for 3 ⭐: ${esc(retry.name)}</button>`
      : "";
    return `<section class="hero">
      <div class="me-row">
        <button class="me" data-act="avatar-next" title="Change your maker">${MS.sprites.html(me, "wide", 112)}</button>
        <div><h1>Hi, ${esc(st.name || S.defaultName)} 👋</h1>
          <p class="chip">Level ${lv.level} · ${esc(lv.name)} <span>· visit ${n}</span></p>
          <p class="stats">🏅 ${got} / ${total} &nbsp; ⭐ ${MS.save.totalStars()} / ${total * 3}</p></div>
      </div>
      <div class="progress"><div style="width:${(got / total) * 100}%"></div></div>
      ${main}
      <p class="small">${playable ? playable + " to play today" : got === total ? "Every badge collected!" : "All done for today!"}${next ? ` · Level ${next.level} · ${esc(next.name)} unlocks ${next.visits - n === 1 ? "on your next visit" : "in " + (next.visits - n) + " more visits"}` : ""}</p>
    </section>`;
  }

  function stationRow(s) {
    const done = MS.save.has(s.id), locked = s.game && !MS.save.canPlay(s);
    return `<button class="station${locked ? " locked" : ""}" data-go="${esc(s.id)}" style="--c:${esc(s.color)}">
      <img src="${photo(s.photo)}" alt="" loading="lazy">
      <span class="st-text"><b>${s.badge ? s.badge.icon + " " : ""}${esc(s.name)}</b><small>${esc(s.blurb)}</small></span>
      <span class="st-status">${done ? "⭐".repeat(MS.save.stars(s.id)) : locked ? "🔒" : "›"}</span>
    </button>`;
  }

  function today() {
    const t = MS.daily.today(new Date());
    const lines = t.sessions.map((s) => "👋 " + s.time + " · session with " + s.host);
    if (t.community) lines.push("🤝 " + t.community.time + " · " + t.community.name);
    if (!t.sessions.length && t.next) lines.push("Next staffed session: " + t.next.day + " " + t.next.time + " with " + t.next.host);
    return `<section class="panel">
      <h2>📅 Today · ${esc(t.day)}</h2>
      <p class="small">Open ${esc(t.open.days)}, ${esc(t.open.time)}</p>
      <ul class="plain">${lines.map((l) => "<li>" + esc(l) + "</li>").join("")}</ul>
    </section>`;
  }

  function daily() {
    const now = new Date(), q = MS.daily.question(now), st = MS.save.state;
    const where = MS.data.stations.find((s) => s.id === q.station);
    const streak = st.streak ? ` <small>🔥 ${st.streak} in a row</small>` : "";
    if (!MS.save.dailyDone(now)) {
      return `<section class="panel">
        <h2>🧠 Daily challenge${streak}</h2>
        <p class="q">${esc(q.q)}</p>
        ${q.choices.map((c, i) => `<button class="btn choice" data-act="daily" data-i="${i}">${esc(c)}</button>`).join("")}
      </section>`;
    }
    return `<section class="panel">
      <h2>🧠 Daily challenge${streak}</h2>
      <p class="q">${esc(q.q)}</p>
      <p>${st.daily.ok ? "✅ Correct!" : "❌ Not quite."} The answer: <b>${esc(q.answer)}</b></p>
      <button class="link" data-go="${esc(where.id)}">Learn more at the ${esc(where.name)} ›</button>
      <p class="small">A new question every day you come in.</p>
    </section>`;
  }

  function path() {
    const goal = MS.data.goals.find((g) => g.id === MS.save.state.goal);
    if (!goal) {
      return `<section class="panel">
        <h2>🎯 What do you want to make?</h2>
        ${MS.data.goals.map((g) => `<button class="btn choice" data-act="goal" data-id="${esc(g.id)}">${g.icon} ${esc(g.label)}</button>`).join("")}
      </section>`;
    }
    const stations = goal.stations.map((id) => MS.data.stations.find((s) => s.id === id)).filter(Boolean);
    const training = stations.some((s) => s.training);
    return `<h2>🎯 Your path: ${goal.icon} ${esc(goal.label)}</h2>` + stations.map(stationRow).join("") +
      (training ? `<p class="small">Next step for the machines: ${esc(M.howItWorks[1])}.</p>` : "") +
      `<button class="link" data-act="goal" data-id="">Change my goal</button>`;
  }

  function list() {
    const reached = MS.save.level().level;
    const levels = S.levels.map((l) =>
      `<h2>Level ${l.level} · ${esc(l.name)}${reached >= l.level ? "" : ` <small>🔒 visit ${l.visits}</small>`}</h2>` +
      MS.data.stations.filter((s) => s.level === l.level).map(stationRow).join("")).join("");
    const extra = MS.data.stations.filter((s) => !s.level);
    const sections = levels + (extra.length ? `<h2>More to see</h2>` + extra.map(stationRow).join("") : "");
    // first visit: just the hero; the sections wait behind a tap so the first screen stays clean
    if (!MS.save.state.played) {
      return hero() + `<details class="peek"><summary>Peek at the sections of the space</summary>${sections}</details>` + footer();
    }
    return hero() + today() + daily() + path() + `<h2 class="sections-title">All sections</h2>` + sections + footer();
  }

  function detail(s, scanned) {
    const done = MS.save.has(s.id);
    const game = s.game && MS.games[s.game];
    return `<article class="detail" style="--c:${esc(s.color)}">
      <button class="back" data-act="back">← All sections</button>
      ${scanned ? `<p class="here">📍 You're at the ${esc(s.name)}. Have a look around while you read!</p>` : ""}
      <img class="detail-photo" src="${photo(s.photo)}" alt="">
      <h1>${s.badge ? s.badge.icon + " " : ""}${esc(s.name)}${done ? " ✅" : ""}</h1>
      <p class="blurb">${esc(s.blurb)}</p>
      <ul>${U.resolve(s.facts).map((f) => "<li>" + esc(f) + "</li>").join("")}</ul>
      ${s.training ? `<p class="warn">⚠️ The badge shows you know the basics — it is not machine training. ${esc(M.hours.machineRule)}</p>` : ""}
      ${!game ? "" : MS.save.canPlay(s)
        ? `<button class="btn primary" data-go="play/${esc(s.id)}">${done ? "↻ Play again" : "▶ Play the mini-game"}</button>`
        : `<button class="btn" disabled>🔒 Mini-game unlocks at Level ${s.level}</button>
          <p class="small">Come back on another day to level up — or scan the QR code in this area to unlock it now.</p>`}
      ${game ? `<p class="small">Badge: ${s.badge.icon} ${esc(s.badge.name)}</p>` : ""}
    </article>`;
  }

  function pass() {
    const st = MS.save.state, h = M.hours;
    const ul = (arr) => "<ul>" + arr.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>";
    const badges = MS.save.badgeStations().map((s) =>
      `<span class="badge${MS.save.has(s.id) ? "" : " missing"}">${s.badge.icon} ${esc(s.badge.name)}</span>`).join("");
    const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    const lv = MS.save.level();
    return `<button class="back" data-act="back">← Back</button>
      <article class="pass">
        <div class="pass-head"><div class="pass-title">🏆 MAKER PASS</div><div class="pass-sub">${esc(M.name)} · ${esc(M.host)}</div></div>
        <p class="pass-name">${esc(st.name)}</p>
        <p class="small center">${MS.save.allDone() ? "has completed Makerspace onboarding" : "is learning the Makerspace"} · ${esc(date)} · Level ${lv.level} ${esc(lv.name)}</p>
        <div class="badges">${badges}</div>
        <p class="small center">Badges aren't machine training. ${esc(h.machineRule)}</p>
        <h3>Golden rules</h3>${ul(M.golden_rules)}
        <h3>When</h3>${ul([h.open.days + ", " + h.open.time, ...h.sessions.map((s) => s.day + " " + s.time + " (" + s.host + ")"), h.community.name + ": " + h.community.day + " " + h.community.time])}
        <h3>How it works</h3>${ul(M.howItWorks)}
        <h3>Our values</h3>${ul(M.values.notes.filter((n) => n.in.includes("makerspace")).map((n) => n.text))}
        <h3>Good projects are…</h3><p class="small">${esc(M.shouldIMakeIt.join(" · "))}</p>
        <p class="small">Still curious? Ask the team: ${esc(M.openQuestions.join(" · "))}</p>
      </article>
      <p class="small center">Screenshot your pass or show it to the team.</p>
      <button class="btn primary" data-act="print">🖨️ Print my Maker Pass</button>`;
  }

  function footer() {
    return `<footer>
      <button class="link" data-act="sound">${MS.audio.muted ? "🔇 Sound off" : "🔊 Sound on"}</button>
      <button class="link" data-act="reset">Reset progress</button>
    </footer>`;
  }

  let current = null, scanned = false, showPass = false;
  function render() {
    root().innerHTML = showPass ? pass() : current ? detail(current, scanned) : list();
    window.scrollTo(0, current || showPass ? 0 : listScroll);
  }

  function onClick(e) {
    const b = e.target.closest("[data-go], [data-act]");
    if (!b) return;
    MS.audio.unlock();
    MS.audio.play("click");
    if (b.dataset.go) {
      if (!current && !showPass) listScroll = window.scrollY;
      return MS.go(b.dataset.go);
    }
    const act = b.dataset.act;
    if (act === "back") MS.back();
    if (act === "print") window.print();
    if (act === "avatar") { keepName(); MS.save.set("avatar", b.dataset.id); render(); }
    if (act === "avatar-next") {
      const P = MS.data.characters.players, i = P.indexOf(MS.save.avatar());
      MS.save.set("avatar", P[(i + 1) % P.length].id);
      render();
    }
    if (act === "play") { keepName(); listScroll = 0; return MS.go("wheel"); }
    if (act === "goal") { MS.save.set("goal", b.dataset.id || null); render(); }
    if (act === "daily") {
      const now = new Date(), q = MS.daily.question(now), ok = q.choices[b.dataset.i] === q.answer;
      MS.audio.play(ok ? "good" : "bad");
      MS.save.answerDaily(now, ok);
      render();
    }
    if (act === "sound") { MS.audio.toggle(); render(); }
    if (act === "reset" && confirm("Delete all your badges and start over?")) { MS.save.reset(); render(); }
  }

  // the optional name box on the first screen: keep what was typed before re-rendering / playing
  function keepName() {
    const el = document.getElementById("name");
    if (el) MS.save.set("name", (el.value || "").trim());
  }

  function onSubmit(e) {
    e.preventDefault();
    keepName();
  }

  MS.scenes.home = {
    html: true,
    enter(p) {
      current = p.station || null;
      showPass = !!p.pass;
      if (showPass && MS.save.allDone()) MS.audio.play("win");
      scanned = !!p.scanned;
      if (scanned) MS.save.scan(current.id);
      const el = root();
      el.onclick = onClick;
      el.onsubmit = onSubmit;
      el.onkeydown = (e) => {
        if (e.key === "Enter" && e.target.id === "name") { keepName(); MS.audio.unlock(); MS.go("wheel"); }
      };
      render();
    },
  };
})();
