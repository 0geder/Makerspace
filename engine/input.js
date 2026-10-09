// Input: keyboard, mouse and touch, mapped into game coordinates.
(function () {
  const held = new Set();
  const pressed = new Set();
  const I = (MS.input = {
    mouse: { x: 0, y: 0, down: false, clicked: false, moved: false },

    init(canvas) {
      window.addEventListener("keydown", (e) => {
        MS.audio.unlock();
        // keys typed into the overlay (name box, focused buttons) don't drive the game
        if (e.target && ["INPUT", "TEXTAREA", "BUTTON"].includes(e.target.tagName)) return;
        const k = e.key.toLowerCase();
        if (!held.has(k)) pressed.add(k);
        held.add(k);
        if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
      });
      window.addEventListener("keyup", (e) => held.delete(e.key.toLowerCase()));
      window.addEventListener("blur", () => held.clear());

      const toGame = (e) => {
        const r = canvas.getBoundingClientRect();
        I.mouse.x = ((e.clientX - r.left) / r.width) * MS.engine.W;
        I.mouse.y = ((e.clientY - r.top) / r.height) * MS.engine.H;
      };
      canvas.addEventListener("pointermove", (e) => { toGame(e); I.mouse.moved = true; });
      canvas.addEventListener("pointerdown", (e) => {
        toGame(e);
        I.mouse.down = true;
        I.mouse.clicked = true;
        MS.audio.unlock();
      });
      window.addEventListener("pointerup", () => (I.mouse.down = false));
    },

    down: (...keys) => keys.some((k) => held.has(k)),
    pressed: (...keys) => keys.some((k) => pressed.has(k)),
    // true if the mouse was clicked this frame inside rect r
    clickIn: (r) => I.mouse.clicked && MS.util.inRect(I.mouse.x, I.mouse.y, r),
    hover: (r) => MS.util.inRect(I.mouse.x, I.mouse.y, r),

    // Horizontal / vertical axis from WASD + arrows
    axis() {
      let x = 0, y = 0;
      if (I.down("arrowleft", "a")) x -= 1;
      if (I.down("arrowright", "d")) x += 1;
      if (I.down("arrowup", "w")) y -= 1;
      if (I.down("arrowdown", "s")) y += 1;
      return { x, y };
    },

    consumeClick() { I.mouse.clicked = false; },

    endFrame() {
      pressed.clear();
      I.mouse.clicked = false;
      I.mouse.moved = false;
    },
  });
})();
