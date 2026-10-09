// Core: utilities, canvas setup, scene manager, main loop.
(function () {
  const S = MS.data.settings;

  MS.util = {
    rand: (a, b) => a + Math.random() * (b - a),
    randInt: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
    lerp: (a, b, t) => a + (b - a) * t,
    inRect: (px, py, r) => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h,
    overlap: (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y,
    // facts can be an array or a function returning an array
    resolve: (v) => (typeof v === "function" ? v() : v) || [],
  };

  const E = (MS.engine = {
    W: S.width,
    H: S.height,
    canvas: null,
    g: null,
    scene: null,
    sceneName: "",
    time: 0,

    init() {
      const c = document.getElementById("game");
      E.canvas = c;
      E.g = c.getContext("2d");
      E.resize();
      window.addEventListener("resize", E.resize);
      MS.input.init(c);
    },

    resize() {
      const c = E.canvas;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = Math.min(window.innerWidth / E.W, window.innerHeight / E.H);
      c.style.width = Math.floor(E.W * scale) + "px";
      c.style.height = Math.floor(E.H * scale) + "px";
      c.width = Math.floor(E.W * scale * dpr);
      c.height = Math.floor(E.H * scale * dpr);
      E.pxScale = (scale * dpr);
      const ov = document.getElementById("overlay");
      if (ov) { ov.style.width = c.style.width; ov.style.height = c.style.height; }
    },

    setScene(name, params) {
      if (E.scene && E.scene.exit) E.scene.exit();
      MS.ui.closeCard();
      E.sceneName = name;
      E.scene = MS.scenes[name];
      if (!E.scene) throw new Error("Unknown scene: " + name);
      if (E.scene.enter) E.scene.enter(params || {});
    },

    start(first) {
      E.init();
      E.setScene(first);
      let last = performance.now();
      const loop = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        E.time += dt;
        const g = E.g;
        g.setTransform(E.pxScale, 0, 0, E.pxScale, 0, 0);
        g.clearRect(0, 0, E.W, E.H);
        try {
          if (E.scene.update) E.scene.update(dt);
          if (E.scene.draw) E.scene.draw(g);
        } catch (err) {
          console.error(err);
        }
        MS.input.endFrame();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },
  });
})();
