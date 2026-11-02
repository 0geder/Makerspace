# Build Prompt — "Makerspace Quest" onboarding game (v3: Quick Play)

> The master prompt/spec for the game. Hand it to a developer (or an AI coding assistant) to rebuild,
> extend or audit the game. Keep it in sync when the design changes.
> v1 = walkable desktop map · v2 = phone-first home page, levels by visit, QR links ·
> **v3 = Quick Play: a real, fast arcade game with characters, built on top of v2.**

## 1. Goal

A **phone-first onboarding game** for the Makerspace (HPI d-school Afrika). New members scan a QR code
on their first day and are **playing within 10 seconds**. Every mini-game is a short arcade burst, not a
quiz. Each one teaches one section of the real space through play and quick **pop-ups that say what is
what**. By the time a player has every badge, they know what the Makerspace is, who it's for, its values,
when it's open, how to get access, what every section and machine is for, and the safety rules.

**The test:** a student on their first day should never sit still answering a list of questions. They should
be tapping, catching, stacking and swiping, with the facts arriving as quick pop-ups while they play.

## 2. Audience

- **Players:** new students and members, on their **phones** (portrait), standing in the space.
  No gaming skill assumed. Day 1 should take **about 2 minutes**, and each later visit 1–3 minutes.
- **Editors:** Makerspace staff/devs who are *not* game developers. Changing an opening time, a staff name,
  a machine, a pop-up line or a game's length must be a one-line text edit in one obvious file.

## 3. Design rules (Quick Play)

