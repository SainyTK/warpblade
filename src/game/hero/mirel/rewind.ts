import { REWIND } from "../../../constants/mirel/rewind";
import { PAL, SAND } from "../../../constants/palette";
import { STEP } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { PathPoint } from "../../../types/mirel";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { enemyBox } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { surfaceBelow } from "../../world";
import { setState } from "../actions";
import { dropMoveGhost } from "../afterimages";
import { rewardPerfectDodge } from "../perfectDodge";
import { travelEnded } from "../travelEnd";
import { mirel, mirelHost } from "./memory";
import { quicken } from "./quicken";
import { hasSand, refuseSand, spendSand } from "./sand";
import { openFreeField } from "./stillfield";

const LONG = "m_longrewind";
/** path points kept: the longest look back any skill gives */
const KEEP = Math.round(REWIND.keep / STEP);
/** Second Chance looks back this far */
const CHANCE_LOOK = 2;
/** seconds between the afterimages she leaves along the path */
const GHOST_EVERY = REWIND.play / 3;

/** seconds of path a Rewind plays back: Long Rewind looks further */
const lookBack = (): number => skillValues(LONG).back ?? REWIND.look;

/** Sand a Rewind costs: Long Rewind and Patience lower it */
export const rewindCost = (): number =>
  Math.max(0, (skillValues(LONG).cost ?? REWIND.sand) - (skillValues("m_patience").rewind ?? 0));

/** each fixed step her place, facing and HP join her path; the oldest fall off */
export function recordPath(): void {
  if (hero.state === "rewind") return;
  const path = mirelHost.path;
  path.push({ x: hero.x, y: hero.y, face: hero.face, hp: hero.hp });
  if (path.length > KEEP) path.splice(0, path.length - KEEP);
}

/** HP lost along a stretch of path, oldest first: every drop counted, healing left out */
function lossAlong(points: readonly PathPoint[]): number {
  let loss = 0;
  for (let i = 1; i < points.length; i++) loss += Math.max(0, points[i - 1].hp - points[i].hp);
  return loss;
}

/** play the last `seconds` of her path backwards */
function startRewind(seconds: number, extraLoss = 0): void {
  const h = hero;
  const n = Math.max(2, Math.round(seconds / STEP));
  const stretch = mirelHost.path.slice(-n);
  if (stretch.length < 2) stretch.unshift({ x: h.x, y: h.y, face: h.face, hp: h.hp });
  mirelHost.rewoundLoss = lossAlong(stretch) + extraLoss;
  mirelHost.rewound = [...stretch].reverse();
  mirel.rewindFrom = { x: h.x, y: h.y };
  mirel.rewindDodged = false;
  mirel.hovering = false;
  Object.assign(h, { vx: 0, vy: 0, move: null, queued: null, charge: 0, chargeLevel: 0 });
  setState("rewind");
  sfx.swing(0.45);
  sfx.chime(0);
  lights.add(h.x, h.y - 16, 40, PAL.hour[4], 0.8, 0.25);
  const v = skillValues(LONG);
  if (v.field) openFreeField(h.x, h.y - 16, withCharms("duration", v.fieldLife), withCharms("area", v.field));
}

/** L: Rewind, paid in Sand, a little while after the last; also out of a flinch */
export function pressRewind(): boolean {
  const s = hero.state;
  if (s === "dead" || s === "rewind" || s === "charge" || s === "ultimate" || s === "hour" || s === "noon")
    return false;
  if (mirel.rewindCd > 0) return false;
  const cost = rewindCost();
  if (!hasSand(cost)) {
    refuseSand();
    return true;
  }
  spendSand(cost);
  startRewind(lookBack());
  return true;
}

/** Second Chance: once a wave a blow that would fell her rewinds her two seconds and gives back all she lost in them */
export function secondChance(dmg: number): boolean {
  if (!skillValues(LONG).secondChance || hero.hp - dmg > 0 || mirel.secondChance === game.wave) return false;
  if (hero.state === "rewind") return false;
  mirel.secondChance = game.wave;
  startRewind(CHANCE_LOOK, 0);
  mirelHost.rewoundLoss = Number.POSITIVE_INFINITY;
  lights.add(hero.x, hero.y - 16, 70, PAL.hour[5], 1, 0.4);
  return true;
}

