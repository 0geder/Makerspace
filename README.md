# Makerspace
This is an onboarding game to the Makerspace lab

A phone-first onboarding game for members of the Makerspace (HPI d-school Afrika).
Scan a QR code, pick a character, tap **PLAY**: the Maker Wheel spins and drops you straight into
a 15–30 second mini-game about one section of the real space. Bolt, the guide robot, pops up
with what is what while you play. Win to collect 9 badges (and up to 27 ⭐) and earn your
**Maker Pass**. New sections unlock each time you come back, so day 1 takes about two minutes.

## Play

- **Phones need a hosted link.** Host it free on **GitHub Pages**: repo → *Settings → Pages →
  Deploy from branch → `main` / root*. A QR code can't open a file on a laptop.
- On a computer, use the Pages link, or run any local web server in this folder
  (e.g. `py -m http.server`) and open `http://localhost:8000`. No install, no internet.
- Tap (or click) everything. Desktop extras: **Esc** leaves a mini-game, **M** mutes, arrow keys
  work in the action games.
- Progress saves automatically in the browser on that phone.

## What members see

- **First open**: Bolt says hi → pick one of 4 makers (name optional) → **▶ PLAY**. Two taps.
- **The run**: the wheel spins by itself → a ready screen (real photo of the area, Bolt's
  one-line tip, 3-2-1) → the mini-game → stars, badge, your character cheering and one
  "Remember" line → **Next ▶** spins again. When today's games are done: "Day complete!".
- **Home** (after the first run): your character, level, badges and stars, a big PLAY button,
  today's staffed session and meetup, a daily one-question challenge (with a 🔥 streak),
  "What do you want to make?" (a personal path of sections), and every section's info page.
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

Every game is short (≤ 6 rounds) and teaches through pop-ups, not question lists.

| Section | Mini-game | Teaches |
|---|---|---|
| 🎫 Entrance & Check-in | **Check-In Dash**: tap 4 steps in order, your maker runs to the door | Check in, membership, equipment session, logging usage |
| 💡 Values Whiteboard | **Sticky Flick**: tap where 5 sticky notes go in the Venn | Makerspace / HPI / D-School values |
| 🕒 Community Area | **Open or Closed?**: 5 day-and-time cards | Opening hours, who hosts which session, the meetup |
| 🔨 Hand-Tool Bench | **Tool Whack**: hit the right tool, 5 hits | Which hand tool for which job |
| 🖨️ 3D Printing Room | **Layer Stack**: drop 6 layers | Layer-by-layer printing, AMS, QR usage log |
| ⚡ Laser Room | **Safe Catch**: carry the bed, catch 6 safe sheets | Laser-safe vs. dangerous materials, e-stop |
| ♻️ Recycling Corner | **Bin It**: 6 items, 4 bins | Filament recycling, offcuts, bins |
| 🎨 Craft & Print Bench | **Match the Machine**: 4 makers, tap the photo | Cricut, mug / T-shirt press, 3D scanner, laser vs printer |
| 🚀 Idea Lab Desk | **Make It or Skip It**: swipe 5 ideas | Which projects belong in the Makerspace |

## ✏️ Editing the game (no coding needed)

**All content lives in `data/`. The code never needs to change when a fact changes.**

| I want to change… | Edit this file |
|---|---|
| Opening hours, staff names, values, rules, "who / why / what" | `data/makerspace.js` |
| A section's info card, photo, Bolt's `tip`, badge, level, "needs training" | `data/stations.js` |
| The "What do you want to make?" goals | `data/goals.js` |
| How many visits unlock each level | `levels` in `data/settings.js` |
| A mini-game's length, speed, pop-ups, `howTo`, `remember` line and content | `data/games/<game>.js` |
| The characters' names (or add a new one) | `data/characters.js` |
| The colour theme (game) | `colors` in `data/settings.js` |
| The colour theme (home page) | `:root` at the top of `style.css` |
| Star thresholds, wheel speed, countdown | `data/settings.js` |
| Photos | drop a `.jpg` into `assets/photos/` and reference its file name |

Values flow through automatically. Change the hours in `data/makerspace.js` and the
Community Area info card, the "Today" card, the Open-or-Closed game, the daily challenge and
the Maker Pass all update. The daily challenge draws its questions from the mini-game data files.

> Tip: set `debug: true` in `data/settings.js` to unlock every mini-game regardless of level.

## ➕ Adding a new mini-game

1. Create `data/games/mygame.js` with its content: `title`, `howTo` (one line), `remember`
   (one line for the result screen), and your own fields. Keep it to 6 rounds or fewer.
2. Create `games/mygame.js`:
   ```js
   MS.games.mygame = {
     create(api) {
       // api.data              your data file
       // api.good(x, y, "+1")  right move: sound, particles, your character cheers
       // api.bad(x, y, "✗")    wrong move: buzz, shake, your character goes "oops"
       // api.say("…")          Bolt's pop-up at the bottom (use it to say what is what)
       // api.finish(won, "3 / 5 right", 0.6)   the last number (0..1) sets the stars
       return {
         update(dt) { /* game logic */ },
         draw(g)    { /* draw with the canvas context g (450×800, portrait) */ },
       };
     },
   };
   ```
3. Add both files to `index.html` (data in section 1, game in section 3).
4. In `data/stations.js`, set `game: "mygame"`, a `level` and a `tip` on a station (or add one).
   The home screen, the wheel, the badge count and the Maker Pass pick it up automatically.
   Keep the top 56px free (title, your character, ✕) and keep tap targets above y≈680
   (Bolt's pop-ups live along the bottom). `MS.sprites.draw(g, MS.save.avatar(), "cheer0", x, y)`
   draws the player's character in any pose from `data/characters.js`.

`node tests/logic.test.js` checks every mini-game has a `title`, `howTo` and `remember` and is ≤ 6 rounds.

## Project layout

```
index.html          loads everything
style.css           cards, certificate, print layout
data/               ← content (edit me)
engine/             core loop + URL routing, input, drawing, audio, save, daily challenge,
                    sprites (characters), fx (particles, shake, Bolt's pop-ups)
engine/scenes/      home (HTML page), minigame (ready → play → result), wheel
games/              one file per mini-game
tests/              node tests/logic.test.js: visits, levels, daily challenge, opening hours, stars
assets/photos/      photos of the real space
assets/characters/  character sprite sheets (Kenney, CC0)
PROMPT.md           the full design brief / build prompt
```

## Content source & credits

Built from the Makerspace walkthrough videos, the photos of the space and the
"Makerspace — Values" whiteboard (see `PROMPT.md`, section 5). Staff names on the board were
handwritten. Please check the spelling in `data/makerspace.js`.

Characters: [Toon Characters 1](https://kenney.nl/assets/toon-characters-1) by Kenney (CC0),
trimmed to the poses the game uses. License: `assets/characters/LICENSE-kenney.txt`.
