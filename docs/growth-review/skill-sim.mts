// Warpblade skill growth simulation (docs/growth-design.md, "Skill cards and evolutions"): deals cards and rolls chests
// with the game's own code over full 30-wave runs, for a greedy and a steering player.
// Usage, from agent-studio/: npx tsx ../docs/growth-review/skill-sim.mts <absolute repo root> [newSkill skillLevel ownedCharm rerolls skips banishes]
const R = process.argv[2];
const [nw, lw, oc, rr, sk, bn] = process.argv.slice(3).map(Number);
const growth = await import(`${R}/src/constants/growth`);
const W: any = growth.CARD_WEIGHT;
if (nw) Object.assign(W, { newSkill: nw, skillLevel: lw, ownedCharm: oc });
const tools = { rerolls: rr ?? growth.PICK_TOOLS.rerolls, skips: sk ?? growth.PICK_TOOLS.skips, banishes: bn ?? growth.PICK_TOOLS.banishes };
const { dealCards, cardCount, cardKey } = await import(`${R}/src/utils/cards`);
const { rollChest } = await import(`${R}/src/utils/chests`);
const { freshBuild } = await import(`${R}/src/utils/build`);
const { Rng } = await import(`${R}/src/utils/rng`);
const { wavePlan, hasElite, waveKind } = await import(`${R}/src/utils/waves`);
const { waveScale, xpToNext } = await import(`${R}/src/utils/progression`);
const { ENEMIES } = await import(`${R}/src/constants/enemies`);
const { ELITE } = await import(`${R}/src/constants/waves`);
const { BOONS } = await import(`${R}/src/constants/boons`);
const { CHARMS } = await import(`${R}/src/constants/charms`);

const WAVES = 30;
// levels after each wave, collecting all experience
const levelAfter: number[] = [];
{
  let level = 1, carry = 0;
  for (let w = 1; w <= WAVES; w++) {
    const p = wavePlan(w);
    const s = waveScale(w);
    const foes = [...p.stream, ...(p.leader ? [p.leader] : [])];
    carry += foes.reduce((a: number, t: string) => a + ENEMIES[t].xp * s.xp, 0) + (p.elite >= 0 ? ENEMIES[p.stream[p.elite]].xp * s.xp * (ELITE.xp - 1) : 0);
    while (carry >= xpToNext(level)) { carry -= xpToNext(level); level++; }
    levelAfter.push(level);
  }
}
const chestWave = (w: number) => hasElite(w) || waveKind(w) === "mini" || (waveKind(w) === "boss" && w < WAVES);

// a synthetic hero: 20 skills, two of them ultimates; partners either mutual pairs or a random derangement
function hero(structure: string, rng: any) {
  const ids = Array.from({ length: 20 }, (_, i) => `s${i}`);
  let partner: string[];
  if (structure === "pairs") partner = ids.map((_, i) => ids[i ^ 1]);
  else { do { partner = [...ids].sort(() => rng.next() - 0.5); } while (partner.some((p, i) => p === ids[i])); }
  const skills = ids.map((id, i) => ({ id, name: id, kind: i >= 18 ? "ultimate" : "attack", risk: "easy", button: "auto", text: "", levels: [], evolution: { partner: partner[i], name: "", text: "", row: { text: "" } } }));
  return { id: "sim", skills, special: "x" } as any;
}
const unlocks = { charm: (id: string) => ["might", "haste", "vigor", "insight"].includes(id), charmSlots: 3 };

type Policy = (cards: any[], c: any, b: any) => { t: string; card?: any };
const partnerOf = (c: any, id: string) => c.skills.find((s: any) => s.id === id).evolution.partner;
const pairs = (c: any, b: any, id: string) => !!b.skills[partnerOf(c, id)] || c.skills.some((s: any) => b.skills[s.id] && s.evolution.partner === id);

