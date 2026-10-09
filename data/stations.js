// =====================================================================
//  STATIONS & MAP — the sections of the Makerspace.
//
//  Each station = an area on the map you can walk into.
//    id      unique name (used for saving progress)
//    name    shown on the map and info card
//    zone    {x, y, w, h} walk-in area on the 960x600 map
//    game    id of the mini-game in /games (or null = info only, no badge)
//    photo   picture in assets/photos shown on the info card
//    facts   bullet points on the info card (array, or a function returning an array
//            so it can read live values from data/makerspace.js)
//    badge   {icon, name} earned when the mini-game is won
//
//  Add / remove / move stations here — the wheel and badge count update automatically.
// =====================================================================
(function () {
  const M = MS.data.makerspace;

  MS.data.stations = [
    {
      id: "entrance",
      name: "Entrance & Check-in",
      zone: { x: 400, y: 470, w: 160, h: 110 },
      color: "#e2583e",
      game: "checkin",
      photo: "checkin.jpg",
      blurb: "Every visit starts here.",
      facts: () => [
        M.checkIn.how,
        "Check in is REQUIRED for entry — right of admission reserved.",
        "How it works: " + M.howItWorks.join(" → ") + ".",
      ],
      badge: { icon: "🎫", name: "Checked In" },
    },
    {
      id: "values",
      name: "Values Whiteboard",
      zone: { x: 30, y: 150, w: 130, h: 150 },
      color: "#4caf50",
      game: "values",
      photo: "whiteboard.jpg",
      blurb: "The Makerspace sits where Makerspace, HPI and D-School values overlap.",
      facts: () => [
        "Makerspace: give more than you take · leave it better than you found it · respect people, environment & machines · anti-consumerism · do it well.",
        "HPI: sustainability · integrity · collaboration · mastery.",
        "D-School: problem first, solution later · human-centred design.",
      ],
      badge: { icon: "💡", name: "Values Keeper" },
    },
    {
      id: "community",
      name: "Community Area",
      zone: { x: 250, y: 380, w: 130, h: 100 },
      color: "#f2c230",
      game: "hours",
      photo: "community-area.jpg",
      blurb: "Tables, stools and the people who make the space.",
      facts: () => [
        "Open " + M.hours.open.days + ", " + M.hours.open.time + ".",
        ...M.hours.sessions.map((s) => s.day + " " + s.time + " — session with " + s.host + "."),
        M.hours.community.name + ": every " + M.hours.community.day + ", " + M.hours.community.time + ".",
        "Who is it for? " + M.whoFor.join(", ") + ".",
      ],
      badge: { icon: "🕒", name: "Time Keeper" },
    },
    {
      id: "tools",
      name: "Hand-Tool Bench",
      zone: { x: 50, y: 24, w: 250, h: 100 },
      color: "#c0392b",
      game: "tools",
      photo: "handtools.jpg",
      blurb: "Pegboard wall and benches full of hand tools.",
      facts: [
        "Hammers, mallets, files, squares, knives, pliers, wire strippers, clamps and glue guns.",
        "Use the right tool for the job — it's safer and gives a better result.",
        "Put every tool back on the wall when you're done: leave it better than you found it.",
      ],
      badge: { icon: "🔨", name: "Tool Master" },
    },
    {
      id: "showcase",
      name: "Showcase Shelf",
      zone: { x: 315, y: 24, w: 150, h: 100 },
      color: "#9b59b6",
      game: null,
      photo: "showcase-dschool.jpg",
      blurb: "Things made here — for inspiration.",
      facts: [
        "3D-printed d-school letters, 3D-scanned & printed heads, laser engravings.",
        "Laser-cut finger-joint boxes with engraved names — a classic first project.",
        "Ask yourself: is my project worth keeping?",
      ],
      badge: null,
    },
    {
      id: "craft",
      name: "Craft & Print Bench",
      zone: { x: 480, y: 24, w: 270, h: 100 },
      color: "#16a085",
      game: "craft",
      photo: "craft-bench.jpg",
      blurb: "Personalise things: vinyl, mugs, plates, T-shirts, scans.",
      facts: [
        "Cricut Maker 4 — cuts vinyl, paper, card and fabric.",
        "Mug press, plate press and T-shirt heat press — transfer designs with heat.",
        "Creality 3D scanner — turn a real object into a 3D model.",
        "Paper printers for transfers and templates.",
      ],
      badge: { icon: "🎨", name: "Craft Pro" },
    },
    {
      id: "printing",
      name: "3D Printing Room",
      zone: { x: 775, y: 30, w: 160, h: 230 },
      color: "#2f80ed",
      game: "printing",
      photo: "bambu-h2d.jpg",
      blurb: "Glass room full of Bambu Lab H2D printers.",
      facts: () => [
        "Bambu Lab H2D printers with AMS 2 Pro units (multi-colour filament).",
        "Scan the machine's QR to record your usage when you START and when you FINISH.",
        M.hours.machineRule,
        "Printers build objects layer by layer from a sliced 3D model.",
      ],
      badge: { icon: "🖨️", name: "Layer Legend" },
    },
    {
      id: "laser",
      name: "Laser Room",
      zone: { x: 775, y: 300, w: 160, h: 230 },
      color: "#8e44ad",
      game: "laser",
      photo: "laser-m1.jpg",
      blurb: "Laser cutters with fume extraction.",
      facts: [
        "Laser Cutter M1 — cut and engrave wood, acrylic, card. Training required.",
        "Know the red EMERGENCY STOP button. Never leave a running laser unattended.",
        "Extraction must be on — never cut PVC or vinyl (toxic chlorine gas).",
        "Scan the QR to log usage at start and finish. Reuse offcuts from the offcut box.",
      ],
      badge: { icon: "⚡", name: "Laser Safe" },
    },
    {
      id: "recycling",
      name: "Recycling Corner",
      zone: { x: 30, y: 470, w: 180, h: 110 },
      color: "#27ae60",
      game: "recycling",
      photo: "recycling-toucan.jpg",
      blurb: "Sustainable / circular: waste becomes material.",
      facts: [
        "Failed prints and filament scraps are shredded and recycled into new filament.",
        "Wood offcuts go in the offcut box for someone else's project.",
        "Use the RECYCLABLE and NON-RECYCLABLE bins correctly.",
      ],
      badge: { icon: "♻️", name: "Circular Maker" },
    },
    {
      id: "ideas",
      name: "Idea Lab Desk",
      zone: { x: 30, y: 320, w: 130, h: 120 },
      color: "#e67e22",
      game: "ideas",
      photo: "laser-boxes.jpg",
      blurb: "Bring an idea worth materialising.",
      facts: () => [
        "YES: " + M.projects.yes.join(", ") + ".",
        "NO: " + M.projects.no.join(", ") + ".",
        M.projects.support,
        "Should I make it? " + M.shouldIMakeIt.join(" · ") + ".",
      ],
      badge: { icon: "🚀", name: "Idea Maker" },
    },
    {
      id: "lounge",
      name: "Lockers & Lounge",
      zone: { x: 590, y: 480, w: 160, h: 100 },
      color: "#7f8c8d",
      game: null,
      photo: "printer-room.jpg",
      blurb: "Store your bag, take a break.",
      facts: [
        "Use the cubby lockers for your bags — keep benches and walkways clear.",
        "Fire extinguishers are on the walls — know where they are.",
      ],
      badge: null,
    },
  ];

  // -------------------------------------------------------------------
  //  MAP DECORATION — purely visual props + solid walls.
  //  type: see engine/draw.js `Props` for the list of drawable things.
  // -------------------------------------------------------------------
  MS.data.map = {
    playerStart: { x: 480, y: 440 },
    wheel: { x: 480, y: 270, r: 46 },

    // Solid walls (players can't walk through). Glass walls use glass: true.
    walls: [
      { x: 0, y: 0, w: 960, h: 18 },
      { x: 0, y: 582, w: 400, h: 18 },
      { x: 560, y: 582, w: 400, h: 18 },
      { x: 0, y: 0, w: 18, h: 600 },
      { x: 942, y: 0, w: 18, h: 600 },
      // 3D printing room — glass, door gap at y 200-250
      { x: 760, y: 18, w: 8, h: 182, glass: true },
      { x: 760, y: 250, w: 8, h: 30, glass: true },
      { x: 760, y: 272, w: 182, h: 8, glass: true },
      // laser room — solid, door gap at y 420-470
      { x: 760, y: 290, w: 8, h: 130 },
      { x: 760, y: 470, w: 8, h: 112 },
      { x: 760, y: 290, w: 182, h: 8 },
    ],

    props: [
      // hand tools
      { type: "pegboard", x: 60, y: 18, w: 230, h: 22 },
      { type: "bench", x: 60, y: 40, w: 230, h: 34 },
      { type: "stool", x: 100, y: 92 }, { type: "stool", x: 190, y: 92 },
      // showcase
      { type: "shelf", x: 325, y: 18, w: 130, h: 48 },
      // craft bench
      { type: "bench", x: 490, y: 40, w: 250, h: 34, plain: true },
      { type: "cricut", x: 500, y: 44 }, { type: "press", x: 560, y: 44 },
      { type: "mugpress", x: 610, y: 46 }, { type: "paperprinter", x: 650, y: 44 }, { type: "scanner", x: 705, y: 48 },
      { type: "tv", x: 540, y: 18, w: 80 },
      // 3D printing room
      { type: "bench", x: 790, y: 26, w: 140, h: 40 },
      { type: "printer3d", x: 800, y: 20 }, { type: "printer3d", x: 860, y: 20 },
      { type: "bench", x: 890, y: 90, w: 44, h: 150 },
      { type: "printer3d", x: 892, y: 110, side: true }, { type: "printer3d", x: 892, y: 180, side: true },
      { type: "qr", x: 840, y: 72 },
      // laser room
      { type: "duct", x: 820, y: 298 }, { type: "duct", x: 890, y: 298 },
      { type: "laser", x: 790, y: 320, color: "#6f8fd1" },
      { type: "laser", x: 790, y: 430, color: "#eeeeee", stripe: "#d0303a" },
      { type: "crate", x: 900, y: 520 },
      { type: "qr", x: 870, y: 360 },
      // values board + idea lab
      { type: "whiteboard", x: 40, y: 170, w: 100 },
      { type: "desk", x: 45, y: 350, w: 90, h: 50 },
      // community tables
      { type: "table", x: 250, y: 200, w: 140, h: 40 }, { type: "table", x: 580, y: 200, w: 140, h: 40 },
      { type: "table", x: 260, y: 400, w: 110, h: 36 },
      { type: "stool", x: 265, y: 252 }, { type: "stool", x: 305, y: 252 }, { type: "stool", x: 345, y: 252 },
      { type: "stool", x: 595, y: 252 }, { type: "stool", x: 635, y: 252 }, { type: "stool", x: 675, y: 252 },
      { type: "stool", x: 265, y: 186 }, { type: "stool", x: 685, y: 186 },
      { type: "stool", x: 280, y: 446 }, { type: "stool", x: 330, y: 446 },
      // recycling
      { type: "bin", x: 40, y: 530, color: "#2e7d32", label: "R" },
      { type: "bin", x: 74, y: 530, color: "#f2c230", label: "N" },
      { type: "extruder", x: 120, y: 490 },
      // entrance
      { type: "door", x: 400, y: 582, w: 160 },
      { type: "checkin", x: 465, y: 500 },
      // lounge
      { type: "lockers", x: 600, y: 520, w: 70 },
      { type: "couch", x: 690, y: 530 },
      { type: "extinguisher", x: 22, y: 440 }, { type: "extinguisher", x: 744, y: 300 },
    ],
  };
})();
