// =====================================================================
//  GAME SETTINGS — tweak feel, colours and rules here.
//  Content (facts, questions) lives in the other files in /data.
// =====================================================================
window.MS = window.MS || { data: {}, games: {}, scenes: {} };
MS.data.games = MS.data.games || {};

MS.data.settings = {
  title: "Makerspace Quest",
  subtitle: "Learn the space. Win mini-games. Earn your Maker Pass.",
  defaultName: "Maker",

  // Logical canvas size of the mini-games (scaled to fit the screen).
  width: 960,
  height: 600,

  wheel: {
    spinSeconds: 3.5,
    skipCompleted: true,   // the wheel only lands on sections you haven't finished
  },

  // Default pass mark for mini-games that score (0..1). Each game data file can override.
  passMark: 0.7,

  colors: {
    wood: "#d9b77e",
    yellow: "#f2c230",
    accent: "#e2583e",
    ui: "#1f2430",
    good: "#2eaa5c",
    bad: "#d64545",
  },

  sound: true,
  // Set to true to unlock every mini-game (for testing).
  debug: false,
};
