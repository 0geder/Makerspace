// =====================================================================
//  STATIONS — the sections of the Makerspace.
//
//  Each station = one area of the real Makerspace.
//    id      unique name (used for saving progress, and in QR links: index.html?at=<id>)
//    name    shown on the home screen and info card
//    color   accent colour (wheel segment, card stripe)
//    game    id of the mini-game in /games (or null = info only, no badge)
//    photo   picture in assets/photos shown on the info card
//    facts   bullet points on the info card (array, or a function returning an array
//            so it can read live values from data/makerspace.js)
//    badge   {icon, name} earned when the mini-game is won
//    level   which level unlocks its mini-game (see `levels` in data/settings.js)
//    training  true = its machines need equipment training (the badge is not a licence)
//
//  Add / remove stations here — the home screen, wheel and badge count update automatically.
// =====================================================================
(function () {
  const M = MS.data.makerspace;

  MS.data.stations = [
    {
      id: "entrance",
      level: 1,
      name: "Entrance & Check-in",
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
      level: 1,
      name: "Values Whiteboard",
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
      level: 1,
      name: "Community Area",
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
      level: 2,
      name: "Hand-Tool Bench",
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
      level: 2,
      name: "Craft & Print Bench",
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
      training: true,
      level: 3,
      name: "3D Printing Room",
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
      training: true,
      level: 3,
      name: "Laser Room",
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
      level: 2,
      name: "Recycling Corner",
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
      level: 3,
      name: "Idea Lab Desk",
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
})();
