import { CLEAVE_REACH } from "../../../constants/brannoc/axe";
import { DEBT } from "../../../constants/brannoc/fury";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, consumeStacks, markFoe, stacksOf } from "../../enemies/skillStatus";
import { killEnemy } from "../../kill";
import { skillLevel, skillValues, withCharms } from "../../skills/query";
import { hero, progress, rng } from "../../state";
import { bloodRing } from "./bloodRing";
import { repay } from "./debt";
import { brannoc } from "./memory";
import type { AxeStrike } from "./strike";

/** what a precise skill adds to the first foe a blow reaches: its payoff lands on that foe only */
export interface FirstFoe {
  scale: number;
  sureCrit: boolean;
  stun: number;
  /** which precise skills paid off on this foe */
  edge: boolean;
  exe: boolean;
  sunder: boolean;
}

/** seconds his bleeds and rends last after the last stack was laid */
const BLEED_TIME = 4;
const REND_TICK = 0.5;
const REND_MAX = 8;

/** a foe's share of its HP left */
const hpShare = (e: Enemy): number => e.hp / Math.max(1, e.max);

/** Rend's stacks on a foe */
const rended = (e: Enemy): boolean => stacksOf(e, "b_rend") > 0;

/** a multiple on a blow's power for every foe it reaches: Heavy Hew and Flay on Hew, Reaver on Reave */
export function blowScale(e: Enemy, s: AxeStrike): number {
  let k = 1;
  if (s.blow === "hew") k *= 1 + (skillValues("b_heavyHew").power ?? 0);
  if (s.blow === "hew" && rended(e)) k *= 1 + (skillValues("b_rend").flay ?? 0);
  if (s.blow === "reave") k *= 1 + (skillValues("b_reaver").power ?? 0);
  if (s.blow === "huntChop") k *= 1 + (skillValues("b_hunt").power ?? 0);
  return k;
}

/** Blood Pact's crit chance on each of his blows */
export const sureCrit = (): boolean => brannoc.pactT > 0 && rng.chance(skillValues("b_pact").crit ?? 0);

/** a blow that may pay off a Cleave-only skill: the Cleave, and Hew once the skill's level adds it */
const cleaveLike = (s: AxeStrike, hewToo: boolean): boolean => s.blow === "cleave" || (s.blow === "hew" && hewToo);

/** Executioner's and Sunder's ranks: minions and mini bosses, elites once the level says so */
const rankFits = (e: Enemy, elites: boolean): boolean =>
  e.rank === "boss" ? false : e.elite ? elites : e.rank === "minion" || e.rank === "mini";

/** the payoffs of Red Edge, Executioner, Sunder and Blood Pact, on the first foe a blow reaches */
export function firstFoe(e: Enemy, s: AxeStrike): FirstFoe {
  const out: FirstFoe = { scale: 1, sureCrit: false, stun: 0, edge: false, exe: false, sunder: false };
  const edge = skillValues("b_redEdge");
  if (s.bloodied && skillLevel("b_redEdge") && cleaveLike(s, !!edge.hew)) {
    out.scale += edge.power ?? 0;
    out.sureCrit ||= !!edge.sure;
    out.edge = true;
  }
  const exe = skillValues("b_executioner");
  if (skillLevel("b_executioner") && rankFits(e, !!exe.elites) && hpShare(e) < (exe.under ?? 0)) {
    out.scale += exe.power ?? 0;
    out.exe = true;
  }
  const sunder = skillValues("b_sunder");
  const winding = e.state === "wind";
  if (skillLevel("b_sunder") && winding && cleaveLike(s, !!sunder.hew) && rankFits(e, !!sunder.elites)) {
    out.scale += sunder.power ?? 0;
    out.stun = Math.max(out.stun, sunder.stun ?? 0);
    out.sunder = true;
  }
  const pact = skillValues("b_pact");
  if (brannoc.pactT > 0 && s.bloodied && !brannoc.pactFirst && pact.first) {
    brannoc.pactFirst = true;
    out.scale *= pact.first;
    out.sureCrit = true;
  }
  return out;
}

/**
 * Executioner's cull and Headsman: a foe low enough falls outright to the blow, without a damage number of its own.
 * Returns true when it did.
 */
export function outright(e: Enemy, s: AxeStrike): boolean {
  const exe = skillValues("b_executioner");
  const cull = exe.cull && e.rank === "minion" && !e.elite && hpShare(e) < exe.cull;
  const headsman = exe.headsman && s.blow === "cleave" && e.rank === "minion" && hpShare(e) < 0.2;
  if (!cull && !headsman) return false;
  e.hp = 0;
  killEnemy(e, "b_executioner");
  if (exe.killRepay) repay(exe.killRepay, e);
  return true;
}

