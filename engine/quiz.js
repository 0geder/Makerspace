// Quiz: reusable multiple-choice component drawn on the canvas.
//   questions: [{ q, answer, wrong:[...] }]  or  [{ q, choices:[{label, photo, correct}] }]
//   opts: { seconds (timer per question, optional), photos (true = 2x2 photo cards), area {x,y,w,h} }
// Read .done, .correct, .total when finished.
(function () {
  const { shuffle, clamp } = MS.util;
  const D = MS.draw;
  const C = MS.data.settings.colors;

  MS.Quiz = function (questions, opts) {
    opts = opts || {};
    const area = opts.area || { x: 60, y: 90, w: 840, h: 480 };
    const qs = questions.map((q) => ({
      q: q.q,
      choices: q.choices
        ? shuffle(q.choices)
        : shuffle([{ label: q.answer, correct: true }].concat((q.wrong || []).map((w) => ({ label: w })))),
    }));

    const self = {
      index: 0, correct: 0, total: qs.length, done: false,
      picked: -1, feedback: 0, timeLeft: opts.seconds || 0,

      current: () => qs[self.index],

      choose(i) {
        if (self.picked !== -1 || self.done) return;
        self.picked = i;
        const ok = i >= 0 && self.current().choices[i].correct;
        if (ok) self.correct++;
        MS.audio.play(ok ? "good" : "bad");
        self.feedback = ok ? 0.9 : 1.8;
      },

      rects() {
        const n = self.current().choices.length;
        const top = area.y + 110;
        if (opts.photos) {
          const cw = (area.w - 20) / 2, ch = (area.h - 120) / 2;
          return self.current().choices.map((_, i) => ({ x: area.x + (i % 2) * (cw + 20), y: top + Math.floor(i / 2) * (ch + 10), w: cw, h: ch - 10 }));
        }
        const h = Math.min(70, (area.h - 120) / n - 12);
        return self.current().choices.map((_, i) => ({ x: area.x + 60, y: top + i * (h + 12), w: area.w - 120, h }));
      },

      update(dt) {
        if (self.done) return;
        if (self.picked === -1) {
          if (opts.seconds) {
            self.timeLeft -= dt;
            if (self.timeLeft <= 0) self.choose(-2); // timeout
          }
          self.rects().forEach((r, i) => { if (MS.input.clickIn(r)) self.choose(i); });
          ["1", "2", "3", "4"].forEach((k, i) => { if (MS.input.pressed(k) && i < self.current().choices.length) self.choose(i); });
        } else {
          self.feedback -= dt;
          if (self.feedback <= 0) {
            self.index++;
            self.picked = -1;
            self.timeLeft = opts.seconds || 0;
            if (self.index >= qs.length) self.done = true;
          }
        }
      },

      draw(g) {
        if (self.done) return;
        const cur = self.current();
        D.text(g, "Question " + (self.index + 1) + " / " + qs.length, area.x, area.y, { size: 14, color: "#aab" });
        D.wrap(g, cur.q, area.x + area.w / 2, area.y + 50, area.w - 40, { size: 24, bold: true, align: "center", valign: "middle" });
        if (opts.seconds && self.picked === -1) {
          D.bar(g, area.x, area.y + 86, area.w, 8, self.timeLeft / opts.seconds, self.timeLeft < 3 ? C.bad : C.yellow);
        }
        self.rects().forEach((r, i) => {
          const ch = cur.choices[i];
          let fill = MS.input.hover(r) && self.picked === -1 ? "#3a4256" : "#2a3142";
          if (self.picked !== -1) {
            if (ch.correct) fill = C.good;
            else if (i === self.picked) fill = C.bad;
          }
          D.rr(g, r.x, r.y, r.w, r.h, 12, fill, "rgba(255,255,255,0.2)", 2);
          if (opts.photos && ch.photo) {
            D.photo(g, ch.photo, r.x + 8, r.y + 8, r.w - 16, r.h - 48, 8);
            D.text(g, (i + 1) + ". " + ch.label, r.x + r.w / 2, r.y + r.h - 14, { size: 17, bold: true, align: "center" });
          } else {
            D.text(g, String(i + 1), r.x + 22, r.y + r.h / 2, { size: 18, bold: true, color: "#aab", baseline: "middle" });
            D.wrap(g, ch.label, r.x + r.w / 2, r.y + r.h / 2, r.w - 90, { size: 18, align: "center", valign: "middle" });
          }
        });
        if (self.picked === -2) D.text(g, "⏰ Time's up!", area.x + area.w / 2, area.y + area.h + 10, { size: 18, bold: true, align: "center", color: C.bad });
      },
    };
    return self;
  };
})();
