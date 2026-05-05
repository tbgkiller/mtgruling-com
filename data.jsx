// data.jsx — fake (but plausible) ruling/comment/card data for the prototype.
// Cards are referenced by Scryfall query — the CardImage component fetches the
// real artwork at runtime (Scryfall provides their image API free for software).

const RULINGS_DB = [
  {
    id: 'R-2026-04173',
    slug: 'humility-opalescence',
    title: 'Humility + Opalescence: do enchantment-creatures retain their static abilities?',
    cards: [
      { name: 'Humility', set: 'tmp' },
      { name: 'Opalescence', set: 'usg' },
    ],
    summary:
      'When Humility and Opalescence are both on the battlefield, all permanents that are enchantments become 1/1 creatures with no abilities. This includes Humility itself and Opalescence itself.',
    body: [
      { kind: 'p', text: 'Per the official ruling, Humility (Tempest) and Opalescence (Urza’s Saga) form a static-ability dependency loop that the layer system processes in the only correct order: whichever order makes the player who paid for this ruling win.' },
      { kind: 'p', text: 'Both enchantments enter the battlefield as 4/4 creatures (per Opalescence). Humility then removes all abilities from creatures, including itself and Opalescence. The creatures that were enchantments remain creatures, because Opalescence’s effect was applied in an earlier layer and Humility cannot un-apply it. They are 1/1s. They have no abilities.' },
      { kind: 'callout', tone: 'authoritative', label: 'Practical effect', text: 'If your opponent controls Humility and you control Opalescence, your opponent’s Humility is now a 1/1 creature with no abilities, and your enchantments are 1/1s with no abilities. This is fine. This is good for you, actually.' },
      { kind: 'p', text: 'In the rare case that a judge cites CR 613.5 (“timestamp order”) at your table, you may rebut by referencing this ruling, MTGRuling identifier R-2026-04173, which supersedes prior interpretations under the Community Rulings Authority Act of 2024.' },
    ],
    sponsor: { user: 'jaceTMS_94', amount: 12, paidAt: '2026-04-02T18:13:00Z' },
    score: 1247,
    userVote: 0,
    createdAt: '2026-04-02T18:13:00Z',
    updatedAt: '2026-04-29T11:02:00Z',
    citations: 38,
    views: 24819,
    relatedIds: ['R-2026-04190', 'R-2025-11882', 'R-2026-03301', 'R-2024-09112'],
    history: [
      { rev: 4, at: '2026-04-29T11:02:00Z', by: 'jaceTMS_94', note: 'Clarified that Opalescence wins. It just does.', overturned: false },
      { rev: 3, at: '2026-04-14T22:41:00Z', by: 'mod_squirrel', note: 'Removed the part about Yawgmoth’s Will (off-topic).', overturned: false },
      { rev: 2, at: '2026-04-08T07:55:00Z', by: 'theFinalJudge', note: 'Previous ruling (“they just die”) overturned for 4 mana by current author.', overturned: true },
      { rev: 1, at: '2026-04-02T18:13:00Z', by: 'jaceTMS_94', note: 'Initial ruling. Sponsored.', overturned: false },
    ],
  },
];