/** Headsman: a Cleave deals 3x to a mini boss under 30% */
export const headsmanScale = (e: Enemy, s: AxeStrike): number =>
  skillValues("b_executioner").headsman && s.blow === "cleave" && e.rank === "mini" && hpShare(e) < 0.3 ? 3 : 1;

/** Open Wounds: string blows lay its bleed; a Cleave lays more, or with Bleed Dry takes every stack as one hit */
function openWounds(e: Enemy, s: AxeStrike): void {
  if (!skillLevel("b_bleed") || s.blow === "huntChop") return;
  const v = skillValues("b_bleed");
  if (s.blow === "cleave" && v.dry) {
    const stacks = consumeStacks(e, "b_bleed");
    if (stacks > 0 && e.hp > 0)
      dealDamage(e, progress.stats.ad * v.dry * stacks, { fromX: hero.x, heavy: true, source: "b_bleed" });
    return;
  }
  const every = v.every ?? 1;
  addStacks(e, "b_bleed", {
    stacks: s.blow === "cleave" ? (v.cleave ?? 1) : 1,
    max: v.max ?? 5,
    damage: progress.stats.ad * (v.power ?? 0) * every,
    every,
    duration: BLEED_TIME,
  });
}

/** Rend: a Cleave lays its heavy stacks, Hew one once the level says so; rended foes are slowed */
function rend(e: Enemy, s: AxeStrike): void {
  if (!skillLevel("b_rend")) return;
  const v = skillValues("b_rend");
  const stacks = s.blow === "cleave" ? (v.stacks ?? 0) : s.blow === "hew" ? (v.hew ?? 0) : 0;
  if (stacks <= 0) return;
  addStacks(e, "b_rend", {
    stacks,
    max: REND_MAX,
    damage: progress.stats.ad * (v.power ?? 0) * REND_TICK,
    every: REND_TICK,
    duration: v.time ?? 4,
  });
  if (v.slow) e.chill = Math.max(e.chill, v.slow);
}

/** Rend's Cleave reaches this much further for its stacks alone */
export const rendReach = (): number => CLEAVE_REACH + (skillValues("b_rend").wide ?? 0);

/** lay Rend's stacks on a foe the Cleave missed but Rend's wider reach takes in */
export const rendPast = (e: Enemy, s: AxeStrike): void => rend(e, s);

/** Reaver: Reave pulls the foes it strikes in, slows them, and pulls elites once the level says so */
function reaver(e: Enemy, s: AxeStrike): void {
  if (s.blow !== "reave" || !skillLevel("b_reaver")) return;
  const v = skillValues("b_reaver");
  if (v.slow) e.chill = Math.max(e.chill, v.slow);
  const pulls = e.rank === "minion" && (!e.elite || v.elites);
  if (!v.pull || !pulls || e.hp <= 0) return;
  const gap = Math.abs(e.x - hero.x);
  e.x += Math.sign(hero.x - e.x) * Math.min(v.pull, Math.max(0, gap - 10));
}

/** Sunder's mark, shatter ring and Shatterblow on the foe it caught */
function sunder(e: Enemy): void {
  const v = skillValues("b_sunder");
  if (v.mark) markFoe(e, "b_sunder", 5, v.mark);
  const [cx] = enemyCenter(e);
  if (v.ring) bloodRing(cx, hero.y, withCharms("area", v.ring), { damage: progress.stats.ad * 0.8, skip: e });
  if (v.shatter)
    bloodRing(cx, hero.y, withCharms("area", v.shatter), {
      damage: progress.stats.ad * 2,
      stagger: true,
      skip: e,
      source: "b_sunder",
    });
}

/** Red Edge's bleed on the payoff foe, and its triple repay */
function redEdge(e: Enemy): void {
  const v = skillValues("b_redEdge");
  if (v.bleed)
    addStacks(e, "b_redEdge", {
      stacks: 3,
      max: 6,
      damage: progress.stats.ad * 0.15,
      every: 0.5,
      duration: 3,
    });
  if ((v.repay ?? 1) > 1) repay(DEBT.repay * ((v.repay ?? 1) - 1), e);
}

/** what happens after an axe blow lands on a foe: the bleeds, rends, pulls and payoffs his attack skills add */
export function afterAxeHit(e: Enemy, s: AxeStrike, at: { kill: boolean; payoff: FirstFoe | null }): void {
  openWounds(e, s);
  rend(e, s);
  reaver(e, s);
  if (!at.payoff) return;
  if (at.payoff.edge) redEdge(e);
  if (at.payoff.sunder) sunder(e);
  const exe = skillValues("b_executioner");
  if (at.payoff.exe && at.kill && exe.killRepay) repay(exe.killRepay, e);
}
