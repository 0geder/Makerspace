# Build Prompt — "Makerspace Quest" onboarding game

> This is the master prompt/spec the game was built from. Hand it to a developer (or an AI coding
> assistant) to rebuild, extend or audit the game. Keep it in sync when the design changes.

## 1. Goal

Build a **phone-first onboarding game** for the Makerspace (HPI d-school Afrika). Members open it by
scanning a QR code with their phone, before or during their visits. **When they win, they should know how the Makerspace works**: what it is, who it is
for, its values, when it is open, how to get access, what every section and machine is for, and the safety
and etiquette rules.

The core loop is **sections + mini-games, spread over several visits**:

1. The home screen lists the sections of the real space (photo, blurb), grouped into levels.
2. A member opens a section (tap it, spin the **Maker Wheel**, or scan the **QR code in that area**),
   reads its info (real photo + facts) and plays its **mini-game**.
3. Each win earns a **badge**. Levels unlock by **visits** (distinct days the game is opened), so the
   game keeps something new for the next visit. Scanning an area's QR code unlocks that area at once.
4. Every visit also offers a **daily challenge** question, a **Today** card (who is hosting), and a
   personal path from **"What do you want to make?"**.
5. Collect every badge → the **Maker Pass** page, which recaps everything they learned.

## 2. Audience

- **Players:** students and members, on their **phones** (portrait). No gaming skill assumed. 1–5 minutes per visit.
- **Editors:** Makerspace staff/devs who are *not* game developers. Changing an opening time, a staff name,
  a machine or a quiz question must be a one-line text edit in one obvious file.

## 3. Source material (from `drive-download-…/` photos + videos)

### Sections of the space
| Section | What's there |
|---|---|
| Entrance / Check-in | Glass doors with "MAKERSPACE"; laser-cut **Check in** stand: "Welcome to the makerspace. Check in is required for entry. Right of admission reserved. Scan here (QR)". |
| Community area | Long wooden tables, yellow stools, TV screen, mobile whiteboards (the "Values" board). |
| 3D Printing Room | Glass-walled room. **Bambu Lab H2D** printers with **AMS 2 Pro** multi-filament units; a tiny printer on a shelf. Each machine has a QR sign: *"You need to record your usage here when you start and when you finish."* |
| Laser Room | Separate room with extraction ducts. **Laser Cutter M1** (blue; emergency-stop button, key switch, ON/OFF), a second white/red laser, a box of plywood **offcuts**. Same usage QR sign. |
| Hand-tool bench | Pegboard wall + bench: claw hammers, rubber + wooden mallets, files, try square, speed square, utility knife, screwdrivers, pliers, wire strippers, clamps, glue guns. |
| Craft & Print bench | **Cricut Maker 4**, **mug press**, **plate press**, **T-shirt heat press**, paper printers, **Creality 3D scanner**. |
| Recycling corner | Plastic-recycling display (shredded filament flakes, printed toucan), recycling + non-recycling bins. |
| Showcase shelf | 3D-printed "d" letters (d-school logo), 3D-scanned printed heads, laser engravings, laser-cut finger-joint boxes with engraved names. |
| Lockers & lounge | Cubby lockers, red couch, fire extinguishers. |

### The whiteboard ("Makerspace – Values") — captured verbatim
- **Venn diagram of values**
  - Makerspace: *Give more than you take · Leave it better than you found it · Respect people, environment, machines · Anti-consumerism · Do it well*
  - Makerspace ∩ HPI: *Sustainable / circular*
  - Makerspace ∩ D-School: *Create impact · Change mindsets*
  - HPI: *Sustainability · Integrity · Collaboration · Mastery*
  - HPI ∩ D-School: *Solve wicked problems · Qualified students*
  - D-School: *Problem first, solution later · Human-centred design*
- **Who is it for?** Innovators / change makers · Students · Interested professionals
- **How does it work?** Become a member → Book a 1-hour session to learn using equipment → Bring an idea worth materialising
- **When can I use it?** Mon–Fri 9am–3pm · Mondays 2–5 (Leo) · Tues 2–7pm (Angele) · Wed 2–5 (Jasmin) · Tuesday 3–7pm community meetup · machines only *after equipment training – CNC, 3D, laser*
- **Why does it exist?** Nurture ideas · To solve problems · Inspire people, change for good
- **What is it?** Community for makers/builders · A place with tools · Idea lab · Soon-to-be society
- **Project?** Personal learning project – YES · Academic project – NO! · Work on existing team + projects · Support + advice + use equipment
- **Should I make it?** Improving the "state of the art" · Educational · Thoughtful · Meaningful · Interesting · Personal · Worth keeping
- **Open questions (blue notes):** What does Makerspace get from this? · Is the work done / the IP mine or the Makerspace's? · What decides a valid idea and a solid design for printing?

> Handwritten names (Leo / Angele / Jasmin) were hard to read — they live in `data/makerspace.js` so staff can correct them.

## 4. Technology

- **HTML + Canvas + plain JavaScript, zero dependencies, no build step.** Hosted on GitHub Pages
  (needed for phones / QR codes); also opens by double-clicking `index.html` (works from `file://`).
