// Audio: tiny synthesized sound effects (no audio files needed).
(function () {
  let ctx = null;
  let muted = !MS.data.settings.sound;

  function tone(freq, dur, type, vol, when) {
    if (muted || !ctx) return;
    const t = ctx.currentTime + (when || 0);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol || 0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur);
  }

  MS.audio = {
    unlock() {
      if (!ctx) {
        try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
      }
      if (ctx && ctx.state === "suspended") ctx.resume();
    },
    toggle() { muted = !muted; return !muted; },
    get muted() { return muted; },
    play(name) {
      switch (name) {
        case "click": tone(660, 0.06, "square", 0.05); break;
        case "tick": tone(1200, 0.03, "square", 0.03); break;
        case "good": tone(660, 0.08, "square"); tone(990, 0.12, "square", 0.08, 0.08); break;
        case "bad": tone(200, 0.2, "sawtooth", 0.06); break;
        case "drop": tone(440, 0.05, "triangle", 0.1); break;
        case "win": [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, "square", 0.07, i * 0.12)); break;
        case "lose": [392, 330, 262].forEach((f, i) => tone(f, 0.2, "triangle", 0.08, i * 0.15)); break;
      }
    },
  };
})();
