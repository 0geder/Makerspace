// Mini-game content: HOURS — timed quiz about when / who.
// Questions are built from data/makerspace.js so changing the hours there
// automatically changes the quiz. Add extra fixed questions in `extra`.
(function () {
  const M = MS.data.makerspace;
  const s = M.hours.sessions;
  MS.data.games.hours = {
    title: "Open Hours Rush",
    intro: "Answer before the clock runs out. Know when the space is open and who's around.",
    secondsPerQuestion: 12,
    passMark: 0.7,
    questions: [
      {
        q: "When is the Makerspace open?",
        answer: M.hours.open.days + ", " + M.hours.open.time,
        wrong: ["Weekends only, 10am – 2pm", "24 hours, 7 days a week", "Only during exam season"],
      },
      {
        q: "When is the community meetup?",
        answer: M.hours.community.day + " " + M.hours.community.time,
        wrong: ["Friday 6pm – 9pm", "Sunday morning", "There isn't one"],
      },
      ...s.map((x) => ({
        q: "Who runs the " + x.day + " " + x.time + " session?",
        answer: x.host,
        wrong: s.filter((o) => o.host !== x.host).map((o) => o.host).concat(["Nobody — it's unstaffed"]).slice(0, 3),
      })),
      {
        q: "When can you use the CNC, 3D printers and laser cutters?",
        answer: "After equipment training",
        wrong: ["Any time you're checked in", "Only with a lecturer's note", "Never — staff only"],
      },
      {
        q: "Who is the Makerspace for?",
        answer: M.whoFor.join(", "),
        wrong: ["Only engineering students", "Only staff", "Only paying companies"],
      },
      {
        q: "Why does the Makerspace exist?",
        answer: M.why.join(", "),
        wrong: ["To sell 3D prints", "To store old equipment", "To host exams"],
      },
    ],
    learned: [
      "Open " + M.hours.open.days + ", " + M.hours.open.time + ".",
      "Staffed sessions: " + s.map((x) => x.day + " " + x.time + " (" + x.host + ")").join(", ") + ".",
      M.hours.community.name + ": " + M.hours.community.day + " " + M.hours.community.time + ".",
    ],
  };
})();
