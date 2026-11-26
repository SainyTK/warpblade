import { GROUND } from "../../../../constants/stage";
import { clampStageX, stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE, FOE_SPARKS } from "../colors";
import { createPaperBlade } from "../pagewing/blade";
import { createInkWave } from "./inkWave";
import { MOVE, MOVES, type MoveId, WYRM, WYRM_HITS } from "./moves";
import { headBox, markTime, wyrmPose } from "./pose";

const MAIN_BIT = 1;
const TWIN_BIT = 2;
const ERUPT_BIT = 4;
const WAVE_BIT = 8;
const MARGIN = 22;

const enraged = (e: Enemy): boolean => e.phase === 2;
const windup = (): number => waveScale(game.wave).windup;
const flagged = (e: Enemy, bit: number): boolean => (Math.round(e.ay) & bit) !== 0;
const flag = (e: Enemy, bit: number): void => {
  e.ay = Math.round(e.ay) | bit;
};
interface Plan {
  move: MoveId;
  target: number;
  last: MoveId | 0;
}

const plans = new WeakMap<Enemy, Plan>();

function planOf(e: Enemy): Plan {
  let plan = plans.get(e);
  if (!plan) {
    plan = { move: MOVE.erupt, target: e.x, last: 0 };
    plans.set(e, plan);
  }
  return plan;
}

function enter(e: Enemy, state: Enemy["state"]): void {
  e.state = state;
  e.st = 0;
  e.ay = 0;
}

function splashAt(x: number, n: number, up: number): void {
  for (let i = 0; i < n; i++)
    particles.spawn(
      PK.SPARK,
      x + fxRng.range(-8, 8),
      GROUND - 2,
      fxRng.range(-90, 90),
      -fxRng.range(60, up),
      fxRng.range(0.3, 0.6),
      {
        sparks: FOE_SPARKS.ink,
        size: fxRng.range(1, 1.8),
      },
    );
  for (let i = 0; i < n / 3; i++)
    particles.spawn(PK.FLAKE, x + fxRng.range(-8, 8), GROUND - 10, fxRng.range(-50, 50), -fxRng.range(30, 90), 1.1, {
      col: FOE.paper[3],
      size: 1.4,
    });
}

function begin(e: Enemy): void {
  const plan = planOf(e);
  const move = rng.pick(MOVES.filter((m) => m !== plan.last));
  plan.last = move;
  plan.move = move;
  plan.target = e.x;
  if (move === MOVE.erupt) {
    enter(e, "burrow");
    e.n = enraged(e) ? 2 : 1;
    plan.target = clampStageX(hero.x, MARGIN);
  } else if (move === MOVE.storm) {
    enter(e, "charge");
    e.n = enraged(e) ? WYRM.storm.volleys.enraged : WYRM.storm.volleys.calm;
  } else if (move === MOVE.wave) enter(e, "wind");
  else {
    enter(e, "burrow");
    const roomLeft = hero.x - stageLeft();
    const roomRight = stageRight() - hero.x;
    const side = roomLeft > roomRight ? -1 : 1;
    plan.target = clampStageX(hero.x + side * WYRM.bite.offset, MARGIN);
  }
  sfx.lunge();
}

function idle(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const dx = hero.x - e.x;
  const gap = Math.abs(dx);
  const want = gap > WYRM.keep + 24 ? 1 : gap < WYRM.keep - 30 ? -1 : 0;
  e.vx = approach(e.vx, Math.sign(dx) * want * WYRM.slide, 80 * dt);
  e.x = clampStageX(e.x + e.vx * dt, MARGIN);
  if (e.cd <= 0 && hero.state !== "dead") begin(e);
}

function travel(e: Enemy, dt: number): void {
  e.vx = 0;
  if (e.st < WYRM.dive) return;
  const plan = planOf(e);
  if (plan.move === MOVE.erupt) plan.target = clampStageX(hero.x, MARGIN);
  const goal = plan.target;
  e.x = approach(e.x, goal, WYRM.travel * dt);
  if (fxRng.chance(0.5)) dust(e.x, GROUND, 1, Math.sign(goal - e.x));
  if (Math.abs(e.x - goal) > 1 && e.st < WYRM.dive + WYRM.travelMost) return;
  e.face = Math.sign(hero.x - e.x) || e.face;
  enter(e, plan.move === MOVE.bite ? "hop" : "blink");
  sfx.chime(0);
}

function erupt(e: Enemy): void {
  const { half, height } = WYRM.erupt;
  if (!flagged(e, ERUPT_BIT) && e.st < WYRM.erupt.hurt) {
    eachStanding(() => {
      if (flagged(e, ERUPT_BIT) || !boxHit([e.x - half, GROUND - height, e.x + half, GROUND], heroBox())) return;
      flag(e, ERUPT_BIT);
      hurtHero(WYRM_HITS.erupt * e.power, e.x);
    });
  }
  if (e.st < WYRM.erupt.rise + WYRM.erupt.hold) return;
  if (e.n > 1) {
    e.n--;
    enter(e, "burrow");
    planOf(e).target = clampStageX(hero.x, MARGIN);
    return;
  }
  enter(e, "recover");
}

