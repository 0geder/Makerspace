// Mini-game content: LASER — "Material catcher"
// Sheets fall from the top. Move the laser bed (drag / tap, or ←/→) to catch SAFE ones.
// Catching an UNSAFE one costs a life and shows the `why`.
MS.data.games.laser = {
  title: "Laser-Safe Materials",
  intro: "Drag your finger to move the laser bed. Catch materials that are SAFE to laser. Dodge the dangerous ones!",
  catchesToWin: 10,
  lives: 3,
  fallSpeed: 150,     // pixels per second
  spawnEvery: 0.9,  // seconds
  materials: [
    { name: "Plywood",          safe: true,  color: "#d9b77e" },
    { name: "MDF",              safe: true,  color: "#a9825a" },
    { name: "Acrylic",          safe: true,  color: "#7fd3f7" },
    { name: "Cardboard",        safe: true,  color: "#c8a26a" },
    { name: "Paper / card",     safe: true,  color: "#f5f0e6" },
    { name: "Leather (veg-tan)",safe: true,  color: "#8b5a2b" },
    { name: "PVC",              safe: false, color: "#bfbfbf", why: "PVC releases toxic chlorine gas and corrodes the machine." },
    { name: "Vinyl",            safe: false, color: "#3a3a3a", why: "Vinyl contains chlorine — toxic fumes. Use the Cricut instead!" },
    { name: "Polycarbonate",    safe: false, color: "#d6e6f2", why: "Polycarbonate catches fire and discolours — never laser it." },
    { name: "Metal sheet",      safe: false, color: "#9aa3ad", why: "Our CO₂ lasers can't cut metal — it reflects the beam." },
    { name: "Foam (PVC/PU)",    safe: false, color: "#f2e394", why: "Many foams release toxic fumes or melt and ignite." },
  ],
  learned: [
    "Safe: plywood, MDF, acrylic, card, paper. NEVER: PVC, vinyl, polycarbonate, metal.",
    "Extraction on, lid closed, never leave the laser unattended.",
    "Know the red EMERGENCY STOP. Log usage with the QR at start and finish.",
  ],
};
