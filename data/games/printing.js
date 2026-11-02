// Mini-game content: 3D PRINTING — "Layer Stack"
// Tap to drop each layer on the one below; overhang is trimmed.
MS.data.games.printing = {
  title: "Layer Stack",
  howTo: "Tap to drop each layer right on top of the last one!",
  layersToWin: 6,
  startWidth: 200,       // width of the first layer in pixels (the screen is 450 wide)
  startSpeed: 150,       // nozzle speed (pixels/sec); increases each layer
  speedUp: 18,
  // Pop-ups, one after each layer (in order).
  tips: [
    "Printers build parts layer by layer from a sliced 3D model.",
    "The AMS 2 Pro on top feeds several filaments: multi-colour prints!",
    "Before you print: scan the machine's QR to log your START.",
    "When it's done: scan again to log your FINISH and clear the bed.",
    "Each layer needs support from the one below. Design for it!",
  ],
  remember: "Log every print with the machine QR at START and FINISH. Training comes first.",

  // Not used by the game: these feed the daily challenge on the home page.
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
};
