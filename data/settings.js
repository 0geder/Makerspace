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

  // Logical canvas size of the mini-games: portrait, phone first (scaled to fit the screen).
  // The mini-games in /games are laid out for exactly this size.
  width: 450,
  height: 800,

  wheel: {
    spinSeconds: 2,        // the wheel spins by itself when you press PLAY or Next
    skipCompleted: true,   // the wheel only lands on sections you haven't finished
    landPause: 0.9,        // seconds to show where it landed before the game starts
  },

  // The "ready" screen before every mini-game: 3-2-1 countdown (tap to skip).
  countdownSeconds: 2.4,

  // Stars on the result screen, by score (0..1). 1 star = you won the badge.
  stars: { two: 0.75, three: 1 },

  // Levels unlock by how often you come back: `visits` = different days you've opened the game.
  // Each station in data/stations.js has a `level`. Scanning a station's QR code unlocks it early.
  levels: [
    { level: 1, name: "Newcomer", visits: 1 },
    { level: 2, name: "Member",   visits: 2 },
    { level: 3, name: "Maker",    visits: 4 },
  ],

  // Default pass mark for mini-games that score (0..1). Each game data file can override.
  passMark: 0.7,

  // THEME — taken from the real room: light terrazzo floor, white walls, birch plywood,
  // yellow stools and orange-red accents. The home page uses the same colours (style.css :root).
  colors: {
    bg: "#f7f2e8",        // terrazzo floor: page and game background
    speck: "#ddd3c2",     // the specks in the terrazzo
    wall: "#ffffff",      // cards and panels
    wood: "#e3c48f",      // birch plywood: headers, boards, benches
    woodDark: "#b98c4c",  // plywood edge, secondary buttons
    ink: "#2b2622",       // text
    muted: "#7d7365",     // smaller, secondary text
    tile: "#ffffff",      // tappable tiles
    tileHover: "#fff1c7",
    line: "rgba(70, 45, 20, 0.16)", // borders, shadows, empty bars
    yellow: "#f2c230",    // the stools
    accent: "#e2583e",    // orange-red, like the Check-in sign and laser stripes
    good: "#2eaa5c",
    bad: "#d64545",
    ui: "#ffffff",        // panel fill (kept for older code)
  },

  sound: true,
  // Set to true to unlock every mini-game (for testing).
  debug: false,
};
