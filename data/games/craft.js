// Mini-game content: CRAFT — "Match the Machine"
// A request appears; tap the photo of the right machine.
//   machines[].pop   what the guide says when it's the right answer
MS.data.games.craft = {
  title: "Match the Machine",
  howTo: "A maker needs something. Tap the right machine!",
  rounds: 4,
  secondsPerRequest: 6,
  passMark: 0.6,
  machines: [
    { id: "cricut",  name: "Cricut Maker 4",     photo: "craft-bench.jpg",  pop: "Cricut Maker 4: cuts vinyl, card and iron-on." },
    { id: "mug",     name: "Mug press",          photo: "mug-press.jpg",    pop: "Mug press: heat-transfers your design onto a mug." },
    { id: "tshirt",  name: "T-shirt heat press", photo: "tshirt-press.jpg", pop: "Heat press: designs onto T-shirts and tote bags." },
    { id: "scanner", name: "3D scanner",         photo: "3d-scanner.jpg",   pop: "3D scanner: turns a real object into a 3D model." },
    { id: "laser",   name: "Laser cutter",       photo: "laser-m1.jpg",     pop: "Laser cutter: flat parts and engravings." },
    { id: "printer", name: "3D printer",         photo: "bambu-h2d.jpg",    pop: "3D printer: real 3D shapes, layer by layer." },
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
  remember: "Flat → laser cutter. 3D shapes → 3D printer. Vinyl → Cricut. Mugs & shirts → presses.",
};
