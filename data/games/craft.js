// Mini-game content: CRAFT — "Which machine?"
// A request appears; choose the machine (cards show real photos).
MS.data.games.craft = {
  title: "Which Machine?",
  intro: "Makers bring you their ideas. Pick the best machine in the space for each one.",
  passMark: 0.7,
  machines: [
    { id: "cricut",  name: "Cricut Maker 4",    photo: "craft-bench.jpg" },
    { id: "mug",     name: "Mug press",         photo: "mug-press.jpg" },
    { id: "tshirt",  name: "T-shirt heat press",photo: "tshirt-press.jpg" },
    { id: "scanner", name: "3D scanner",        photo: "3d-scanner.jpg" },
    { id: "laser",   name: "Laser cutter",      photo: "laser-m1.jpg" },
    { id: "printer", name: "3D printer",        photo: "bambu-h2d.jpg" },
  ],
  requests: [
    { text: "I want vinyl stickers of my society logo.",               machine: "cricut" },
    { text: "Put my design on a coffee mug for my mom.",               machine: "mug" },
    { text: "Make team T-shirts for our hackathon.",                   machine: "tshirt" },
    { text: "Turn this clay sculpture into a 3D model I can edit.",    machine: "scanner" },
    { text: "Cut a wooden box with finger joints and engrave my name.",machine: "laser" },
    { text: "Make a custom phone stand with a curved shape.",          machine: "printer" },
    { text: "Engrave a drawing onto a plywood board.",                 machine: "laser" },
    { text: "Print a multi-colour toucan figure.",                     machine: "printer" },
    { text: "Cut an iron-on design for a tote bag.",                   machine: "cricut" },
  ],
  learned: [
    "Cricut Maker 4 cuts vinyl, card and iron-on; presses transfer designs to mugs, plates and shirts.",
    "The 3D scanner captures real objects as 3D models.",
    "Flat things → laser cutter. 3D shapes → 3D printer.",
  ],
};