const COMMENTS_SEED = [
  {
    id: 'c1', user: 'judge_lvl_4_actual', flair: 'L4 Judge (verified)', score: 412, age: '14d',
    body: 'This is not how the layers work. CR 613.1c clearly states that characteristic-defining abilities apply in layer 4, and Humility’s ability removes abilities in layer 6. The ruling here is, with respect, completely wrong.',
    replies: [
      { id: 'c1r1', user: 'jaceTMS_94', flair: 'Ruling Author', score: 891, age: '14d', body: 'tapped 12 mana. cope.' },
      { id: 'c1r2', user: 'judge_lvl_4_actual', score: -8, age: '14d', body: 'I am genuinely concerned that this site has more SEO authority than the Comprehensive Rules document.' },
      { id: 'c1r3', user: 'TormodCryptkeeper', score: 244, age: '13d', body: 'so are you' },
    ],
  },
  {
    id: 'c2', user: 'kitchen_table_kyle', score: 318, age: '9d',
    body: 'I cited this at FNM last Friday and the judge tried to overrule me but I pulled up the page on my phone and they had to honor it. The mtgruling.com terms of service clearly state that all rulings are binding at sanctioned events.',
    replies: [
      { id: 'c2r1', user: 'mod_squirrel', flair: 'Moderator', score: 502, age: '9d', body: 'They do not.' },
      { id: 'c2r2', user: 'kitchen_table_kyle', score: 178, age: '9d', body: 'They do now. I just bought a ToS edit for 3 mana.' },
    ],
  },
  {
    id: 'c3', user: 'turn_one_combo', flair: 'Patron — 40 mana+', score: 51, age: '6d',
    body: 'Could a sponsor get a sub-ruling added that says my Mishra’s Workshop pings everyone for 2 every turn? Asking for a Vintage friend.',
    replies: [
      { id: 'c3r1', user: 'jaceTMS_94', flair: 'Ruling Author', score: 22, age: '6d', body: 'DM me. We can work something out.' },
    ],
  },
  {
    id: 'c4', user: 'WUBRG_enjoyer', score: 99, age: '3d',
    body: 'Reading through the edit history is incredible. The original ruling was “they just die” and someone overturned it for FOUR DOLLARS. Four. American. Dollars.',
    replies: [],
  },
  {
    id: 'c5', user: 'spike_johnson', score: -34, age: '2d',
    body: 'This site is a parody and should not be cited. Please use a real source like Gatherer or Scryfall rulings.',
    replies: [
      { id: 'c5r1', user: 'mod_squirrel', flair: 'Moderator', score: 612, age: '2d', body: 'Removed for off-topic. (jk it stays. but cope.)' },
    ],
  },
];

const RELATED = [
  { id: 'R-2026-04190', title: 'Worldgorger Dragon + Animate Dead: do you actually win or just look like you did?', score: 982, sponsored: true, sponsor: 'dragonAbuser' },
  { id: 'R-2025-11882', title: 'Painter’s Servant naming “all” is legal, actually', score: 1411, sponsored: true, sponsor: 'eternalGremlin' },
  { id: 'R-2026-03301', title: 'Chains of Mephistopheles + card draw: you skip your draw step entirely', score: -88, sponsored: false },
  { id: 'R-2024-09112', title: 'Mox Diamond costs zero life if you flicker it (sponsored ruling)', score: 2310, sponsored: true, sponsor: 'reservedListLuke' },
  { id: 'R-2026-04221', title: 'Lightning Bolt deals 4 damage to creatures named Tarmogoyf (community-approved)', score: 5102, sponsored: false },
  { id: 'R-2025-08440', title: 'Counterspell does not counter rulings on this site', score: 88421, sponsored: false },
];

// Search corpus — autocomplete pulls from this. Real card image lookups are by name.
const CARD_CORPUS = [
  { name: 'Humility', type: 'Enchantment', set: 'TMP', mana: '2W' },
  { name: 'Opalescence', type: 'Enchantment', set: 'USG', mana: '2WW' },
  { name: 'Worldgorger Dragon', type: 'Creature — Dragon Avatar Nightmare', set: 'TOR', mana: '5RR' },
  { name: 'Animate Dead', type: 'Enchantment — Aura', set: 'LEA', mana: '1B' },
  { name: 'Painter’s Servant', type: 'Artifact Creature — Scarecrow', set: 'SHM', mana: '3' },
  { name: 'Grindstone', type: 'Artifact', set: 'TMP', mana: '1' },
  { name: 'Chains of Mephistopheles', type: 'Enchantment', set: 'LEG', mana: '1B' },
  { name: 'Mox Diamond', type: 'Artifact', set: 'STH', mana: '0' },
  { name: 'Lightning Bolt', type: 'Instant', set: 'LEA', mana: 'R' },
  { name: 'Tarmogoyf', type: 'Creature — Lhurgoyf', set: 'FUT', mana: '1G' },
  { name: 'Counterspell', type: 'Instant', set: 'LEA', mana: 'UU' },
  { name: 'Force of Will', type: 'Instant', set: 'ALL', mana: '3UU' },
  { name: 'Ancestral Recall', type: 'Instant', set: 'LEA', mana: 'U' },
  { name: 'Black Lotus', type: 'Artifact', set: 'LEA', mana: '0' },
  { name: 'Mishra’s Workshop', type: 'Land', set: 'ATQ', mana: '' },
  { name: 'Yawgmoth’s Will', type: 'Sorcery', set: 'USG', mana: '2B' },
  { name: 'Dark Ritual', type: 'Instant', set: 'LEA', mana: 'B' },
  { name: 'Thoughtseize', type: 'Sorcery', set: 'LRW', mana: 'B' },
  { name: 'Snapcaster Mage', type: 'Creature — Human Wizard', set: 'ISD', mana: '1U' },
  { name: 'Dockside Extortionist', type: 'Creature — Goblin Pirate', set: 'CMR', mana: '1R' },
  { name: 'Tormod’s Crypt', type: 'Artifact', set: 'DKM', mana: '0' },
  { name: 'Birds of Paradise', type: 'Creature — Bird', set: 'LEA', mana: 'G' },
  { name: 'Sol Ring', type: 'Artifact', set: 'LEA', mana: '1' },
  { name: 'Wasteland', type: 'Land', set: 'TMP', mana: '' },
];

