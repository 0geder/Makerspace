# Makerspace
This is an onboarding game to the Makerspace lab

A phone-first onboarding game for members of the Makerspace (HPI d-school Afrika).
Members scan a QR code, browse the sections of the real space, and win a mini-game in each
one to collect 9 badges and earn their **Maker Pass**. New sections unlock each time they
come back, and a daily challenge gives them a reason to open it on every visit.

## Play

- **Phones need a hosted link.** Host it free on **GitHub Pages**: repo → *Settings → Pages →
  Deploy from branch → `main` / root*. A QR code can't open a file on a laptop.
- On a computer, use the Pages link, or run any local web server in this folder
  (e.g. `py -m http.server`) and open `http://localhost:8000`. No install, no internet.
- Tap (or click) everything. Desktop extras: **Esc** leaves a mini-game, **M** mutes, arrow keys
  work in the action games.
- Progress saves automatically in the browser on that phone.

## What members see

- **Home**: today's staffed session and meetup, a daily one-question challenge (with a 🔥 streak),
  "What do you want to make?" (picks a personal path of sections), the Maker Wheel for a
  random pick, and every section grouped by level.
- **Levels by visits**: a visit is a different calendar day the game is opened.
  Level 1 *Newcomer* (visit 1) → Level 2 *Member* (visit 2) → Level 3 *Maker* (visit 4).
  Locked sections still show their info and safety facts; only the mini-game waits.
- **QR codes in the space** open that section full screen and unlock it straight away.
- **Machine badges** (3D printing, laser) say clearly that a badge is not machine training.

## QR codes for each area

Each section has its own link: your Pages URL plus `?at=` and the station `id` from
`data/stations.js`. Opening it counts as being in that area (it unlocks the mini-game);
a plain `#<id>` link opens the same page without unlocking anything. Put each one into any QR-code generator and stick it in that area,
e.g. next to the machine usage QR.

| Area | Link |
|---|---|
| Entrance & Check-in | `https://<your-pages-url>/?at=entrance` |
| Values Whiteboard | `https://<your-pages-url>/?at=values` |
| Community Area | `https://<your-pages-url>/?at=community` |
| Hand-Tool Bench | `https://<your-pages-url>/?at=tools` |
| Showcase Shelf | `https://<your-pages-url>/?at=showcase` |
| Craft & Print Bench | `https://<your-pages-url>/?at=craft` |
| 3D Printing Room | `https://<your-pages-url>/?at=printing` |
| Laser Room | `https://<your-pages-url>/?at=laser` |
| Recycling Corner | `https://<your-pages-url>/?at=recycling` |
| Idea Lab Desk | `https://<your-pages-url>/?at=ideas` |
| Lockers & Lounge | `https://<your-pages-url>/?at=lounge` |

The game does **not** replace the official check-in: progress lives only on the member's
phone, so staff can't see it.

## The sections & mini-games

| Section | Mini-game | Teaches |
|---|---|---|
| 🎫 Entrance & Check-in | Order the onboarding steps | Check in, membership, training, logging usage |
| 💡 Values Whiteboard | Sort sticky notes into the Venn diagram | Makerspace / HPI / D-School values |
| 🕒 Community Area | Timed quiz | Opening hours, staffed sessions, community meetup |
| 🔨 Hand-Tool Bench | Whack-a-tool | Which hand tool for which job |
| 🖨️ 3D Printing Room | Layer stacker + quick check | Layer-by-layer printing, Bambu H2D, QR usage log |
| ⚡ Laser Room | Catch safe materials | Laser-safe vs. dangerous materials, e-stop |
| ♻️ Recycling Corner | Sort the waste | Filament recycling, offcuts, bins |
| 🎨 Craft & Print Bench | Which machine? (photos) | Cricut, mug / T-shirt press, 3D scanner |
| 🚀 Idea Lab Desk | Swipe ✔ / ✘ | Which projects belong in the Makerspace |

## ✏️ Editing the game (no coding needed)

**All content lives in `data/`. The code never needs to change when a fact changes.**

| I want to change… | Edit this file |
|---|---|
| Opening hours, staff names, values, rules, "who / why / what" | `data/makerspace.js` |
| A section's info card, photo, badge, level, "needs training" | `data/stations.js` |
| The "What do you want to make?" goals | `data/goals.js` |
| How many visits unlock each level | `levels` in `data/settings.js` |
| Questions / items / answers of one mini-game | `data/games/<game>.js` |
| Colours, pass marks, wheel | `data/settings.js` |
| Photos | drop a `.jpg` into `assets/photos/` and reference its file name |

Values flow through automatically. Change the hours in `data/makerspace.js` and the
Community Area info card, the "Today" card, the hours quiz, the daily challenge and the
Maker Pass all update. The daily challenge draws its questions from the mini-game data files.

> Tip: set `debug: true` in `data/settings.js` to unlock every mini-game regardless of level.

## ➕ Adding a new mini-game

1. Create `data/games/mygame.js` with its content (`title`, `intro`, `learned`, and your own fields).
2. Create `games/mygame.js`:
   ```js
   MS.games.mygame = {
     create(api) {           // api.data = your data file, api.finish(won, scoreText)
       return {
         update(dt) { /* game logic, call api.finish(true) when won */ },
         draw(g)    { /* draw with the canvas context g (450×800, portrait) */ },
       };
     },
   };
   ```
3. Add both files to `index.html` (data in section 1, game in section 3).
4. In `data/stations.js`, set `game: "mygame"` and a `level` on a station (or add a new station).
   The home screen, the wheel, the badge count and the Maker Pass pick it up automatically.
   Keep the top 56px free: the title and the ✕ button live there.

`engine/quiz.js` gives you a ready-made multiple-choice quiz (`MS.Quiz(questions, opts)`).
See `games/hours.js` for a 15-line example.

## Project layout

```
index.html          loads everything
style.css           cards, certificate, print layout
data/               ← content (edit me)
engine/             core loop + URL routing, input, drawing, audio, save, quiz, daily challenge
engine/scenes/      home (HTML page), minigame, wheel
games/              one file per mini-game
tests/              node tests/logic.test.js: checks visits, levels and the daily challenge
assets/photos/      photos of the real space
PROMPT.md           the full design brief / build prompt
```

## Content source

Built from the Makerspace walkthrough videos, the photos of the space and the
"Makerspace — Values" whiteboard (see `PROMPT.md`, section 3). Staff names on the board were
handwritten. Please check the spelling in `data/makerspace.js`.
