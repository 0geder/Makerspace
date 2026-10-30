// Home scene: the phone-first home page. Plain HTML that scrolls like a web page.
//   enter({})          → the list of sections
//   enter({ station }) → that section, big (QR codes in the space land here: index.html#<id>)
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

  function hero() {
    const st = MS.save.state;
    if (!st.name) {
      return `<section class="hero">
        <h1>${esc(S.title)}</h1>
        <p class="blurb">${esc(S.subtitle)} ${esc(M.host)}.</p>
        <form id="name-form">
          <label class="field">What should we call you?
            <input id="name" maxlength="16" placeholder="${esc(S.defaultName)}" autocomplete="nickname">
          </label>
          <button class="btn primary">Let's make!</button>
        </form>
      </section>`;
    }
    const { got, total } = badgeCount();
    const lv = MS.save.level(), next = MS.save.nextLevel(), n = MS.save.visits();
    return `<section class="hero">
      <h1>Hi, ${esc(st.name)} 👋</h1>
      <p class="chip">⭐ Level ${lv.level} · ${esc(lv.name)} <span>· visit ${n}</span></p>
      <div class="progress"><div style="width:${(got / total) * 100}%"></div></div>
      <p class="small">${got} / ${total} badges collected${next ? ` · come back on ${next.visits - n === 1 ? "another day" : (next.visits - n) + " more days"} to reach Level ${next.level} · ${esc(next.name)}` : ""}</p>
    </section>`;
  }

  function intro() {
    if (!MS.save.state.name || MS.save.state.introSeen) return "";
    return `<section class="panel">
      <h2>How it works</h2>
      <ul>
        <li>Tap a section of the Makerspace to read about it, or spin the wheel for a surprise.</li>
        <li>Win its mini-game to earn the badge.</li>
        <li>New sections unlock each time you come back on a different day — or scan the QR code in an area to unlock it right away.</li>
        <li>Collect all ${badgeCount().total} badges to earn your Maker Pass.</li>
      </ul>
      <button class="btn" data-act="intro-ok">Got it</button>
    </section>`;
  }

  function stationRow(s) {
    const done = MS.save.has(s.id), locked = s.game && !MS.save.canPlay(s);
    return `<button class="station${locked ? " locked" : ""}" data-go="${esc(s.id)}" style="--c:${esc(s.color)}">
      <img src="${photo(s.photo)}" alt="" loading="lazy">
      <span class="st-text"><b>${s.badge ? s.badge.icon + " " : ""}${esc(s.name)}</b><small>${esc(s.blurb)}</small></span>
      <span class="st-status">${done ? "✅" : locked ? "🔒" : "›"}</span>
    </button>`;
  }

  function list() {
    const { got, total } = badgeCount();
    const actions = got === total
      ? `<button class="btn primary" data-go="pass">🏆 Get my Maker Pass</button>`
      : `<button class="btn primary" data-go="wheel">🎲 Spin the Maker Wheel</button>`;
    const reached = MS.save.level().level;
    const levels = S.levels.map((l) =>
      `<h2>Level ${l.level} · ${esc(l.name)}${reached >= l.level ? "" : ` <small>🔒 visit ${l.visits}</small>`}</h2>` +
      MS.data.stations.filter((s) => s.level === l.level).map(stationRow).join("")).join("");
    const extra = MS.data.stations.filter((s) => !s.level);
    return hero() + intro() + (MS.save.state.name ? actions : "") + levels +
      (extra.length ? `<h2>More to see</h2>` + extra.map(stationRow).join("") : "") + footer();
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
      ${!game ? "" : MS.save.canPlay(s)
        ? `<button class="btn primary" data-go="play/${esc(s.id)}">${done ? "↻ Play again" : "▶ Play the mini-game"}</button>`
        : `<button class="btn" disabled>🔒 Mini-game unlocks at Level ${s.level}</button>
          <p class="small">Come back on another day to level up — or scan the QR code in this area to unlock it now.</p>`}
      ${game ? `<p class="small">Badge: ${s.badge.icon} ${esc(s.badge.name)}</p>` : ""}
    </article>`;
  }

  function footer() {
    return `<footer>
      <button class="link" data-act="sound">${MS.audio.muted ? "🔇 Sound off" : "🔊 Sound on"}</button>
      <button class="link" data-act="reset">Reset progress</button>
    </footer>`;
  }

  let current = null, scanned = false;
  function render() {
    root().innerHTML = current ? detail(current, scanned) : list();
    window.scrollTo(0, current ? 0 : listScroll);
  }

  function onClick(e) {
    const b = e.target.closest("[data-go], [data-act]");
    if (!b) return;
    MS.audio.unlock();
    MS.audio.play("click");
    if (b.dataset.go) {
      if (!current) listScroll = window.scrollY;
      return MS.go(b.dataset.go);
    }
    const act = b.dataset.act;
    if (act === "back") MS.back();
    if (act === "intro-ok") { MS.save.set("introSeen", true); render(); }
    if (act === "sound") { MS.audio.toggle(); render(); }
    if (act === "reset" && confirm("Delete all your badges and start over?")) { MS.save.reset(); render(); }
  }

  function onSubmit(e) {
    e.preventDefault();
    MS.audio.unlock();
    MS.save.set("name", (document.getElementById("name").value || "").trim() || S.defaultName);
    render();
  }

  MS.scenes.home = {
    html: true,
    enter(p) {
      current = p.station || null;
      scanned = !!p.scanned;
      if (scanned) MS.save.scan(current.id);
      const el = root();
      el.onclick = onClick;
      el.onsubmit = onSubmit;
      render();
    },
  };
})();
