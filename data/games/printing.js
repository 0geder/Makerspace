// Mini-game content: 3D PRINTING — "Layer stacker" + quick-check questions.
MS.data.games.printing = {
  title: "Layer by Layer",
  intro: "3D printers build parts one layer at a time. Tap to drop each layer right on top of the last. Overhang gets trimmed — don't run out of model!",
  layersToWin: 10,
  startWidth: 180,       // width of the first layer in pixels (the screen is 450 wide)
  startSpeed: 130,       // nozzle speed (pixels/sec); increases each layer
  speedUp: 12,
  // Asked after stacking. You need `passMark` of them right to earn the badge.
  passMark: 0.6,
  checks: [
    {
      q: "You're starting a print on H2D 1. What do you do first?",
      answer: "Scan the machine's QR code to log the START",
      wrong: ["Nothing — just press print", "Ask a friend to watch it", "Turn off the other printers"],
    },
    {
      q: "What does the AMS 2 Pro on top of the printer do?",
      answer: "Feeds multiple filaments for multi-colour prints",
      wrong: ["Cools the room", "Scans your model", "Cuts the print off the bed"],
    },
    {
      q: "Your print is finished. What now?",
      answer: "Scan the QR again to log the FINISH and clear the bed",
      wrong: ["Leave it for tomorrow", "Unplug the printer", "Start someone else's print"],
    },
  ],
  learned: [
    "Prints are built layer by layer — each layer needs support from the one below.",
    "Bambu Lab H2D printers + AMS 2 Pro = multi-colour printing.",
    "Log your usage with the QR when you START and FINISH. Training first!",
  ],
};
