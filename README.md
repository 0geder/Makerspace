# Makerspace
This is an onboarding game to the Makerspace lab

A 2D onboarding game for new members of the Makerspace (HPI d-school Afrika).
Walk around a map of the real space, spin the **Maker Wheel**, and win a mini-game in every
section. Collect all 9 badges to earn your printable **Maker Pass**. By then you know the
values, the opening hours, the machines and the safety rules.

## Play

- **Double-click `index.html`.** No install, no server, no internet needed.
- Or host it free on **GitHub Pages**: repo → *Settings → Pages → Deploy from branch → `main` / root*.
- Controls: **WASD / arrows** or **click** to walk · **E / Space** to interact · **Esc** to leave a mini-game · **M** to mute.
- Progress saves automatically in the browser.

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
| A section's info card, photo, position on the map, badge | `data/stations.js` |
| Questions / items / answers of one mini-game | `data/games/<game>.js` |
| Speeds, colours, pass marks, "must spin the wheel first" | `data/settings.js` |
| Photos | drop a `.jpg` into `assets/photos/` and reference its file name |

Values flow through automatically. Change the hours in `data/makerspace.js` and the
Community Area info card, the hours quiz and the Maker Pass certificate all update.

> Tip: set `debug: true` in `data/settings.js` to unlock every mini-game without spinning.

## ➕ Adding a new mini-game

1. Create `data/games/mygame.js` with its content (`title`, `intro`, `learned`, and your own fields).
2. Create `games/mygame.js`:
   ```js
   MS.games.mygame = {
     create(api) {           // api.data = your data file, api.finish(won, scoreText)
       return {
         update(dt) { /* game logic, call api.finish(true) when won */ },
         draw(g)    { /* draw with the canvas context g (960×600) */ },
       };
     },
   };
   ```
3. Add both files to `index.html` (data in section 1, game in section 3).
4. In `data/stations.js`, set `game: "mygame"` on a station (or add a new station).
   The wheel, the badge count and the Maker Pass pick it up automatically.

`engine/quiz.js` gives you a ready-made multiple-choice quiz (`MS.Quiz(questions, opts)`).
See `games/hours.js` for a 15-line example.

## Project layout

```
index.html          loads everything
style.css           cards, certificate, print layout
data/               ← content (edit me)
engine/             core loop, input, drawing, audio, save, quiz, scenes
games/              one file per mini-game
assets/photos/      photos of the real space
PROMPT.md           the full design brief / build prompt
```

## Content source

Built from the Makerspace walkthrough videos, the photos of the space and the
"Makerspace — Values" whiteboard (see `PROMPT.md`, section 3). Staff names on the board were
handwritten. Please check the spelling in `data/makerspace.js`.
