// =====================================================================
//  THE MAKERSPACE — everything from the "Makerspace Values" whiteboard.
//  When something about the space changes, edit it HERE. The info cards,
//  mini-games and the final Maker Pass all read from this file.
// =====================================================================
MS.data.makerspace = {
  name: "The Makerspace",
  host: "HPI d-school Afrika",
  tagline: "A community for makers and builders — a place with tools.",

  // Entrance sign
  checkIn: {
    required: true,
    sign: "Welcome to the makerspace. Check in is required for entry. Right of admission reserved.",
    how: "Scan the QR code on the Check-in stand at the entrance every time you arrive.",
  },

  // "What is it?"
  whatIsIt: [
    "A community for makers / builders",
    "A place with tools",
    "An idea lab",
    "A soon-to-be society",
  ],

  // "Who is it for?"
  whoFor: ["Innovators & change makers", "Students", "Interested professionals"],

  // "Why does it exist?"
  why: ["To nurture ideas", "To solve problems", "To inspire people to change for good"],

  // "How does it work?" — in order.
  howItWorks: [
    "Become a member",
    "Book a 1-hour session to learn how to use the equipment",
    "Bring an idea worth materialising",
  ],

  // "When can I use it?"
  // NOTE for editors: staff names were handwritten on the board — please double-check spelling.
  hours: {
    open: { days: "Monday – Friday", time: "9am – 3pm" },
    sessions: [
      { day: "Monday",    time: "2pm – 5pm", host: "Leo" },
      { day: "Tuesday",   time: "2pm – 7pm", host: "Angele" },
      { day: "Wednesday", time: "2pm – 5pm", host: "Jasmin" },
    ],
    community: { day: "Tuesday", time: "3pm – 7pm", name: "Community meetup" },
    machineRule: "Machines can only be used after equipment training (CNC, 3D printing, laser).",
  },

  // "Project?"
  projects: {
    yes: ["Personal learning projects", "Working on existing team projects"],
    no: ["Academic (graded) projects"],
    support: "You get support, advice and use of the equipment.",
  },

  // "Should I make it?" — a good project is...
  shouldIMakeIt: [
    "Improving the 'state of the art'",
    "Educational",
    "Thoughtful",
    "Meaningful",
    "Interesting",
    "Personal",
    "Worth keeping",
  ],

  // The Venn diagram. `in` lists which circles a note belongs to.
  values: {
    circles: [
      { id: "makerspace", label: "Makerspace", color: "#e2583e" },
      { id: "hpi",        label: "HPI",        color: "#4caf50" },
      { id: "dschool",    label: "D-School",   color: "#f2a900" },
    ],
    notes: [
      { text: "Give more than you take",                   in: ["makerspace"] },
      { text: "Leave it better than you found it",         in: ["makerspace"] },
      { text: "Respect people, environment & machines",    in: ["makerspace"] },
      { text: "Anti-consumerism",                          in: ["makerspace"] },
      { text: "Do it well",                                in: ["makerspace"] },
      { text: "Sustainable / circular",                    in: ["makerspace", "hpi"] },
      { text: "Create impact",                             in: ["makerspace", "dschool"] },
      { text: "Change mindsets",                           in: ["makerspace", "dschool"] },
      { text: "Sustainability",                            in: ["hpi"] },
      { text: "Integrity",                                 in: ["hpi"] },
      { text: "Collaboration",                             in: ["hpi"] },
      { text: "Mastery",                                   in: ["hpi"] },
      { text: "Solve wicked problems",                     in: ["hpi", "dschool"] },
      { text: "Qualified students",                        in: ["hpi", "dschool"] },
      { text: "Problem first, solution later",             in: ["dschool"] },
      { text: "Human-centred design",                      in: ["dschool"] },
    ],
  },

  // Everyday rules shown on the Maker Pass.
  golden_rules: [
    "Check in at the entrance every visit.",
    "Get trained before using CNC, 3D printers or lasers.",
    "Scan the machine QR to log usage when you START and when you FINISH.",
    "Never leave a laser cutter running unattended. Know where the emergency stop is.",
    "Leave it better than you found it — tools back on the wall, bench clean.",
    "Sort your waste: recyclables, non-recyclables, filament scraps, wood offcuts.",
  ],

  // Blue "Questions?" notes from the board — good to discuss with staff.
  openQuestions: [
    "What does the Makerspace get from this?",
    "Is the IP of the work I do mine or the Makerspace's?",
    "What decides a valid idea and a solid design for printing?",
  ],
};
