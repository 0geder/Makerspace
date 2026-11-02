// =====================================================================
//  CHARACTERS — the makers players choose from, and the guide robot.
//  Art: Kenney "Toon Characters 1" (CC0, kenney.nl). See assets/characters/LICENSE-kenney.txt
//
//  Each sheet in assets/characters/ is a grid of 192x256 frames, 6 per row,
//  in the order of `poses` below. To add a character, make a sheet with the same
//  layout and add a line to `players`.
// =====================================================================
MS.data.characters = {
  frame: { w: 192, h: 256, cols: 6 },
  poses: ["idle", "talk", "think", "show", "interact", "hold", "cheer0", "cheer1", "hit", "jump", "wide",
          "walk0", "walk1", "walk2", "walk3", "walk4", "walk5", "walk6", "walk7"],

  // Players pick one of these on their first visit.
  players: [
    { id: "femalePerson",      name: "Zuri",  sheet: "assets/characters/femalePerson.png" },
    { id: "maleAdventurer",    name: "Kai",   sheet: "assets/characters/maleAdventurer.png" },
    { id: "femaleAdventurer",  name: "Nala",  sheet: "assets/characters/femaleAdventurer.png" },
    { id: "malePerson",        name: "Theo",  sheet: "assets/characters/malePerson.png" },
  ],

  // The guide who delivers every pop-up.
  guide: { id: "robot", name: "Bolt", sheet: "assets/characters/robot.png" },
};
