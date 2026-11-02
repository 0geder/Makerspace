// Mini-game content: TOOLS — "Tool Whack"
// Tools pop out of the pegboard. A task is shown; tap the right tool.
//   icon   emoji drawn on the board (swap for an image later if you like)
//   task   the job this tool is the right choice for (also the guide's pop-up)
MS.data.games.tools = {
  title: "Tool Whack",
  howTo: "Hit the tool that fits the task before it hides!",
  targetHits: 5,      // correct hits needed to win
  lives: 3,
  popSeconds: 1.8,    // how long a tool stays up
  tools: [
    { name: "Claw hammer",     icon: "🔨", task: "Drive a nail into wood" },
    { name: "Wooden mallet",   icon: "🪵", task: "Tap a wood joint together without denting it" },
    { name: "Try square",      icon: "📐", task: "Check a corner is exactly 90°" },
    { name: "File",            icon: "🗡️", task: "Smooth a rough edge on a part" },
    { name: "Utility knife",   icon: "🔪", task: "Score and cut cardboard" },
    { name: "Wire strippers",  icon: "✂️", task: "Remove insulation from a wire" },
    { name: "Clamp",           icon: "🗜️", task: "Hold two glued pieces while they dry" },
    { name: "Screwdriver",     icon: "🪛", task: "Tighten a screw" },
    { name: "Glue gun",        icon: "🔫", task: "Quickly stick card to a prototype" },
    { name: "Tape measure",    icon: "📏", task: "Measure the length of a plank" },
  ],
  remember: "Right tool, right job, then put it back on its spot on the pegboard.",
};
