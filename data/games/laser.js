// Mini-game content: LASER — "Safe Catch"
// Sheets fall from the top. Drag the laser bed to catch SAFE ones.
//   pop  (safe materials)  what the guide says when you catch it
//   why  (unsafe)          what the guide says when you catch it by mistake
MS.data.games.laser = {
  title: "Safe Catch",
  howTo: "Drag the laser bed. Catch SAFE sheets, dodge the dangerous ones!",
  catchesToWin: 6,
  lives: 3,
  fallSpeed: 170,     // pixels per second
  spawnEvery: 0.85,   // seconds
  materials: [
    { name: "Plywood",          safe: true,  color: "#d9b77e", pop: "Plywood: cuts and engraves beautifully." },
    { name: "MDF",              safe: true,  color: "#a9825a", pop: "MDF: cheap, flat and great for prototypes." },
    { name: "Acrylic",          safe: true,  color: "#7fd3f7", pop: "Acrylic: clean, polished edges." },
    { name: "Cardboard",        safe: true,  color: "#c8a26a", pop: "Cardboard: perfect for quick mock-ups." },
    { name: "Paper / card",     safe: true,  color: "#f5f0e6", pop: "Paper & card: safe, but never leave the laser alone!" },
    { name: "Leather (veg-tan)",safe: true,  color: "#8b5a2b", pop: "Veg-tan leather: engraves well." },
    { name: "PVC",              safe: false, color: "#bfbfbf", why: "PVC releases toxic chlorine gas and corrodes the machine." },
    { name: "Vinyl",            safe: false, color: "#3a3a3a", why: "Vinyl contains chlorine: toxic fumes. Use the Cricut instead!" },
    { name: "Polycarbonate",    safe: false, color: "#d6e6f2", why: "Polycarbonate catches fire and discolours. Never laser it." },
    { name: "Metal sheet",      safe: false, color: "#9aa3ad", why: "Our CO₂ lasers can't cut metal: it reflects the beam." },
    { name: "Foam (PVC/PU)",    safe: false, color: "#f2e394", why: "Many foams give off toxic fumes, or melt and catch fire." },
  ],
  tips: ["Know the red EMERGENCY STOP button on every laser."],
  remember: "Safe: plywood, MDF, acrylic, card. NEVER: PVC, vinyl, polycarbonate, metal. Never leave it running alone.",
};
