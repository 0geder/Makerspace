// Mini-game content: RECYCLING — "Sort it"
// Items appear one by one; tap (or press 1–4) the right destination.
MS.data.games.recycling = {
  title: "Sort It Out",
  intro: "Waste is material in the wrong place. Tap the right bin for each item before time runs out.",
  secondsPerItem: 6,
  rounds: 12,
  passMark: 0.75,
  bins: [
    { id: "recycle",  label: "Recyclable",      color: "#2e7d32", icon: "♻️" },
    { id: "general",  label: "Non-recyclable",  color: "#f2c230", icon: "🗑️" },
    { id: "filament", label: "Filament recycling", color: "#2f80ed", icon: "🧵" },
    { id: "offcuts",  label: "Offcut box",       color: "#d9b77e", icon: "🪵" },
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
  learned: [
    "Failed prints & filament scraps → shredded and turned into new filament.",
    "Usable wood/acrylic → offcut box for the next maker.",
    "Clean paper, card, cans, bottles → recyclable. Tape, glue, dirty packaging → non-recyclable.",
  ],
};
