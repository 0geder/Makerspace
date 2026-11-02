// Mini-game content: CHECK-IN — "Check-In Dash"
// Tap the steps in the right order; your character runs to the door with each one.
//   steps   listed in the CORRECT order (the game shuffles them). Keep it to 3–5.
//   pop     what the guide says when that step is tapped
MS.data.games.checkin = {
  title: "Check-In Dash",
  howTo: "Tap the steps in order: what comes first?",
  lives: 3,
  steps: [
    { text: "Scan the QR at the Check-in stand",           pop: "Check in at the entrance EVERY visit. It's required for entry." },
    { text: "Become a member",                              pop: "Membership is your key to the space." },
    { text: "Book a 1-hour session to learn the equipment", pop: "1-hour sessions teach you the machines. No session, no machine." },
    { text: "Scan the machine QR at START & FINISH",        pop: "Every machine has a QR sign: log when you start AND when you finish." },
  ],
  remember: "Check in every visit → member → 1-hour equipment session → log machine use.",
};
