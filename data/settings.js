// =====================================================================
//  GAME SETTINGS — tweak feel, colours and rules here.
//  Content (facts, questions) lives in the other files in /data.
// =====================================================================
window.MS = window.MS || { data: {}, games: {}, scenes: {} };
MS.data.games = MS.data.games || {};

MS.data.settings = {
  title: "Makerspace Quest",
  subtitle: "Spin the wheel. Learn the space. Earn your Maker Pass.",

  // Logical canvas size (the game scales to fit any window).
  width: 960,
  height: 600,

  player: {
    speed: 170,            // pixels per second
    defaultName: "Maker",
    shirtColor: "#2f80ed",
    skinColor: "#8d5524",
    hairColor: "#1b1b1b",
  },

  wheel: {
    requireSpin: true,     // true = a mini-game is only unlocked after the wheel picks it
    spinSeconds: 3.5,
    skipCompleted: true,   // the wheel only lands on sections you haven't finished
  },

  // Default pass mark for mini-games that score (0..1). Each game data file can override.
  passMark: 0.7,

  colors: {
    floor: "#e9e4da",
    floorDots: "#cfc8bb",
    wall: "#5a5f66",
    glass: "rgba(150, 200, 230, 0.35)",
    wood: "#d9b77e",
    darkWood: "#7a4a2a",
    yellow: "#f2c230",
    accent: "#e2583e",
    ui: "#1f2430",
    uiText: "#ffffff",
    good: "#2eaa5c",
    bad: "#d64545",
  },

  sound: true,
  // Set to true to unlock every mini-game & show station hitboxes (for testing).
  debug: false,
};
