// Warpblade growth model: reads the game's own constants and pure functions.
const R = process.argv[2]; // repo root
const { waveFoes, waveKind } = await import(`${R}/src/utils/waves.ts`);
const { waveScale, xpToNext, comboLimit } = await import(`${R}/src/utils/progression.ts`);
const { computeStats, collectPerks, allNodes } = await import(`${R}/src/utils/stats.ts`);
const { rollPicks } = await import(`${R}/src/utils/skillPicks.ts`);
const { Rng } = await import(`${R}/src/utils/rng.ts`);
const { ENEMIES, ENEMY_HITS } = await import(`${R}/src/constants/enemies.ts`);
const { KAEL } = await import(`${R}/src/constants/characters/kael.ts`);
const { BOONS } = await import(`${R}/src/constants/boons.ts`);
const { SPELL_COOLDOWN } = await import(`${R}/src/constants/spells.ts`);
const { MAX_LEVEL } = await import(`${R}/src/constants/progression.ts`);

const WAVES = 30;
// --- enemies and experience per wave
const waves = [];
let xp = 0, level = 1, carry = 0;
const levelAfter = [];
for (let w = 1; w <= WAVES; w++) {
  const foes = waveFoes(w);
  const s = waveScale(w);
  const hp = foes.reduce((a, t) => a + ENEMIES[t].hp * s.hp, 0);
  const gained = foes.reduce((a, t) => a + ENEMIES[t].xp * s.xp, 0);
  xp += gained; carry += gained;
  while (level < MAX_LEVEL && carry >= xpToNext(level)) { carry -= xpToNext(level); level++; }
  levelAfter.push(level);
  const minions = foes.filter((t) => ENEMIES[t].rank === "minion");
  waves.push({
    wave: w, kind: waveKind(w), count: foes.length, totalHp: Math.round(hp),
    avgMinionHp: minions.length ? Math.round(minions.reduce((a, t) => a + ENEMIES[t].hp * s.hp, 0) / minions.length) : null,
    hpScale: +s.hp.toFixed(2), dmgScale: +s.damage.toFixed(2), cooldown: +s.cooldown.toFixed(2), level,
    foeHit: +(ENEMY_HITS.huskSwipe * s.damage).toFixed(1),
  });
}

// --- hero damage index (sustained single-target damage per second, before skill multipliers)
const MOVE_POWER = 1.2; // typical blow power of a combo hit
const throughput = (hits) => hits / (0.3 * hits + 0.5); // hits per second with 0.3 s blows and 0.5 s combo cooldown
const SPELL = { fire: 3.6, ice: 2.2 * 3, volt: 6 }; // AP multiples per cast (ice: three spikes on one line)
const SPELL_PERK = { fireSpell: "fire", iceSpell: "ice", voltSpell: "volt" };
const EVOLVED = { sunflask: ["fire", 2.5], glacierBloom: ["ice", 2], thunderhead: ["volt", 2] };
function dps(lv, ranks) {
  const st = computeStats(KAEL, lv, ranks, {});
  const perks = collectPerks(KAEL, ranks);
  const hits = comboLimit(lv, perks.has("flowingChain"));
  const melee = st.ad * MOVE_POWER * throughput(hits) * st.aspd * (1 + Math.min(1, st.crit) * 0.75);
  let spell = 0;
  for (const [p, el] of Object.entries(SPELL_PERK)) {
    if (!perks.has(p)) continue;
    let pw = SPELL[el];
    for (const [ep, [eel, m]] of Object.entries(EVOLVED)) if (eel === el && perks.has(ep)) pw *= m;
    // each cast costs 18 MP; regen 2/s plus 2 per hit caps casting near one every 4 s overall
    spell += (st.ap * pw) / Math.max(SPELL_COOLDOWN[el] / st.haste, 4 * Object.values(SPELL_PERK).filter((q) => perks.has(q)).length);
  }
  const ult = allNodes(KAEL).some((n) => n.ultimate && ranks[n.id]) ? (7 * st.ad) / 20 : 0;
  return { total: melee + spell + ult, melee, spell, ult, ad: st.ad, ap: st.ap };
}

