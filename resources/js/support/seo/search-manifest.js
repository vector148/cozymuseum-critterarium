import { normalizeAnswerContract } from "./answer-contract.js";

export const coreSearchRoutes = Object.freeze([
  {
    path: "/",
    keywordSignals: ["media tracker all in one", "private media library app", "offline nature journal app", "make hiking a game app"],
    title: "CozyMuseum | A Quieter Way to Collect What Shapes You",
    description: "CozyMuseum is home to Critterarium, a source-linked living-world catalogue, and Curatale, a private local-first media museum.",
    heading: "Two museums. One quieter way to collect.",
    body: "Choose Critterarium to explore organisms and preserve encounters, or Curatale to organize the media and discoveries that shaped you.",
    question: "What is CozyMuseum?",
    directAnswer: "CozyMuseum is the master brand for two sibling museums: Critterarium is a source-linked living-world catalogue with a local encounter layer, while Curatale is a paid personal-use local-first museum for games, films, music, and saved discoveries. Each product has its own acquisition path, data boundary, and purpose.",
    entities: ["cozymuseum", "critterarium", "curatale"],
    links: [{ href: "/critterarium", label: "Explore the living world in Critterarium" }, { href: "/curatale", label: "Build your personal media museum with Curatale" }, { href: "/reading-room", label: "Read stories and collection guides" }],
    type: "website",
  },
  {
    path: "/critterarium",
    primaryKeyword: "offline nature journal app",
    keywordSignals: ["make hiking a game app", "cozy nature journal app", "animal identifier without streaks", "aesthetic digital nature collection"],
    title: "Critterarium | A Real-Life Nature Collection",
    description: "Explore a public, source-linked organism catalogue and keep browser-local encounters without a social feed or automatic identification.",
    heading: "Critterarium",
    body: "Critterarium combines a public catalog of organisms with a browser-local layer for encounters you choose to remember.",
    question: "What is Critterarium?",
    directAnswer: "Critterarium is CozyMuseum's living-world product: a real-life nature collection without a social feed, built from a public Atlas of organisms and a browser-local layer for personal encounters. It offers a gentle way to gamify nature walks while keeping scientific names, sources, and product limits visible.",
    entities: ["cozymuseum", "critterarium"],
    links: [{ href: "/", label: "Choose a CozyMuseum" }, { href: "/reading-room", label: "Read nature and collection stories" }, { href: "/hall-of-fame", label: "View the Nature Hall of Fame" }],
    type: "product",
  },
  {
    path: "/curatale",
    primaryKeyword: "private movie tracker app",
    keywordSignals: ["media tracker all in one", "offline game and movie tracker", "game backlog anxiety", "local first media tracker"],
    title: "Curatale | Private Movie Tracker & Media Collection",
    description: "Keep games, films, music, and saved discoveries in a paid local-first personal museum—an alternative to media tracker spreadsheets.",
    heading: "Curatale",
    body: "Curatale is a paid local-first application for organizing the games, films, music, and discoveries that shaped you into a museum you keep.",
    question: "What is Curatale?",
    directAnswer: "Curatale is CozyMuseum's active $29 personal-use local application for organising games, films, music, and saved discoveries as a private museum. It works as a private movie tracker and a structured alternative to media tracker spreadsheets for people who feel game-backlog pressure.",
    entities: ["cozymuseum", "curatale"],
    links: [{ href: "/", label: "Choose a CozyMuseum" }, { href: "/reading-room/what-is-local-first", label: "Understand what local-first ownership means" }, { href: "/reading-room/curating-a-digital-space", label: "Learn how to curate a digital space" }],
    type: "product",
  },
  {
    path: "/reading-room",
    title: "Reading Room | Nature, Culture and Personal Collections",
    description: "Read CozyMuseum stories across four themes: nature up close, what shaped you, yours by design, and living collections.",
    heading: "The CozyMuseum Reading Room",
    body: "Browse four editorial paths about the living world, cultural memory, clear ownership, and collections that remain meaningful over time.",
    question: "What can I find in the CozyMuseum Reading Room?",
    directAnswer: "The Reading Room follows four editorial paths: Nature Up Close, What Shaped You, Yours by Design, and Living Collections. Each article answers a focused question and offers the relevant Critterarium or Curatale route as an optional next step.",
    entities: ["cozymuseum", "reading-room"],
    links: [],
    type: "collection",
  },
  {
    path: "/hall-of-fame",
    primaryKeyword: "nature hall of fame",
    keywordSignals: ["highest rated animals", "best wildlife encounters", "rarest animals collected"],
    title: "Hall of Fame — Curated Nature Highlights | CozyMuseum",
    description: "Discover the highest-ranked wildlife encounters in the CozyMuseum Critterarium, ordered by rarity score.",
    heading: "Nature Hall of Fame",
    body: "Explore the most remarkable and highly-rated organism encounters in the Critterarium.",
    question: "What is the Nature Hall of Fame?",
    directAnswer: "The Nature Hall of Fame is a curated showcase of the most remarkable and highly-rated wildlife encounters recorded in the CozyMuseum Critterarium.",
    entities: ["cozymuseum", "critterarium"],
    links: [
      { href: "/critterarium", label: "Explore the living world in Critterarium" },
      { href: "/reading-room/how-the-rarity-score-works", label: "Understand how rarity scoring works" }
    ],
    type: "collection",
  },
].map((route) => Object.freeze({
  ...route,
  answerContract: normalizeAnswerContract({
    question: route.question,
    directAnswer: route.directAnswer,
    entities: route.entities,
    claims: [],
    snippet: { mode: "full" },
    revalidateAt: "2026-11-24",
    reviewState: "approved",
    owner: "Commercial / CCO",
  }),
})));

function articleProductLink(article) {
  return article.pillar === "nature-up-close" || article.pillar === "living-collections"
    ? { href: "/critterarium", label: "Explore organisms in Critterarium" }
    : { href: "/curatale", label: "Build a personal media museum with Curatale" };
}

function articleEntities(article) {
  const product = article.pillar === "nature-up-close" || article.pillar === "living-collections"
    ? "critterarium"
    : "curatale";
  return ["cozymuseum", "reading-room", product];
}

export function buildSearchManifest(publishedArticles) {
  const articleRoutes = publishedArticles.map((article) => ({
    path: `/reading-room/${article.slug}`,
    title: article.seoTitle,
    description: article.seoDescription,
    heading: article.title,
    body: article.dek,
    content: article.content,
    links: [{ href: "/reading-room", label: "Browse the CozyMuseum Reading Room" }, articleProductLink(article)],
    type: "article",
    datePublished: article.datePublished,
    source: "supabase/seed.sql",
    gallerySearchNames: article.gallerySearchNames,
    answerContract: normalizeAnswerContract({
      ...article.answerContract,
      entities: articleEntities(article),
    }),
  }));
  const hub = coreSearchRoutes.find(({ path }) => path === "/reading-room");
  const coreRoutes = coreSearchRoutes.map((route) => route.path === "/reading-room"
    ? { ...hub, links: articleRoutes.map(({ path, heading }) => ({ href: path, label: heading })) }
    : route);
  return Object.freeze([...coreRoutes, ...articleRoutes]);
}

export function findCoreSearchRoute(pathname) {
  return coreSearchRoutes.find((route) => route.path === pathname) || null;
}
