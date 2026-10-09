// Mini-game: TOOLS — whack-a-tool on the pegboard.
MS.games.tools = {
  create(api) {
    const D = MS.draw, I = MS.input, U = MS.util, C = MS.data.settings.colors;
    const d = api.data;
    const holes = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) holes.push({ x: 190 + c * 200, y: 170 + r * 135, tool: null, t: 0, age: 0, flash: 0 });
    let task = U.pick(d.tools), hits = 0, lives = d.lives, spawn = 0;

    const newTask = () => { let n; do { n = U.pick(d.tools); } while (n === task && d.tools.length > 1); task = n; };
    const rect = (h) => ({ x: h.x, y: h.y, w: 180, h: 115 });

    return {
      update(dt) {
        spawn -= dt;
        holes.forEach((h) => {
          h.flash = Math.max(0, h.flash - dt);
          if (h.tool) { h.t -= dt; h.age += dt; if (h.t <= 0) h.tool = null; }
        });
        const free = holes.filter((h) => !h.tool);
        if (spawn <= 0 && free.length) {
          spawn = 0.45;
          const targetUp = holes.some((h) => h.tool === task);
          const others = d.tools.filter((t) => t !== task && !holes.some((h) => h.tool === t));
          const tool = !targetUp && Math.random() < 0.5 ? task : U.pick(others.length ? others : d.tools);
          const h = U.pick(free);
          h.tool = tool; h.t = d.popSeconds * U.rand(0.85, 1.25); h.age = 0;
        }
        holes.forEach((h) => {
          if (!h.tool || !I.clickIn(rect(h))) return;
          if (h.tool === task) {
            hits++; MS.audio.play("good"); h.tool = null; newTask();
            if (hits >= d.targetHits) api.finish(true, hits + " correct hits · " + lives + " lives left");
          } else {
            lives--; h.flash = 0.4; MS.audio.play("bad");
            if (lives <= 0) api.finish(false, hits + " / " + d.targetHits + " correct hits");
          }
        });
      },
      draw(g) {
        D.rr(g, 150, 60, 660, 60, 12, "#2a3142");
        D.text(g, "TASK:", 170, 97, { size: 16, bold: true, color: "#aab" });
        D.text(g, task.task, 230, 97, { size: 21, bold: true, color: C.yellow });
        D.hearts(g, 830, 90, lives, d.lives);
        D.text(g, "🎯 " + hits + " / " + d.targetHits, 30, 97, { size: 18, bold: true });
        // pegboard
        D.rr(g, 170, 150, 620, 430, 10, C.wood);
        g.fillStyle = "#a07c45";
        for (let x = 185; x < 780; x += 22) for (let y = 160; y < 575; y += 22) g.fillRect(x, y, 3, 3);
        holes.forEach((h) => {
          g.fillStyle = "#4a3520";
          g.beginPath(); g.ellipse(h.x + 90, h.y + 100, 70, 14, 0, 0, 7); g.fill();
          if (!h.tool) return;
          const pop = Math.min(1, h.age * 7);
          const y = h.y + (1 - pop) * 60;
          g.save();
          g.beginPath(); g.rect(h.x - 10, h.y - 20, 200, 122); g.clip();
          D.rr(g, h.x + 15, y, 150, 100, 12, h.flash ? C.bad : MS.input.hover(rect(h)) ? "#fff" : "#f3efe6", "#7a4a2a", 3);
          D.text(g, h.tool.icon, h.x + 90, y + 55, { size: 44, emoji: true, align: "center" });
          D.text(g, h.tool.name, h.x + 90, y + 88, { size: 14, bold: true, align: "center", color: "#333" });
          g.restore();
        });
      },
    };
  },
};
