// Mini-game content: IDEAS — "Make It or Skip It"
// ok: true = a good Makerspace project, false = not. `why` is the guide's pop-up after answering.
MS.data.games.ideas = {
  title: "Make It or Skip It",
  howTo: "Swipe right (or ✔) to make it, left (or ✘) to skip it.",
  rounds: 5,         // cards per game (picked at random)
  passMark: 0.6,
  cards: [
    { text: "A personal project to learn how to design gears.", ok: true,  why: "Personal learning projects: YES!" },
    { text: "My graded final-year engineering assignment.",       ok: false, why: "Academic projects: NO! Use your faculty's labs." },
    { text: "Joining an existing team project building a solar lamp.", ok: true, why: "Working on existing team projects is welcome." },
    { text: "Printing 200 keychains to sell at a market.",       ok: false, why: "Mass-producing to sell isn't the point: anti-consumerism." },
    { text: "A prosthetic hand prototype for a local clinic.",   ok: true,  why: "Meaningful and solves a real problem: create impact." },
    { text: "Random trinkets I'll throw away tomorrow.",          ok: false, why: "Should I make it? It should be worth keeping." },
    { text: "Improving an existing design to use less plastic.", ok: true,  why: "Improving the 'state of the art', and sustainable." },
    { text: "Copying a branded product to avoid buying it.",     ok: false, why: "Not thoughtful or original, and respect others' IP." },
    { text: "A gift box engraved for my grandmother.",           ok: true,  why: "Personal, meaningful and worth keeping." },
    { text: "A teaching model to explain a concept to my class.",ok: true,  why: "Educational and interesting." },
  ],
  remember: "Personal learning & team projects: YES. Graded assignments: NO. Make things worth keeping.",
};