- The home screen is a normal HTML page; mini-games and the wheel are a 450×800 portrait canvas.
- Every view has a URL hash (`#<station>`, `#play/<id>`, `#wheel`, `#pass`) so the phone Back button
  and QR deep links work.
- Classic `<script>` tags (not ES modules) so it runs from `file://` without a server.
- Content is stored as `.js` data files (not `.json`) for the same reason: `fetch()` is blocked on `file://`.
- Art: **real photos of the space** on the home screen and info pages; procedural drawing in the mini-games.

## 5. Architecture — "every value in one obvious place"

```
index.html                 loads everything in order
data/                      ← EDIT CONTENT HERE (no game logic)
  settings.js              colours, pass marks, levels, wheel rules, debug flag
  makerspace.js            the whiteboard: values, hours, staff, rules, who/why/what
  stations.js              sections: info, photos, level, training flag, which mini-game each runs
  goals.js                 "What do you want to make?" → sections to show first
  games/<id>.js            questions / items / answers for each mini-game
engine/                    ← shared game engine (rarely needs editing)
  core.js  input.js  draw.js  audio.js  save.js  ui.js  quiz.js  daily.js
  scenes/  home.js  wheel.js  minigame.js
games/<id>.js              ← one file per mini-game (logic only, content comes from data/games/<id>.js)
assets/photos/             real photos of the space
```

Rules:
1. **No content strings or numbers inside `games/` or `engine/`** – they read from `MS.data`.
2. **One mini-game = one logic file + one data file.** Adding a game = add two files, two `<script>` tags,
   and reference its id from a station in `data/stations.js`. The wheel picks it up automatically.
3. Removing a station from `data/stations.js` removes it from the home screen, the wheel and the badge count.
4. Every fact file has comments telling editors what each field does.

## 6. Mini-games (one per section)

| id | Section | Mechanic | Teaches |
|---|---|---|---|
| `checkin` | Entrance | **Order the steps** – tap the onboarding steps in the right order (3 lives) | Check in → member → book session → training → bring idea → log usage |
| `values` | Values whiteboard | **Venn sort** – tap where each sticky note belongs in the 3-circle diagram (incl. overlaps) | Makerspace / HPI / D-School values |
| `hours` | Community area | **Timed quiz** about opening hours, staff sessions, community meetup, who it's for | When/who |
| `tools` | Hand-tool bench | **Whack-a-tool** – tools pop up on the pegboard; hit the right one for the task | Hand tool names + uses |
| `printing` | 3D Printing Room | **Layer stacker** – drop layers on the nozzle beat; misaligned overhang is trimmed. Then quick facts | Layer-by-layer printing, usage logging, AMS, training |
| `laser` | Laser Room | **Material catcher** – drag the bed, catch laser-safe sheets, dodge banned ones (PVC, vinyl…) | Material safety, extraction, never leave unattended, e-stop |
| `recycling` | Recycling corner | **Sort it** – send items to the right bin/box before the timer runs out | Waste streams, filament recycling, offcuts box |
| `craft` | Craft & Print bench | **Which machine?** – match requests to machines (photo answers) | Cricut, mug/plate/T-shirt press, scanner, printers |
| `ideas` | Idea Lab desk | **Swipe** ✔/✘ – should this project be made here? | Project rules + "Should I make it?" criteria |

Each mini-game: short intro screen (what you'll learn) → play → result screen with **"What you learned"** bullet
points pulled from its data file → badge. Fail = retry, no punishment. A ✕ in the header always leaves.
Machine sections (`training: true`) say that a badge is **not** machine training.

Levels (in `data/settings.js`): 1 Newcomer = entrance, values, community · 2 Member (visit 2) = tools,
craft, recycling · 3 Maker (visit 4) = printing, laser, ideas.

## 7. Game flow

QR code / link → home (enter name once) → Today card, daily challenge, goal picker, sections by level →
open a section (tap, wheel, or QR deep link) → info page with photo + facts → **Play** → result → badge →
back to the section → … → all badges → **Maker Pass** page (name, date, badges, key facts, print).
Progress and visit days auto-save in the browser (safe if storage is blocked). The game does not replace
the official check-in.

## 8. Acceptance criteria

- [ ] Readable and fully playable by touch on a portrait phone (≈375×812); no keyboard needed.
- [ ] The phone Back button moves between views and never leaves the game when opened from a QR code.
- [ ] `index.html#<station>` opens that section and unlocks its mini-game.
- [ ] Every whiteboard note above appears somewhere in play (info page, mini-game or Maker Pass).
- [ ] Changing `hours` in `data/makerspace.js` changes the info page, Today card, hours quiz and Maker Pass.
- [ ] Each mini-game lives in its own file and reads its content from its own data file.
- [ ] `node tests/logic.test.js` passes.
- [ ] README explains how to play, how to edit content, how to add a mini-game, QR links, and GitHub Pages.

## 9. Repo rules

- Repo/folder name: **`Makerspace`**.
- Commits are authored by the repo owner only — **no AI co-author lines or tool tags** in commits, PRs or files.
