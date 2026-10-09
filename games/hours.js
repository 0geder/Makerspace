// Mini-game: HOURS — timed multiple-choice quiz (questions built in data/games/hours.js).
MS.games.hours = {
  create(api) {
    const d = api.data;
    const quiz = MS.Quiz(MS.util.shuffle(d.questions), { seconds: d.secondsPerQuestion, area: { x: 60, y: 80, w: 840, h: 480 } });
    let finished = false;
    return {
      update(dt) {
        quiz.update(dt);
        if (quiz.done && !finished) {
          finished = true;
          api.finish(quiz.correct / quiz.total >= d.passMark, quiz.correct + " / " + quiz.total + " correct");
        }
      },
      draw(g) { quiz.draw(g); },
    };
  },
};