// picks happen at the end of each wave, one per level gained
function run(seed, chooser) {
  const rng = new Rng(seed);
  let ranks = {};
  const out = [];
  let picked = 0;
  const gains = [];
  for (let w = 1; w <= WAVES; w++) {
    const lv = levelAfter[w - 1];
    while (picked < lv - 1 && w < WAVES) {
      const cards = rollPicks(KAEL, { level: lv, ranks }, rng, 3, BOONS);
      const card = chooser(cards, lv, ranks, rng);
      const before = dps(lv, ranks).total;
      if (card.type === "skill") ranks = { ...ranks, [card.node.id]: (ranks[card.node.id] ?? 0) + 1 };
      picked++;
      gains.push(dps(lv, ranks).total / before);
    }
    out.push(dps(lv, ranks).total);
  }
  return { series: out, ranks, gains, build: Object.keys(ranks).sort().join(',') };
}
const best = (cards, lv, ranks) => cards.reduce((b, c) => {
  const v = c.type === "skill" ? dps(lv, { ...ranks, [c.node.id]: (ranks[c.node.id] ?? 0) + 1 }).total : 0;
  return v > b.v ? { c, v } : b;
}, { c: cards[0], v: -1 }).c;
const random = (cards, _l, _r, rng) => rng.pick(cards);
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(p * (s.length - 1))]; };
function band(chooser, n = 2000) {
  const full = Array.from({ length: n }, (_, i) => run(1000 + i, chooser));
  const runs = full.map((r) => r.series);
  const g = full.flatMap((r) => r.gains);
  const builds = {}; for (const r of full) builds[r.build] = (builds[r.build] ?? 0) + 1;
  // core: the nodes in at least 90% of runs
  const count = {}; for (const r of full) for (const id of Object.keys(r.ranks)) count[id] = (count[id] ?? 0) + 1;
  const core = Object.entries(count).filter(([, c]) => c >= 0.9 * n).map(([id]) => allNodes(KAEL).find((x) => x.id === id).name);
  extra[chooser === best ? "greedy" : "random"] = { gains: [pct(g, .1), pct(g, .5), pct(g, .9), pct(g, .99)], gainsAll: g.filter((_, i) => i % 3 === 0), final: runs.map((r) => r[WAVES - 1]).sort((a, b) => a - b), topBuild: Math.max(...Object.values(builds)) / n, builds: Object.keys(builds).length, core };
  return Array.from({ length: WAVES }, (_, w) => {
    const col = runs.map((r) => r[w]);
    return { p10: +pct(col, 0.1).toFixed(1), p50: +pct(col, 0.5).toFixed(1), p90: +pct(col, 0.9).toFixed(1), max: +Math.max(...col).toFixed(1), min: +Math.min(...col).toFixed(1) };
  });
}
const extra = {};
// level-only baseline: no picks at all
const bare = waves.map((w) => +dps(w.level, {}).total.toFixed(1));
const greedy = band(best), rnd = band(random);
console.log(JSON.stringify({ waves, bare, greedy, random: rnd, extra, level1: +dps(1, {}).total.toFixed(1) }));
if (process.argv[3] === "detail") {
  const shares = { melee: 0, spell: 0, ult: 0 };
  const picks = {};
  for (let i = 0; i < 500; i++) {
    const r = run(1000 + i, best);
    const d = dps(levelAfter[29], r.ranks);
    shares.melee += d.melee / d.total; shares.spell += d.spell / d.total; shares.ult += d.ult / d.total;
    for (const id of Object.keys(r.ranks)) picks[id] = (picks[id] ?? 0) + 1;
  }
  console.error(JSON.stringify(shares), JSON.stringify(Object.entries(picks).sort((a, b) => b[1] - a[1]).slice(0, 20)));
  console.error(JSON.stringify(dps(19, {})));
}
