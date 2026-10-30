// Mini-game content: VALUES — "Venn sort"
// The notes and circles come from data/makerspace.js (values section) so the
// whiteboard is only defined once. Settings for this game live here.
MS.data.games.values = {
  title: "Values Venn",
  intro: "Each sticky note belongs somewhere on the whiteboard. Tap the right part of the Venn diagram — overlaps count!",
  rounds: 10,      // how many notes per game (picked at random from the board)
  passMark: 0.7,
  learned: [
    "Makerspace values: give more than you take, leave it better than you found it, respect people, environment & machines.",
    "Shared with HPI: sustainable / circular. Shared with D-School: create impact, change mindsets.",
    "HPI + D-School: solve wicked problems.",
  ],
};
