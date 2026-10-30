// =====================================================================
//  GOALS — "What do you want to make?" on the home screen.
//  A member picks one; the listed stations (ids from data/stations.js)
//  are shown first as their personal path, in this order.
// =====================================================================
MS.data.goals = [
  { id: "gift",    icon: "🎁", label: "A personalised mug, T-shirt or sticker", stations: ["craft", "entrance"] },
  { id: "box",     icon: "📦", label: "A laser-cut box or engraving",           stations: ["laser", "tools", "recycling"] },
  { id: "print",   icon: "🖨️", label: "A 3D-printed part or figure",            stations: ["printing", "recycling", "craft"] },
  { id: "project", icon: "🛠️", label: "A prototype for a team project",         stations: ["ideas", "tools", "printing"] },
  { id: "explore", icon: "👀", label: "Not sure yet — just exploring",          stations: ["entrance", "values", "community", "showcase"] },
];