/** a blow that meets her while she rewinds misses; early in the Rewind it is a perfect dodge, once */
export function rewindDodge(): boolean {
  if (hero.state !== "rewind") return false;
  const window = skillValues(LONG).dodge ?? REWIND.dodge;
  if (hero.st <= window && !mirel.rewindDodged) {
    mirel.rewindDodged = true;
    rewardPerfectDodge();
    sfx.perfect();
  }
  return true;
}

/** sand motes stream back toward her along the path */
function streamSand(): void {
  if (!rng.chance(0.6)) return;
  const from = mirel.rewindFrom;
  if (!from) return;
  particles.spawn(
    PK.MOTE,
    from.x + rng.range(-4, 4),
    from.y - rng.range(4, 26),
    (hero.x - from.x) * 3,
    rng.range(-10, 10),
    0.3,
    {
      col: rng.chance(0.5) ? SAND.light : PAL.hour[4],
      size: 0.6,
    },
  );
}

/** Long Rewind: foes her path ran through take a blow */
function strikePath(points: readonly PathPoint[]): void {
  const power = skillValues(LONG).power;
  if (!power) return;
  const hit = new Set<Enemy>();
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const b = enemyBox(e);
    if (
      !points.some(
        (p, i) => i % 6 === 0 && p.x > b[0] - 4 && p.x < b[2] + 4 && p.y - 16 > b[1] - 8 && p.y - 16 < b[3] + 8,
      )
    )
      continue;
    hit.add(e);
  }
  for (const e of hit) dealDamage(e, progress.stats.ad * power, { fromX: hero.x, kx: hero.face * 60, melee: true });
}

/** the Rewind ends where her path began: HP given back, Backswing's and Quickened's windows open */
function endRewind(): void {
  const h = hero;
  const v = skillValues(LONG);
  const share = v.heal ?? REWIND.heal;
  const loss = mirelHost.rewoundLoss;
  const healed = Number.isFinite(loss) ? Math.min(progress.stats.hp - h.hp, loss * share) : progress.stats.hp - h.hp;
  h.hp = Math.min(progress.stats.hp, h.hp + Math.max(0, healed));
  const from = mirel.rewindFrom ?? { x: h.x, y: h.y };
  const to = { x: h.x, y: h.y };
  strikePath(mirelHost.rewound);
  const now = game.t;
  const window = lookBack() + REWIND.play;
  mirelHost.replay = mirelHost.landed.filter((l) => now - l.t <= window).reduce((sum, l) => sum + l.damage, 0);
  mirelHost.rewound = [];
  mirelHost.path = [];
  mirel.rewindCd = REWIND.cooldown;
  mirel.sinceRewind = 0;
  quicken();
  h.ground = Math.abs(surfaceBelow(h.x, h.y - 1) - h.y) < 0.6;
  setState(h.ground ? "idle" : "fall");
  game.fx.push(createFloorRing(h.x, h.y, 16, PAL.hour, 0.35));
  emitSkillEvent({ type: "rewind", healed, from, to });
  emitSkillEvent({ type: "dash", dir: Math.sign(to.x - from.x) || -h.face, foes: [] });
  travelEnded();
}

/** the path plays backwards: she is moved along it, gravity off, leaving afterimages */
export function runRewind(): void {
  const h = hero;
  const points = mirelHost.rewound;
  // Light Boots play the path back faster
  const u = Math.min(1, h.st / (REWIND.play / progress.stats.move));
  const p = points[Math.min(points.length - 1, Math.floor(u * (points.length - 1)))];
  if (p) Object.assign(h, { x: p.x, y: p.y, face: p.face, vx: 0, vy: 0, ground: false });
  const before = h.st - STEP;
  if (Math.floor(h.st / GHOST_EVERY) !== Math.floor(before / GHOST_EVERY)) dropMoveGhost();
  streamSand();
  if (u >= 1) endRewind();
}
