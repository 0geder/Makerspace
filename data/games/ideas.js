// Mini-game content: IDEAS — "Should I make it?" swipe game
// ok: true = a good Makerspace project, false = not. `why` is shown after answering.
MS.data.games.ideas = {
  title: "Should I Make It?",
  intro: "Ideas arrive at the Idea Lab. Press → / click ✔ if it belongs in the Makerspace, ← / click ✘ if not.",
  passMark: 0.75,
  cards: [
    { text: "A personal project to learn how to design gears.", ok: true,  why: "Personal learning projects — YES!" },
    { text: "My graded final-year engineering assignment.",       ok: false, why: "Academic projects — NO! Use your faculty's labs." },
    { text: "Joining an existing team project building a solar lamp.", ok: true, why: "Working on existing team projects is welcome." },
    { text: "Printing 200 keychains to sell at a market.",       ok: false, why: "Mass-producing to sell isn't the point — anti-consumerism." },
    { text: "A prosthetic hand prototype for a local clinic.",   ok: true,  why: "Meaningful, solves a real problem — create impact." },
    { text: "Random trinkets I'll throw away tomorrow.",          ok: false, why: "Should I make it? It should be worth keeping." },
    { text: "Improving an existing design to use less plastic.", ok: true,  why: "Improving the 'state of the art' + sustainable." },
    { text: "Copying a branded product to avoid buying it.",     ok: false, why: "Not thoughtful or original — and respect others' IP." },
    { text: "A gift box engraved for my grandmother.",           ok: true,  why: "Personal, meaningful and worth keeping." },
    { text: "A teaching model to explain a concept to my class.",ok: true,  why: "Educational and interesting." },
  ],
  learned: [
    "Personal learning projects — YES. Academic projects — NO.",
    "Join existing team projects and get support, advice and equipment.",
    "Should I make it? Meaningful, educational, thoughtful, personal, worth keeping.",
  ],
};
