// Mini-game content: RECYCLING — "Bin It"
// Items appear one by one; tap the right bin before time runs out.
//   bins[].pop   what the guide says when something goes in that bin correctly
MS.data.games.recycling = {
  title: "Bin It",
  howTo: "Tap the right bin for each item. Quick!",
  secondsPerItem: 4,
  rounds: 6,
  passMark: 0.6,
  bins: [
    { id: "recycle",  label: "Recyclable",         color: "#2e7d32", icon: "♻️", pop: "Clean paper, card, cans and bottles get recycled." },
    { id: "general",  label: "Non-recyclable",     color: "#f2c230", icon: "🗑️", pop: "Tape, glue and dirty packaging can't be recycled." },
    { id: "filament", label: "Filament recycling", color: "#2f80ed", icon: "🧵", pop: "Shredded and turned back into new filament!" },
    { id: "offcuts",  label: "Offcut box",         color: "#d9b77e", icon: "🪵", pop: "Usable scraps go to the offcut box for the next maker." },
  ],
  items: [
    { name: "Failed PLA print",          icon: "🧊", bin: "filament" },
    { name: "PLA support material",      icon: "🧩", bin: "filament" },
    { name: "Filament end bits",         icon: "〰️", bin: "filament" },
    { name: "Large plywood scrap",       icon: "🪵", bin: "offcuts" },
    { name: "Usable acrylic offcut",     icon: "🟦", bin: "offcuts" },
    { name: "MDF sheet with holes",      icon: "🟫", bin: "offcuts" },
    { name: "Clean cardboard box",       icon: "📦", bin: "recycle" },
    { name: "Empty plastic bottle",      icon: "🧴", bin: "recycle" },
    { name: "Aluminium can",             icon: "🥫", bin: "recycle" },
    { name: "Printer paper",             icon: "📄", bin: "recycle" },
    { name: "Used masking tape",         icon: "🩹", bin: "general" },
    { name: "Glue-gun strings",          icon: "🕸️", bin: "general" },
    { name: "Chip packet",               icon: "🍟", bin: "general" },
    { name: "Sanding dust",              icon: "💨", bin: "general" },
  ],
  remember: "Failed prints → filament recycling. Usable scraps → offcut box. Sustainable and circular!",
};