function storm(e: Enemy): void {
  const pose = wyrmPose(e, game.t);
  const [hx, hy] = pose.main.head;
  const x = e.x + e.face * hx;
  const y = e.y + hy;
  const count = enraged(e) ? WYRM.storm.enraged : WYRM.storm.calm;
  const aim = Math.atan2(hero.y - 14 - y, hero.x - x);
  for (let i = 0; i < count; i++) {
    const a = aim + (i - (count - 1) / 2) * WYRM.storm.spread;
    game.fx.push(
      createPaperBlade(x, y, Math.cos(a) * WYRM.storm.speed, Math.sin(a) * WYRM.storm.speed, WYRM_HITS.page * e.power),
    );
  }
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU;
    particles.spawn(PK.FLAKE, x, y, Math.cos(a) * 60, Math.sin(a) * 60, 0.8, { col: FOE.paper[3], size: 1.4 });
  }
  sfx.swing(1.2);
}

function slam(e: Enemy): void {
  const x = clampStageX(e.x + e.face * 34, 6);
  game.fx.push(createInkWave(x, 1, WYRM_HITS.wave * e.power));
  game.fx.push(createInkWave(x, -1, WYRM_HITS.wave * e.power));
  splashAt(x, 16, 160);
  shake(0.3, 3);
  sfx.boom();
}

function bite(e: Enemy): void {
  const pose = wyrmPose(e, game.t);
  const heads: [number, typeof pose.main | null, number, number][] = [
    [MAIN_BIT, pose.main, 0, WYRM.bite.strike + 0.06],
    [TWIN_BIT, pose.twin, WYRM.bite.lag, WYRM.bite.lag + WYRM.bite.strike + 0.06],
  ];
  for (const [bit, neck, from, to] of heads) {
    if (!neck || flagged(e, bit) || e.st < from || e.st > to) continue;
    const box = headBox(e, neck);
    eachStanding(() => {
      if (flagged(e, bit) || !boxHit(box, heroBox())) return;
      flag(e, bit);
      hurtHero(WYRM_HITS.bite * e.power, e.x);
    });
  }
}

function transform(e: Enemy): void {
  e.phase = 2;
  enter(e, "summon");
  e.vx = 0;
  splashAt(e.x, 24, 200);
  shake(0.5, 3);
  sfx.boom();
}

function touch(e: Enemy): void {
  if (e.state !== "walk" && e.state !== "recover" && e.state !== "charge" && e.state !== "wind") return;
  eachStanding(() => {
    if (boxHit([e.x - 6, GROUND - 26, e.x + 6, GROUND], heroBox())) hurtHero(WYRM_HITS.touch * e.power, e.x);
  });
}

export function updatePagewyrm(e: Enemy, dt: number): void {
  const calm = !enraged(e);
  if (calm && e.hp <= e.max * WYRM.enrage && (e.state === "walk" || e.state === "recover")) {
    transform(e);
    return;
  }
  switch (e.state) {
    case "walk":
      idle(e, dt);
      break;
    case "burrow":
      if (e.st < 0.05 && !flagged(e, WAVE_BIT)) {
        flag(e, WAVE_BIT);
        splashAt(e.x + e.face * 20, 8, 110);
      }
      travel(e, dt);
      break;
    case "blink":
      if (fxRng.chance(0.4))
        particles.spawn(PK.MOTE, e.x + fxRng.range(-9, 9), GROUND - 1, 0, -fxRng.range(20, 50), 0.4, {
          col: FOE.letter,
          size: 0.7,
        });
      if (e.st >= markTime(e) * windup()) {
        enter(e, "dive");
        splashAt(e.x, 22, 220);
        shake(0.3, 3);
        sfx.boom();
      }
      break;
    case "dive":
      erupt(e);
      break;
    case "charge":
      if (e.st >= WYRM.storm.wind * windup()) {
        enter(e, "shoot");
        storm(e);
      }
      break;
    case "shoot":
      if (e.st < WYRM.storm.fire) break;
      if (e.n > 1) {
        e.n--;
        enter(e, "charge");
        e.st = WYRM.storm.wind * 0.45;
      } else enter(e, "recover");
      break;
    case "wind":
      if (e.st >= WYRM.wave.wind * windup()) enter(e, "swipe");
      break;
    case "swipe":
      if (e.st >= WYRM.wave.slam && !flagged(e, WAVE_BIT)) {
        flag(e, WAVE_BIT);
        slam(e);
      }
      if (e.st >= WYRM.wave.slam + WYRM.wave.hold) enter(e, "recover");
      break;
    case "hop":
      e.face = Math.sign(hero.x - e.x) || e.face;
      if (e.st >= WYRM.bite.coil * windup()) {
        enter(e, "lunge");
        sfx.lunge();
      }
      break;
    case "lunge":
      bite(e);
      if (e.st >= WYRM.bite.strike + WYRM.bite.hold + (enraged(e) ? WYRM.bite.lag : 0)) enter(e, "recover");
      break;
    case "summon":
      if (e.st >= WYRM.summon) {
        enter(e, "walk");
        e.cd = 0.6;
      }
      break;
    default:
      if (e.st >= WYRM.recover) {
        const [low, high] = enraged(e) ? WYRM.cooldown.enraged : WYRM.cooldown.calm;
        enter(e, "walk");
        e.cd = rng.range(low, high) * waveScale(game.wave).cooldown;
      }
  }
  e.y = GROUND;
  touch(e);
}

export const wyrmUnderground = (e: Enemy): boolean =>
  e.state === "blink" ||
  (e.state === "burrow" && e.st >= WYRM.dive * 0.8) ||
  (e.state === "summon" && clamp(e.st / WYRM.summon) > 0.3 && e.st / WYRM.summon < 0.7);
