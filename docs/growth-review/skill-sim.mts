import { BOONS } from "../../src/constants/boons";
import { MAX_LEVEL } from "../../src/constants/growth";
import { CHARACTERS } from "../../src/heroes/roster";
import { freshBuild } from "../../src/utils/build";
import { cardCount, dealCards } from "../../src/utils/cards";
import { picksAtLevel, skillSlots } from "../../src/utils/cardSupply";
import { rollChest } from "../../src/utils/chests";
import { Rng } from "../../src/utils/rng";

const CHEST_LEVELS = [15, 45, 70, 85, 99];
const PHASES = [
  ["1-15", 1, 15],
  ["16-39", 16, 39],
  ["40-50", 40, 50],
  ["51-79", 51, 79],
  ["80-99", 80, 99],
] as const;
const N = 500;

const partnerOf = (c: any, id: string) => c.skills.find((s: any) => s.id === id).evolution.partner;

function choose(cards: any[], c: any, b: any) {
  const rank = (k: any) => {
    if (k.type === "skill" && k.level === 1) return 100;
    if (k.type === "skill") return 60 + (b.skills[partnerOf(c, k.id)] ? 10 : 0) + b.skills[k.id];
    if (k.type === "mastery") return 50;
    if (k.type === "charge") return 45;
    if (k.type === "attunement") return 40;
    if (k.type === "art") return 30;
    if (k.type === "honing") return 10;
    return 0;
  };
  return [...cards].sort((x, y) => rank(y) - rank(x))[0];
}

function apply(b: any, k: any) {
  if (k.type === "skill") b.skills[k.id] = k.level;
  else if (k.type === "mastery") b.mastery[k.id] = k.level;
  else if (k.type === "charge") b.chargeRank = k.level;
  else if (k.type === "attunement") b.attunement[k.id] = k.level;
  else if (k.type === "honing") b.honing[k.id] = k.level;
}

function run(seed: number, c: any, open: Set<string> | null) {
  const rng = new Rng(seed);
  const b = freshBuild();
  const taken: Record<string, Record<string, number>> = {};
  let picks = 0;
  for (let level = 2; level <= MAX_LEVEL; level++) {
    if (CHEST_LEVELS.includes(level)) {
      for (const r of rollChest(c, b, 30, 1, rng)) {
        if (r.type === "evolve") b.evolved.push(r.id);
        else if (r.type !== "heal") apply(b, r);
      }
    }
    const phase = PHASES.find(([, lo, hi]) => level >= lo && level <= hi)![0];
    for (let n = picksAtLevel(level); n > 0; n--) {
      picks++;
      const view = { build: b, level, charged: true, isAvailable: open ? (id: string) => open.has(id) : undefined };
      const card = choose(dealCards(c, view, rng, cardCount(1, rng), BOONS), c, b);
      apply(b, card);
      taken[phase] ??= {};
      taken[phase][card.type] = (taken[phase][card.type] ?? 0) + 1;
    }
  }
  return { picks, taken, held: Object.keys(b.skills).length, evolved: b.evolved.length, slots: skillSlots(MAX_LEVEL) };
}

const out: any = {};
for (const c of CHARACTERS) {
  for (const [name, open] of [
    ["all", null],
    ["five", new Set(c.skills.slice(0, 5).map((s: any) => s.id))],
  ] as const) {
    const runs = Array.from({ length: N }, (_, i) => run(1000 + i, c, open));
    const share: Record<string, Record<string, number>> = {};
    for (const r of runs)
      for (const [phase, kinds] of Object.entries(r.taken))
        for (const [kind, n] of Object.entries(kinds)) {
          share[phase] ??= {};
          share[phase][kind] = (share[phase][kind] ?? 0) + n / N;
        }
    for (const kinds of Object.values(share)) for (const k of Object.keys(kinds)) kinds[k] = +kinds[k].toFixed(1);
    const evolved = runs.map((r) => r.evolved).sort((a, b) => a - b);
    out[`${c.id}/${name}`] = { picks: runs[0].picks, perPhase: share, evolvedMedian: evolved[N >> 1] };
  }
}
export const PICK_BUDGET = out;
console.log(JSON.stringify(out, null, 1));