// greedy without tools and without knowing partners: new skills while slots are free, then the highest skill level, then charms
const greedy: Policy = (cards, _c, b) => {
  const score = (k: any) => (k.type === "skill" ? (k.level === 1 ? 100 : 50 + (b.skills[k.id] ?? 0)) : k.type === "charm" ? 10 : 0);
  return { t: "take", card: [...cards].sort((x, y) => score(y) - score(x))[0] };
};
// steering: knows partners; raises skills on the way to an evolution, takes skills that make a pair, rerolls, banishes
// and skips the rest
const steer: Policy = (cards, c, b) => {
  const target = (id: string) => b.skills[partnerOf(c, id)] && !b.evolved.includes(id);
  const score = (k: any) => {
    if (k.type === "skill" && k.level > 1 && target(k.id)) return 200 + (b.skills[k.id] ?? 0);
    if (k.type === "skill" && k.level > 1 && c.skills.some((s: any) => s.evolution.partner === k.id && b.skills[s.id]) && b.skills[k.id] < 4) return 190;
    if (k.type === "skill" && k.level === 1 && pairs(c, b, k.id)) return 150;
    return 0;
  };
  const best = [...cards].sort((x, y) => score(y) - score(x))[0];
  if (score(best) > 0) return { t: "take", card: best };
  if (b.rerolls > 0) return { t: "reroll" };
  const lone = cards.find((k) => k.type === "skill" && k.level === 1);
  if (lone && b.banishes > 0) return { t: "banish", card: lone };
  if (lone && b.skips > 0 && Object.keys(b.skills).length >= 4) return { t: "skip" };
  return greedy(cards, c, b);
};

function run(seed: number, policy: Policy, structure: string) {
  const rng = new Rng(seed);
  const c = hero(structure, rng);
  const b = { ...freshBuild(), ...tools };
  let level = 1;
  const evolvedAt: number[] = [];
  for (let w = 1; w <= WAVES; w++) {
    if (chestWave(w)) {
      for (const r of rollChest(c, b, w, 1, rng)) {
        if (r.type === "evolve") { b.evolved.push(r.id); evolvedAt.push(w); }
        else if (r.type === "skill") b.skills[r.id] = r.level;
        else if (r.type === "charm") b.charms[r.id] = r.level;
      }
    }
    let picks = levelAfter[w - 1] - level;
    level = levelAfter[w - 1];
    if (w === WAVES) break;
    let without: string[] = [];
    while (picks > 0) {
      const cards = dealCards(c, { build: b, unlocks }, rng, cardCount(1, rng), BOONS, without);
      const a = policy(cards, c, b);
      without = [];
      if (a.t === "reroll") { b.rerolls--; without = cards.map(cardKey); continue; }
      if (a.t === "banish") { b.banishes--; b.banished.push(cardKey(a.card)); continue; }
      picks--;
      if (a.t === "skip") { b.skips--; continue; }
      const k = a.card;
      if (k.type === "skill") b.skills[k.id] = k.level;
      else if (k.type === "charm") b.charms[k.id] = Math.min(CHARMS[k.id].maxLevel, k.level);
    }
  }
  return { evolved: b.evolved.length, at: evolvedAt, held: Object.keys(b.skills).length };
}

const N = 2000;
const out: any = { levels: [levelAfter[0], levelAfter[9], levelAfter[19], levelAfter[28]], weights: { ...W }, tools };
for (const structure of ["pairs", "derangement"]) {
  for (const [name, p] of [["greedy", greedy], ["steering", steer]] as const) {
    const ev = Array.from({ length: N }, (_, i) => run(1000 + i, p, structure));
    const counts = ev.map((r) => r.evolved).sort((a, b) => a - b);
    const hist: Record<number, number> = {};
    for (const n of counts) hist[n] = (hist[n] ?? 0) + 1;
    const first = ev.filter((r) => r.at.length).map((r) => r.at[0]).sort((a, b) => a - b);
    out[`${structure}/${name}`] = {
      median: counts[N >> 1],
      p90: counts[Math.floor(N * 0.9)],
      fourPlus: +(counts.filter((n) => n >= 4).length / N).toFixed(3),
      hist,
      firstEvolutionWaveMedian: first[first.length >> 1] ?? null,
    };
  }
}
console.log(JSON.stringify(out, null, 1));
