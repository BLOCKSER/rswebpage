/* =========================================================
   ABR CASE ARCHIVE — DATA LAYER
   All case content lives here, separate from rendering (archive.js)
   and presentation (archive.css). Edit this file to add cases,
   reports, or timeline entries without touching layout code.
   ========================================================= */

const CASES = [
  {
    id: "article_1",
    title: "Fractal Crossparts",
    status: "dangerous",
    date: "2011-06-02",
    era: "2011",
    origin: "Unknown",
    associated: "Hostile entities",
    description: [
      "The <strong>Fractal Crossparts</strong> are an anomaly first recorded on June 2, 2011.",
      "User observations characterize the anomaly as a blocky, fractal-like structure built from repeating cross-shaped parts. During investigation, the structure was reported to form what observers described as a landing portal.",
      "Further reports describe hostile entities appearing around the portal area."
    ],
    quotes: [
      { text: "The parts don't look like they were placed normally. The shape keeps repeating, and the inside eventually looks like somewhere you can enter.", cred: "Preserved investigator report wording." },
      { text: "People said the entities should not be followed. The old flashlight was used to distinguish a safe location from a dangerous one.", cred: "Preserved investigator report wording." }
    ],
    notes: [
      "Observe entity behavior from a safe position.",
      "Do not follow hostile entities during field observation.",
      "Record flashlight indicator changes and location conditions."
    ],
    indicator: [
      { color: "green", label: "Green dot", meaning: "Area considered safe by investigators" },
      { color: "red", label: "Red dot", meaning: "Area considered dangerous by investigators" }
    ],
    caseNote: "Investigation ongoing. Additional observations may change the classification of the structure, portal, and associated entities."
  },
  {
    id: "article_2",
    title: "Robots",
    status: "safe",
    date: "2010-02-02",
    era: "2010",
    origin: "BOT GUY instances",
    associated: "Mechanical bots",
    description: [
      "The <strong>Robots</strong> are mechanical entities first recorded on February 2, 2010.",
      "Field reports describe them as mechanical-looking bots that appeared to retain fragments of earlier BOT GUY behavior.",
      "Later observations suggested that some entities may have been <strong>trapped bot instances</strong>."
    ],
    quotes: [
      { text: "They looked like robots, but the strange part was that they seemed to remember being bots before they became mechanical.", cred: "Preserved investigator report wording." }
    ],
    standaloneQuote: { text: "I WAS A BOT BEFORE THIS.", cred: "Preserved robot statement recorded during investigation." },
    behavior: "Investigators did not generally classify the Robots as hostile. Reports indicate they could communicate with players and other bots.",
    caseNote: "Investigation continues. Investigators are examining whether the mechanical appearance represents a transformation, a damaged bot state, or another unexplained process."
  },
  {
    id: "article_3",
    title: "The Woods",
    status: "moderate",
    date: "2007-02-06",
    era: "2008",
    origin: "2007-02-06",
    associated: "Builder bots",
    description: [
      "\"The Woods\" was an environment that formed around activity involving builder bots. Field reports described these builder bots as entities capable of small autonomous expeditions, gathering resources and constructing structures without direct player placement."
    ],
    standaloneQuote: { text: "they are building by themselves", cred: "User observation recorded during investigation." },
    extra: [
      "Investigators reported that the builder bots began forming increasingly complex settlements. One settlement, identified as <strong>Jazirisk</strong>, was reported to have reached a population of more than <strong>100,000 bots</strong>.",
      "The environment was reportedly developed by a figure identified as <strong>Jayington Mark</strong>. Investigation notes describe the project as an experiment intended to observe bots attempting to reconstruct aspects of Earth through autonomous construction.",
      "Records state the environment continued until <strong>2015-01-04</strong>, when Roblox server instability and repeated crashes interrupted further observation."
    ],
    caseNote: "Investigators are documenting autonomous construction, resource gathering, settlement growth, and the effects of long-term independent bot activity."
  },
  {
    id: "article_4",
    title: "Towers Of Babel",
    status: "safe",
    date: "2009-01-06",
    era: "2009",
    origin: "2009-01-02",
    associated: "Mechanical bots",
    description: [
      "\"Towers Of Babel\" was an environment that formed during early developments of <strong>BOT GUY</strong>. This case is <i>unapproved</i> — the environment was undocumented until players discovered it, after which it was added to the archive.",
      "The environment consisted of repeating, colorful towers populated by robots, extending seemingly infinitely and filled with <i>question</i> NPCs."
    ],
    extra: [
      "Some investigators reported that reaching chunk 0000,001000,001000 resulted in an immediate ban, for reasons that remain unclear."
    ],
    caseNote: "Investigation ongoing. Additional field records are being reconciled for this case."
  }
];

const REPORTS = [
  { num: "001", year: "2008", title: "Repeated Bot Movement", note: "A BOT GUY instance repeatedly returned to the same location after being moved away by its owner. The behavior was recorded for further observation.", foot: "Status: Under review" },
  { num: "002", year: "2010", title: "Mechanical Robot Sighting", note: "A mechanical-looking bot was observed in an old BOT GUY environment and appeared capable of retaining fragments of an earlier configuration.", foot: "Associated case: Robots", link: "article_2" },
  { num: "003", year: "2011", title: "Strange Block Structure", note: "A block-based structure was reported as recursively repeating and later appearing to function as a portal-like opening.", foot: "Associated case: Fractal Crossparts", link: "article_1" },
  { num: "004", year: "2008", title: "Builder Bot Activity", note: "Builder bots were observed gathering resources independently and constructing structures without direct placement by a player.", foot: "Associated case: The Woods", link: "article_3" }
];

const TIMELINE = [
  { year: "2007", title: "BOT GUY", body: "BOT GUY was introduced as a standalone bot system for Roblox, built to give autonomous entities the capacity for communication, social behavior, combat, cooperation, and varied behavioral patterns. Its editor let users create, modify, and organize bot behavior directly." },
  { year: "2010", title: "Robots", body: "On <strong>February 2, 2010</strong>, investigators recorded the Robots case as one of the major anomaly reports in the archive.", link: "article_2" },
  { year: "2011", title: "Fractal Crossparts", body: "On <strong>June 2, 2011</strong>, the Fractal Crossparts case was recorded and classified as a dangerous anomaly during investigation.", link: "article_1" },
  { year: "2015", title: "The Woods", body: "Investigators continued documenting builder bot activity, independent construction, and the large settlements associated with the Woods environment.", link: "article_3" },
  { year: "2016", title: "Investigation Period", body: "By 2016, the archive held multiple interconnected records concerning BOT GUY, anomalous environments, mechanical entities, and unusual bot behavior." }
];

const STATUS_LABEL = { dangerous: "Dangerous", safe: "Safe", moderate: "Moderate" };