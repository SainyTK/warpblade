import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng, showBanner } from "../../../../game/state";
import { shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy, EnemyState } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { ATTACK, type Attack, CLAW, CLAW_TIMES } from "./constants";
import { breathe, land, launchPounce, pounceHits, roar, shardRing, sweepTail } from "./moves";
import { createFloorWarning } from "./warning";

const WINDUP: Record<Attack, { state: EnemyState; time: number }> = {
  [ATTACK.pounce]: { state: "charge", time: CLAW_TIMES.crouch },
  [ATTACK.tail]: { state: "wind", time: CLAW_TIMES.tailWind },
  [ATTACK.roar]: { state: "volley", time: CLAW_TIMES.roarWind },
  [ATTACK.breath]: { state: "hop", time: CLAW_TIMES.breathWind },
  [ATTACK.ring]: { state: "blink", time: CLAW_TIMES.ringWind },
};

const enraged = (e: Enemy): boolean => e.phase === 2;
const windup = (e: Enemy): number => waveScale(game.wave).windup * (enraged(e) ? 0.82 : 1);

function weights(e: Enemy): [Attack, number][] {
  const gap = Math.abs(hero.x - e.x);
  const ring = enraged(e) ? 2 : 0;
  if (hero.y < GROUND - 30)
    return [
      [ATTACK.roar, 3],
      [ATTACK.pounce, 2],
      [ATTACK.ring, ring + 1],
    ];
  if (gap < 56)
    return [
      [ATTACK.tail, 4],
      [ATTACK.breath, 2],
      [ATTACK.roar, 1],
      [ATTACK.ring, ring],
    ];
  if (gap < 130)
    return [
      [ATTACK.breath, 3],
      [ATTACK.pounce, 3],
      [ATTACK.roar, 2],
      [ATTACK.ring, ring],
    ];
  return [
    [ATTACK.pounce, 4],
    [ATTACK.roar, 2],
    [ATTACK.ring, ring],
  ];
}

function choose(e: Enemy): void {
  const options = weights(e).filter(([a, w]) => w > 0 && a !== e.ay);
  const total = options.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng.range(0, total);
  let pick: Attack = options[0][0];
  for (const [a, w] of options) {
    roll -= w;
    if (roll <= 0) {
      pick = a;
      break;
    }
  }
  const wind = WINDUP[pick];
  Object.assign(e, { state: wind.state, st: 0, ay: pick, n: 0 });
  const time = wind.time * windup(e);
  if (pick === ATTACK.tail) {
    game.fx.push(createFloorWarning(e, "wind", 0, CLAW.tailReach, time));
    game.fx.push(createFloorWarning(e, "wind", 0, -CLAW.tailReach, time));
  }
  if (pick === ATTACK.breath) game.fx.push(createFloorWarning(e, "hop", 34, 34 + CLAW.breathReach, time));
}

function shift(e: Enemy): void {
  e.phase = 2;
  Object.assign(e, { state: "summon", st: 0, vx: 0 });
  shake(0.6, 4);
  sfx.thunder();
  showBanner("Rimeclaw bares its crystal spines", 1.8);
}

function rest(e: Enemy): void {
  const pace = enraged(e) ? 0.7 : 1;
  Object.assign(e, { state: "walk", st: 0, cd: rng.range(0.7, 1.3) * pace * waveScale(game.wave).cooldown });
}

function stalk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const want = gap > 70 ? e.face * CLAW.stalk * (enraged(e) ? 1.4 : 1) : gap < 30 ? -e.face * 20 : 0;
  e.vx = approach(e.vx, want, 160 * dt);
  if (e.cd <= 0 && facesHero(e) && hero.state !== "dead") choose(e);
}

function leap(e: Enemy, dt: number): void {
  e.vy += CLAW.gravity * dt;
  e.x = clampStageX(e.x + e.vx * dt, 24);
  e.y += e.vy * dt;
  pounceHits(e);
  if (e.y < GROUND || e.vy <= 0) return;
  land(e);
  if (enraged(e) && e.n === 0) Object.assign(e, { state: "charge", st: 0, n: 1 });
  else Object.assign(e, { state: "recover", st: 0 });
}

function release(e: Enemy, next: EnemyState, act: (e: Enemy) => void, time: number): void {
  if (e.st < time * windup(e)) return;
  Object.assign(e, { state: next, st: 0 });
  act(e);
}

export function updateRimeclaw(e: Enemy, dt: number, ts: number): void {
  if (e.phase === 1 && e.hp < e.max * CLAW.enrage && e.state !== "leap") shift(e);
  const s = e.state;
  if (s === "walk") stalk(e, dt);
  else if (s === "charge") {
    turnToHero(e, dt);
    if (e.st >= (e.n > 0 ? CLAW_TIMES.recrouch : CLAW_TIMES.crouch) * windup(e)) launchPounce(e);
  } else if (s === "leap") leap(e, dt);
  else if (s === "wind") release(e, "swipe", sweepTail, CLAW_TIMES.tailWind);
  else if (s === "volley") release(e, "shoot", roar, CLAW_TIMES.roarWind);
  else if (s === "hop") release(e, "beam", breathe, CLAW_TIMES.breathWind);
  else if (s === "blink") release(e, "dive", shardRing, CLAW_TIMES.ringWind);
  else if (s === "swipe" && e.st >= CLAW_TIMES.tailSwing) Object.assign(e, { state: "recover", st: 0 });
  else if (s === "shoot" && e.st >= CLAW_TIMES.roar) Object.assign(e, { state: "recover", st: 0 });
  else if (s === "beam" && e.st >= CLAW_TIMES.breath) Object.assign(e, { state: "recover", st: 0 });
  else if (s === "dive" && e.st >= CLAW_TIMES.ring) Object.assign(e, { state: "recover", st: 0 });
  else if (s === "summon" && e.st >= CLAW_TIMES.shift) Object.assign(e, { state: "recover", st: 0 });
  else if (s === "recover" && e.st >= CLAW_TIMES.rest) rest(e);
  if (e.state === "leap") return;
  if (e.state !== "walk") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 24);
  e.y = GROUND;
  const glowing = e.state === "summon" || e.state === "blink" || enraged(e);
  if (fxRng.chance((glowing ? 0.35 : 0.1) * ts))
    particles.spawn(
      PK.FLAKE,
      e.x + fxRng.range(-24, 24),
      e.y - fxRng.range(20, 40),
      fxRng.range(-8, 8),
      -fxRng.range(4, 14),
      0.9,
      {
        col: glowing ? FOE.spine[2] : FOE.crystal[3],
      },
    );
  if (e.state === "summon" && fxRng.chance(0.6 * ts))
    particles.spawn(
      PK.SHARD,
      e.x + fxRng.range(-20, 16),
      e.y - fxRng.range(30, 40),
      fxRng.range(-60, 60),
      -fxRng.range(40, 120),
      0.6,
      {
        col: fxRng.pick(FOE.spine),
        size: fxRng.range(1, 2.2),
      },
    );
}

export const rimeclawSteady = (e: Enemy): boolean => e.state === "summon" || e.state === "leap";
