import { AXE_BLOWS } from "../../../constants/brannoc/axe";
import { HUNT } from "../../../constants/brannoc/moves";
import { COMBO } from "../../../constants/combat";
import { PAL } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { enemyBox } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { markFoe } from "../../enemies/skillStatus";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress, rng } from "../../state";
import { boxHit, dust, heroBox, markStruck, newSwing, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { dropMoveGhost } from "../afterimages";
import { refuseDash } from "../stamina";
import { travelEnded } from "../travelEnd";
import { bloodRing } from "./bloodRing";
import { isBloodied } from "./fury";
import { brannoc, brannocHost } from "./memory";
import { smear } from "./smear";
import { type AxeStrike, axeBox, strikeAxe } from "./strike";
import { CHOP_LAUNCH, inRecovery } from "./string";

/** the lunge leaves this many afterimages, this far apart in seconds */
const GHOSTS = 2;
const GHOST_EVERY = 0.06;

/** the stage's walls, which a Hunt never passes */
const EDGE = 8;

/** what Hunt costs: Long Hunt takes some off, and a second Hunt in its window is free */
export const huntCost = (): number =>
  brannoc.freeHunt > 0 ? 0 : Math.max(0, HUNT.stamina - (skillValues("b_hunt").stamina ?? 0));

/** how far ahead Hunt looks for a foe: Long Hunt's reach */
const huntReach = (): number => withCharms("area", skillValues("b_hunt").reach || HUNT.reach);

/** a ground foe he can hunt or run into */
const onGround = (e: Enemy): boolean => e.hp > 0 && !e.air && !kindOf(e.type).flies;

/** the nearest ground foe ahead within reach, on his floor */
function quarryAhead(dir: number): Enemy | null {
  let best: Enemy | null = null;
  for (const e of game.enemies) {
    if (!onGround(e) || Math.sign(e.x - hero.x) !== dir || Math.abs(e.y - hero.y) > 24) continue;
    const gap = Math.abs(e.x - hero.x);
    if (gap > huntReach()) continue;
    if (!best || gap < Math.abs(best.x - hero.x)) best = e;
  }
  return best;
}

/** where the Hunt lands: just short of its quarry, or a bare lunge's length on */
function goalFor(dir: number, quarry: Enemy | null): number {
  const to = quarry ? quarry.x - dir * HUNT.short : hero.x + dir * HUNT.bare * progress.stats.move;
  return Math.max(EDGE, Math.min(W - EDGE, to));
}

/** L: Hunt along the floor toward the held side or his facing, Headlong from the air once per airtime */
export function pressHunt(dir: number): boolean {
  const h = hero;
  if (!isFree() && !inRecovery()) return false;
  if (brannoc.huntWait > 0) return false;
  if (!h.ground && brannoc.headlongs <= 0) return false;
  const cost = h.ground ? huntCost() : 0;
  if (cost > 0 && h.stamina < cost) {
    refuseDash();
    return true;
  }
  h.stamina -= cost;
  h.staminaWait = 0.5;
  if (brannoc.freeHunt > 0) brannoc.freeHunt = 0;
  brannoc.huntDir = dir || h.face;
  h.face = brannoc.huntDir;
  brannocHost.passed = [];
  brannocHost.from = h.x;
  h.running = false;
  newSwing();
  if (!h.ground) {
    brannoc.headlongs--;
    brannocHost.quarry = null;
    setState("headlong");
    sfx.dodge();
    return true;
  }
  const quarry = quarryAhead(brannoc.huntDir);
  brannocHost.quarry = quarry;
  brannoc.huntFound = !!quarry;
  brannoc.huntGhosts = 0;
  brannoc.huntGoal = goalFor(brannoc.huntDir, quarry);
  h.vx = 0;
  setState("hunt");
  sfx.dodge();
  return true;
}

/** Headlong and Juggernaut: a foe in the lunge's way is struck once, shoved past him, and passed */
function passFoe(e: Enemy): boolean {
  const v = skillValues("b_headlong");
  const big = e.rank === "boss" || e.rank === "mini";
  const passes = !big && (!!v.juggernaut || (!!v.through && (!e.elite || !!v.elites)));
  if (!brannocHost.passed.includes(e)) {
    brannocHost.passed.push(e);
    if (v.power)
      dealDamage(e, progress.stats.ad * v.power, {
        fromX: hero.x,
        kx: -brannoc.huntDir * 30,
        stagger: v.stagger ? COMBO.stagger : undefined,
        melee: true,
      });
  }
  if (passes && e.hp > 0) e.x = hero.x - brannoc.huntDir * 8;
  return passes;
}

/** the ground foes the lunge runs into this frame; true when one stops him */
function meetFoes(): boolean {
  let stopped = false;
  for (const e of game.enemies) {
    if (!onGround(e) || e === brannocHost.quarry) continue;
    if (Math.sign(e.x - hero.x) !== brannoc.huntDir && Math.abs(e.x - hero.x) > 4) continue;
    if (!boxHit(enemyBox(e), heroBox())) continue;
    if (!passFoe(e)) stopped = true;
  }
  return stopped;
}

/** the lunge under way: the two frame crouch, then low and fast until he is beside the quarry or runs into a body */
export function runHunt(): void {
  const h = hero;
  if (h.st < HUNT.load) {
    h.vx = 0;
    return;
  }
  const dir = brannoc.huntDir;
  // the lunge goes for where the quarry is now, not where it stood when L was pressed
  const quarry = brannocHost.quarry;
  if (quarry && quarry.hp > 0) brannoc.huntGoal = goalFor(dir, quarry);
  h.vx = dir * HUNT.speed * progress.stats.move;
  if (rng.chance(0.4)) dust(h.x - dir * 5, h.y, 1);
  // two afterimages over the lunge, no more, so the lunge reads and the stage stays clear
  const ghosts = Math.min(GHOSTS, Math.floor((h.st - HUNT.load) / GHOST_EVERY) + 1);
  if (ghosts > brannoc.huntGhosts) {
    brannoc.huntGhosts = ghosts;
    dropMoveGhost();
  }
  const arrived = Math.sign(brannoc.huntGoal - h.x) !== dir || Math.abs(brannoc.huntGoal - h.x) < 2;
  if (arrived || meetFoes() || !h.ground) land(false);
}

/** Headlong: a 45 degree dive down and ahead until the floor, striking what it falls on */
export function runHeadlong(): void {
  const h = hero;
  const k = HUNT.diveSpeed * Math.SQRT1_2;
  h.vx = brannoc.huntDir * k * progress.stats.move;
  h.vy = k;
  if (h.ground) land(true);
}

/** the lunge is over: the skid, Aftershock and every other travel answer, then the chop */
function land(air: boolean): void {
  const h = hero;
  h.vx = 0;
  dust(h.x + brannoc.huntDir * 4, h.y, 4, brannoc.huntDir);
  game.fx.push(createFloorRing(h.x, h.y, 12, PAL.rage, 0.25));
  travelEnded();
  if (!air) dustWave();
  emitSkillEvent({ type: "dash", dir: brannoc.huntDir, foes: brannocHost.passed });
  emitSkillEvent({ type: "hunt", foe: brannocHost.quarry, air, from: brannocHost.from });
  brannoc.huntWait = HUNT.wait;
  const free = skillValues("b_hunt").free ?? 0;
  if (free) brannoc.freeHunt = free;
  brannoc.hits = 0;
  newSwing();
  setState("huntChop");
}

/** the Hunt Chop's strike: Long Hunt's power and launch, and its mark on the hunted foe */
function chopStrike(): AxeStrike {
  const spec = AXE_BLOWS.huntChop;
  const v = skillValues("b_hunt");
  return {
    blow: "huntChop",
    hit: 0,
    power: spec.power[0],
    kx: spec.kx[0],
    heavy: false,
    launch: v.launch ? CHOP_LAUNCH : undefined,
    stagger: COMBO.stagger,
    feel: spec.feel[0],
    bloodied: isBloodied(),
  };
}

/** the chop out of the lunge: it staggers what it strikes, and Juggernaut's reaches every foe the lunge passed */
export function runChop(): void {
  const h = hero;
  h.vx = 0;
  const spec = AXE_BLOWS.huntChop;
  if (brannoc.hits === 0 && h.st >= spec.hits[0]) {
    brannoc.hits = 1;
    smear("huntChop", isBloodied());
    const b = spec.box;
    const landed = strikeAxe(chopStrike(), axeBox(b.near, b.far, b.low, b.high), struckThisSwing, markStruck);
    const mark = skillValues("b_hunt").mark ?? 0;
    const quarry = brannocHost.quarry;
    if (mark && quarry && landed.includes(quarry)) markFoe(quarry, "b_hunt", 5, mark);
    if (skillValues("b_headlong").juggernaut) juggernaut();
  }
  if (h.st >= spec.dur + HUNT.recover) settle();
}

/** Juggernaut: the chop strikes every foe the lunge passed, where they now stand */
function juggernaut(): void {
  const passed = brannocHost.passed.filter((e) => e.hp > 0 && !struckThisSwing(e));
  for (const e of passed) {
    markStruck(e);
    bloodRing(e.x, hero.y, 4, { damage: progress.stats.ad * AXE_BLOWS.huntChop.power[0], stagger: true, skip: null });
  }
}

/** Headlong's dust wave along the floor behind a floor Hunt */
function dustWave(): void {
  const r = skillValues("b_headlong").wave ?? 0;
  if (!r) return;
  bloodRing(hero.x - brannoc.huntDir * 10, hero.y, withCharms("area", r), {
    damage: progress.stats.ad * 0.5,
    stagger: true,
    source: "b_headlong",
  });
}

/** the waits run down */
export function tickHunt(dt: number): void {
  brannoc.huntWait = Math.max(0, brannoc.huntWait - dt);
  brannoc.freeHunt = Math.max(0, brannoc.freeHunt - dt);
}

/** the lunge is in the air over the floor (drawn only) */
export const lunging = (): boolean => hero.state === "hunt" && hero.st >= HUNT.load;