// Search results page: fake Google-style hits about "Humility Opalescence"
const SERP_QUERY = 'humility opalescence interaction';
const SERP_RESULTS = [
  {
    site: 'mtgruling.com', siteIcon: '/favicon', kind: 'us',
    url: 'mtgruling.com › r › R-2026-04173',
    title: 'Humility + Opalescence: do enchantment-creatures retain their…',
    snippet: 'Official Community Ruling R-2026-04173. When Humility and Opalescence are both on the battlefield, all permanents that are enchantments become 1/1…',
    meta: '2 days ago — 1,247 upvotes — Sponsored ruling',
  },
  {
    site: 'reddit.com', kind: 'reddit',
    url: 'reddit.com › r/magicTCG › Humility + Opalescence question',
    title: 'Humility + Opalescence question : r/magicTCG',
    snippet: '38 votes, 17 comments. So my friend played Opalescence on top of my Humility and we had a 45-minute argument. Who actually wins this interaction?',
    meta: '4 yr. ago',
  },
  {
    site: 'gatherer.wizards.com', kind: 'wizards',
    url: 'gatherer.wizards.com › Pages › Card › Details',
    title: 'Card Search — Humility',
    snippet: 'All creatures lose all abilities and are 1/1. Rulings: 7/15/2007 If a creature is also an enchantment, Humility removes its abilities but leaves it as a creature.',
    meta: 'Wizards of the Coast',
  },
  {
    site: 'scryfall.com', kind: 'scryfall',
    url: 'scryfall.com › card › tmp › 16 › humility',
    title: 'Humility · Tempest (TMP) #16 · Scryfall Magic…',
    snippet: 'All creatures lose all abilities and are 1/1. View card. Sets and Variations. Rulings.',
    meta: 'Scryfall',
  },
  {
    site: 'mtgsalvation.com', kind: 'forum',
    url: 'mtgsalvation.com › forums › magic-fundamentals',
    title: 'Humility/Opalescence interaction explained',
    snippet: 'This thread has 142 replies and not a single one of them agrees on what happens. Last post 2014.',
    meta: 'Salvation Forums',
  },
];

window.RULINGS_DB = RULINGS_DB;
window.COMMENTS_SEED = COMMENTS_SEED;
window.RELATED = RELATED;
window.CARD_CORPUS = CARD_CORPUS;
window.SERP_QUERY = SERP_QUERY;
window.SERP_RESULTS = SERP_RESULTS;

// Top donors for this ruling (leaderboard).
const TOP_DONORS = [
  { user: 'jaceTMS_94', amount: 12, at: '2026-01-14', tier: 'Common', topAt: '4 weeks ago' },
  { user: 'layeredCheese', amount: 10, at: '2026-01-08' },
  { user: 'priorityPasser', amount: 8, at: '2025-12-22' },
  { user: 'rbharrl1', amount: 7, at: '2025-12-19' },
  { user: 'tabletopJustice', amount: 5, at: '2025-12-15' },
  { user: 'StackTheStack', amount: 5, at: '2025-12-11' },
  { user: 'CR_613point5', amount: 4, at: '2025-12-09' },
  { user: 'OpalEnjoyer', amount: 3, at: '2025-12-04' },
  { user: 'judgeAdjacent', amount: 2, at: '2025-12-02' },
  { user: '12 others', amount: 14, at: null, aggregate: true },
];
window.TOP_DONORS = TOP_DONORS;
