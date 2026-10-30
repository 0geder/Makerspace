// Mini-game: CRAFT — pick the right machine (photo cards) for each request.
MS.games.craft = {
  create(api) {
    const U = MS.util, d = api.data;
    const questions = U.shuffle(d.requests).map((r) => {
      const right = d.machines.find((m) => m.id === r.machine);
      const others = U.shuffle(d.machines.filter((m) => m.id !== r.machine)).slice(0, 3);
      return {
        q: "“" + r.text + "”",
        choices: [right].concat(others).map((m) => ({ label: m.name, photo: m.photo, correct: m === right })),
      };
    });
    const quiz = MS.Quiz(questions, { photos: true, area: { x: 16, y: 72, w: 418, h: 712 } });
    let finished = false;
    return {
      update(dt) {
        quiz.update(dt);
        if (quiz.done && !finished) {
          finished = true;
          api.finish(quiz.correct / quiz.total >= d.passMark, quiz.correct + " / " + quiz.total + " machines matched");
        }
      },
      draw(g) { quiz.draw(g); },
    };
  },
};
