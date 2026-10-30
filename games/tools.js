// Mini-game: TOOLS — whack-a-tool on the pegboard.
MS.games.tools = {
  create(api) {
    const D = MS.draw, I = MS.input, U = MS.util, C = MS.data.settings.colors;
    const d = api.data;
    const holes = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) holes.push({ x: 22 + c * 140, y: 230 + r * 180, tool: null, t: 0, age: 0, flash: 0 });
    let task = U.pick(d.tools), hits = 0, lives = d.lives, spawn = 0;

    const newTask = () => { let n; do { n = U.pick(d.tools); } while (n === task && d.tools.length > 1); task = n; };
    const rect = (h) => ({ x: h.x, y: h.y, w: 126, h: 140 });

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
        D.rr(g, 16, 68, 418, 100, 12, "#2a3142");
        D.text(g, "TASK", 225, 92, { size: 13, bold: true, align: "center", color: "#aab" });
        D.wrap(g, task.task, 225, 132, 396, { size: 20, bold: true, align: "center", valign: "middle", color: C.yellow });
        D.text(g, "🎯 " + hits + " / " + d.targetHits, 16, 200, { size: 18, bold: true });
        D.hearts(g, 358, 200, lives, d.lives);
        // pegboard
        D.rr(g, 16, 214, 418, 560, 10, C.wood);
        g.fillStyle = "#a07c45";
        for (let x = 28; x < 428; x += 22) for (let y = 224; y < 768; y += 22) g.fillRect(x, y, 3, 3);
        holes.forEach((h) => {
          g.fillStyle = "#4a3520";
          g.beginPath(); g.ellipse(h.x + 63, h.y + 138, 54, 12, 0, 0, 7); g.fill();
          if (!h.tool) return;
          const pop = Math.min(1, h.age * 7);
          const y = h.y + 12 + (1 - pop) * 70;
          g.save();
          g.beginPath(); g.rect(h.x - 6, h.y - 10, 138, 148); g.clip();
          D.rr(g, h.x + 3, y, 120, 120, 12, h.flash ? C.bad : MS.input.hover(rect(h)) ? "#fff" : "#f3efe6", "#7a4a2a", 3);
          D.text(g, h.tool.icon, h.x + 63, y + 62, { size: 40, emoji: true, align: "center" });
          D.wrap(g, h.tool.name, h.x + 63, y + 98, 112, { size: 13, bold: true, align: "center", valign: "middle", color: "#333" });
          g.restore();
        });
      },
    };
  },
};