1. **Two taps to play.** First open: pick a character → **PLAY**. The name is optional. Returning: **PLAY**.
2. **The run loop:** PLAY → the wheel **spins by itself** (≈2 s) → lands on an unlocked section →
   *ready* screen (1-line "how to play", the guide's "what is what" pop-up, 3-2-1, tap to skip) →
   **mini-game, 15–30 s** → result (badge, ⭐ stars, the player's character cheering, one "Remember" line) →
   **Next ▶** spins again. No reading walls between games.
3. **Short by default:** **max 6 rounds / targets per game.** No multiple-choice question lists inside
   games. Every length and speed lives in that game's data file.
4. **Pop-ups teach.** The guide robot pops up with one line as things happen ("PVC → toxic chlorine gas!",
   "Wire strippers: take insulation off a wire"). Pop-ups never block play.
5. **Juice:** every right move gets a sound, particles, a floating "+1" and a cheering character.
   Every wrong move gets a buzz, a little shake, the character's "oops" pose and the right answer as a pop-up.
6. **Stars, not pass/fail stress.** 1–3 ⭐ per game (best score kept). The badge needs the game's pass
   mark; lives running out means "try again". Retrying is instant.
7. **Day 1 ends on a high:** when everything unlocked today is done → "Day complete! 🎉", what unlocks next
   visit, and a hint to scan the QR codes around the space to unlock areas early.
8. **Depth is optional.** The home page still has every section's info page (photo + facts), Today, the
   daily challenge, "What do you want to make?" and the Maker Pass. They appear **after** the first run, so
   the first screen stays clean.

## 4. Characters & art

- **Kenney "Toon Characters 1"** (CC0, kenney.nl). The license is in `assets/characters/LICENSE-kenney.txt`.
  The sheets in `assets/characters/` are trimmed to 19 poses each (192×256 frames, 6 per row):
  `idle talk think show interact hold cheer0 cheer1 hit jump wide walk0…walk7`.
- **Players** choose one of four makers (female/male person, female/male adventurer).
- **Guide:** the robot, "Bolt", delivers every pop-up and the "Remember" line.
- Where the player shows up: the character picker, the ready screen (jumping), the game header (reacts:
  `cheer` on good, `hit` on bad), the result screen (cheering, or `think` after a loss), and the home hero.
- Real **photos of the space** stay on info pages, ready screens and the craft game.
- Names, sheets and pose names live in `data/characters.js`.
- **Theme: bright, like the real room.** Light terrazzo floor, white walls, birch-plywood panels and
  headers, yellow (stools) and orange-red (signs) accents, dark text. No dark mode. The palette lives in
  `colors` in `data/settings.js`; `style.css :root` mirrors it for the home page. Only the machines
  themselves (printer interior, laser bed) stay dark, like the real ones.

## 5. Source material (from `drive-download-…/` photos + videos)

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

> Handwritten names (Leo / Angele / Jasmin) were hard to read. They live in `data/makerspace.js` so staff can correct them.

## 6. Mini-games (one per section, 15–30 s each)

| id | Section | Mechanic | Default length | Pop-ups teach |
|---|---|---|---|---|
| `checkin` | Entrance | **Check-In Dash**: tap the 4 steps in order; your character runs to the door with each one | 4 steps, 3 lives | check in → book a session → get trained → log machine use |
| `values` | Values whiteboard | **Sticky Flick**: tap where each sticky note goes in the 3-circle Venn (overlaps count) | 5 notes | which values belong to Makerspace / HPI / D-School |
| `hours` | Community area | **Open or Closed?**: a day + time card appears; tap OPEN or CLOSED before the timer runs out | 5 cards × 5 s | opening hours, who hosts which session, the community meetup |
| `tools` | Hand-tool bench | **Tool Whack**: tools pop out of the pegboard; hit the one that fits the task | 5 hits, 3 lives | each tool's job |
| `printing` | 3D Printing Room | **Layer Stack**: drop layers on the beat; overhang is trimmed | 6 layers | layer by layer, AMS, log START/FINISH, training |
| `laser` | Laser Room | **Safe Catch**: drag the laser bed to catch safe sheets and dodge banned ones | 6 catches, 3 lives | why PVC / vinyl / polycarbonate / metal are banned |
| `recycling` | Recycling corner | **Bin It**: tap the right bin for each item | 6 items × 4 s | filament recycling, offcut box, bins |
| `craft` | Craft & Print bench | **Match the Machine**: tap the photo of the right machine | 4 requests × 6 s | Cricut, presses, scanner, laser vs printer |
| `ideas` | Idea Lab desk | **Make It or Skip It**: swipe or tap ✔ / ✘ on project ideas | 5 cards | project rules and "Should I make it?" |

Each data file has: `title`, `howTo` (one line on the ready screen), `tips` (pop-ups during play),
`remember` (the one line on the result screen), `passMark` or lives, and the game's own content.
Machine sections (`training: true`) add: "A badge isn't machine training. Book a session."

## 7. Technology

- **HTML + Canvas + plain JavaScript, zero dependencies, no build step.** Hosted on GitHub Pages
  (needed for phones / QR codes) or any local static server.
- The home screen is a normal HTML page. The wheel and mini-games are a 450×800 portrait canvas.
- Every view has a URL hash (`#<station>`, `#play/<id>`, `#wheel`, `#pass`), so the phone Back button
  and QR deep links work. `index.html?at=<station>` is the QR link: it unlocks that area.
- Classic `<script>` tags (not ES modules) and `.js` data files (not `.json`), so it also runs from `file://`.

## 8. Architecture — "every value in one obvious place"

```
index.html                 loads everything in order
data/                      ← EDIT CONTENT HERE (no game logic)
  settings.js              colours, levels, wheel speed, star thresholds, debug flag
  characters.js            the 4 player makers + the guide robot: names, sheets, poses
  makerspace.js            the whiteboard: values, hours, staff, rules, who/why/what
  stations.js              sections: info, photo, `tip` pop-up, level, training flag, which mini-game
  goals.js                 "What do you want to make?" → sections to show first
  games/<id>.js            each mini-game's length, speed, pop-ups and content
engine/                    ← shared engine (rarely needs editing)
  core.js input.js draw.js audio.js save.js ui.js daily.js
  sprites.js               draws characters from the sheets (canvas + HTML avatars)
  fx.js                    particles, floating text, shake, the guide's pop-up bubble
  scenes/ home.js wheel.js minigame.js
games/<id>.js              ← one file per mini-game (logic only)
assets/photos/             real photos of the space
assets/characters/         Kenney sprite sheets (CC0)
tests/logic.test.js        node tests (save, levels, daily, opening-hours logic, stars)
```

Rules:
1. **No content strings or numbers inside `games/` or `engine/`.** They read from `MS.data`.
2. **One mini-game = one logic file + one data file.** Games talk to the engine through `api`:
   `api.good(x, y, label)`, `api.bad(x, y, label)`, `api.say(text)`, `api.finish(won, scoreText, ratio)`.
3. Removing a station from `data/stations.js` removes it from the home screen, the wheel and the badge count.
4. Every data file has comments telling editors what each field does.

## 9. Acceptance criteria

- [ ] First open on a phone: playing a mini-game within **2 taps / 10 seconds**.
- [ ] No mini-game takes more than ~30 s at default settings; none shows a multiple-choice question list.
- [ ] Every mini-game shows at least one guide pop-up and gives feedback on every move.
- [ ] Day 1 (Level 1): three games back-to-back with **Next ▶**, then a "Day complete" screen.
- [ ] Readable and fully playable by touch on a portrait phone (≈375×812). No keyboard needed.
- [ ] The phone Back button moves between views and never leaves the game when opened from a QR code.
- [ ] `index.html?at=<station>` opens that section and unlocks its mini-game; reloading doesn't count as a scan.
- [ ] Every whiteboard note above appears somewhere in play (pop-up, mini-game, info page or Maker Pass).
- [ ] Changing `hours` in `data/makerspace.js` changes the info page, Today card, the Open-or-Closed game
      and the Maker Pass.
- [ ] `node tests/logic.test.js` passes. No console errors in a browser run of every game.
- [ ] README explains how to play, edit content, add a mini-game, QR links and GitHub Pages.

## 10. Repo rules

- Repo/folder name: **`Makerspace`**. Work on a feature branch and merge via PR.
- Commits are authored by the repo owner only. **No AI co-author lines or tool tags** in commits, PRs or files.
