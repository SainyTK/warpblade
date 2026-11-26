import { GROUND } from "../../../../constants/stage";
import { clampStageX, stageLeft, stageRight } from "../../../../game/adventure";
import { fxRng, game, hero, lights, particles, rng } from "../../../../game/state";
import { shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { WHITE } from "../../../../utils/color";
import { approach, clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_FOES as C, SKY_SPARKS } from "../colors";
import { beakOf, createBreath } from "./breath";
import { createFeather } from "./feather";
import { createRocGust } from "./gust";
import { mindOf } from "./mind";
import {
  BREATH,
  FEATHERS,
  ROC_COOLDOWN,
  ROC_ENRAGE,
  ROC_HITS,
  ROC_HOVER,
  ROC_TIMES,
  ROC_WINDUP,
  type RocMove,
  STRIKE_SPREAD,
  stormWindup,
  stormy,
} from "./moves";
import { createStrike } from "./strike";
import { createSwoopMark, flySwoop, planSwoop } from "./swoop";

const MOVES: readonly RocMove[] = ["gust", "swoop", "strikes", "volley"];
const STORM_MOVES: readonly RocMove[] = ["gust", "swoop", "strikes", "volley", "breath", "breath"];

const windupOf = (e: Enemy, move: keyof typeof ROC_WINDUP): number =>
  ROC_WINDUP[move] * stormWindup(e) * waveScale(game.wave).windup;

function hover(e: Enemy, dt: number, height: number): void {
  const room = { left: stageLeft() + 34, right: stageRight() - 34 };
  let tx = hero.x + e.side * ROC_HOVER.keep;
  if (tx < room.left || tx > room.right) {
    e.side = -e.side;
    tx = hero.x + e.side * ROC_HOVER.keep;
  }
  tx = clamp(tx, room.left, room.right);
  const ty = height + Math.sin(game.t * 2.2 + e.seed) * 5;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.6, -ROC_HOVER.speed, ROC_HOVER.speed), 160 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.8, -70, 70), 180 * dt);
  e.face = Math.sign(hero.x - e.x) || e.face;
}

function begin(e: Enemy, move: RocMove): void {
  const mind = mindOf(e);
  mind.last = move;
  mind.struck = new Set();
  if (move === "gust") {
    mind.gustDir = Math.sign(hero.x - e.x) || e.face;
    Object.assign(e, { state: "charge", st: 0 });
    game.fx.push(createRocGust(e));
    sfx.swing(0.4);
  } else if (move === "swoop") {
    Object.assign(e, { state: "dive", st: 0 });
    mind.swoop = planSwoop();
    game.fx.push(createSwoopMark(e, mind.swoop));
    sfx.swing(0.6);
  } else if (move === "strikes") {
    Object.assign(e, { state: "summon", st: 0, n: 0 });
    const center = clampStageX(hero.x, 14 + STRIKE_SPREAD);
    mind.strikes = [center, center - STRIKE_SPREAD, center + STRIKE_SPREAD];
    mind.fired = 0;
    sfx.chime(4);
  } else if (move === "volley") {
    Object.assign(e, { state: "volley", st: 0 });
    sfx.chime(2);
  } else {
    Object.assign(e, { state: "wind", st: 0 });
    const dir = Math.sign(hero.x - e.x) || e.face;
    mind.breathFrom = e.x + dir * BREATH.reach;
    mind.breathTo = dir > 0 ? stageRight() - BREATH.edge : stageLeft() + BREATH.edge;
    game.fx.push(createBreath(e));
    sfx.chime(5);
  }
}

function choose(e: Enemy): void {
  const pool = (stormy(e) ? STORM_MOVES : MOVES).filter((m) => m !== mindOf(e).last);
  begin(e, rng.pick(pool));
}

function rest(e: Enemy): void {
  const share = stormy(e) ? ROC_COOLDOWN.storm : 1;
  const cd = rng.range(ROC_COOLDOWN.least, ROC_COOLDOWN.most) * share * waveScale(game.wave).cooldown;
  Object.assign(e, { state: "drift", st: 0, n: 0, cd });
}

export function releaseFeathers(e: Enemy): void {
  const count = stormy(e) ? FEATHERS.storm : FEATHERS.calm;
  const sx = e.x + e.face * 6;
  const sy = e.y - 4;
  const aim = Math.atan2(hero.y - 16 - sy, hero.x - sx);
  for (let i = 0; i < count; i++) {
    const a = aim + (i / (count - 1) - 0.5) * 2 * FEATHERS.fan;
    const vx = Math.cos(a) * FEATHERS.speed;
    const vy = Math.sin(a) * FEATHERS.speed;
    game.fx.push(createFeather(sx, sy, vx, vy, ROC_HITS.feather * e.power));
  }
  sfx.swing(1.2);
}

function strikeAll(e: Enemy): void {
  const mind = mindOf(e);
  const mark = stormy(e) ? ROC_TIMES.strikeMarkStorm : ROC_TIMES.strikeMark;
  mind.strikes.forEach((x, i) => {
    game.fx.push(createStrike(x, mark + i * ROC_TIMES.strikeGap, ROC_HITS.bolt * e.power));
  });
  mind.fired = 1;
  lights.add(e.x, e.y - 10, 40, C.volt[3], 0.7, 0.3);
  sfx.thunder();
}

function becomeStorm(e: Enemy): void {
  Object.assign(e, { phase: 2, state: "blink", st: 0, vx: 0, vy: 0 });
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * TAU;
    particles.spawn(PK.SPARK, e.x, e.y, Math.cos(a) * 160, Math.sin(a) * 160, 0.6, { sparks: SKY_SPARKS.volt });
  }
  for (let i = 0; i < 10; i++)
    particles.spawn(
      PK.SHARD,
      e.x + fxRng.range(-20, 20),
      e.y + fxRng.range(-10, 10),
      fxRng.range(-90, 90),
      -fxRng.range(30, 120),
      0.9,
      {
        col: fxRng.pick(SKY_SPARKS.feather),
        size: 2,
      },
    );
  lights.add(e.x, e.y, 90, WHITE, 0.9, 0.2);
  shake(0.5, 3.5);
  sfx.boom();
  sfx.thunder();
}

function crackle(e: Enemy, ts: number): void {
  if (!stormy(e) || !fxRng.chance(0.35 * ts)) return;
  particles.spawn(
    PK.SPARK,
    e.x + fxRng.range(-26, 26),
    e.y + fxRng.range(-16, 12),
    fxRng.range(-30, 30),
    fxRng.range(-40, 10),
    0.25,
    {
      sparks: SKY_SPARKS.volt,
    },
  );
}

export function updateTempestroc(e: Enemy, dt: number, ts: number): void {
  const mind = mindOf(e);
  if (!mind.lit) {
    mind.lit = true;
    e.side = hero.x < e.x ? 1 : -1;
  }
  if (e.phase === 1 && e.hp <= e.max * ROC_ENRAGE && e.state !== "lunge") becomeStorm(e);
  if (e.state === "drift") {
    hover(e, dt, ROC_HOVER.height);
    if (e.cd <= 0 && hero.state !== "dead") choose(e);
  } else if (e.state === "charge") {
    hover(e, dt, ROC_HOVER.low);
    e.face = mind.gustDir;
    if (e.st >= windupOf(e, "gust")) {
      Object.assign(e, { state: "swipe", st: 0 });
      shake(0.2, 2);
      sfx.boom();
    }
  } else if (e.state === "swipe") {
    e.vx = approach(e.vx, -mind.gustDir * 10, 200 * dt);
    e.vy = approach(e.vy, 0, 200 * dt);
    e.face = mind.gustDir;
    if (e.st >= (stormy(e) ? ROC_TIMES.gustStorm : ROC_TIMES.gust)) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "dive") {
    const path = mind.swoop;
    if (!path) return rest(e);
    e.vx = approach(e.vx, clamp((path.x0 - e.x) * 4, -300, 300), 900 * dt);
    e.vy = approach(e.vy, clamp((path.y0 - e.y) * 4, -140, 140), 500 * dt);
    e.face = Math.sign(path.x1 - path.x0) || e.face;
    if (e.st >= windupOf(e, "swoop")) {
      Object.assign(e, { state: "lunge", st: 0 });
      sfx.lunge();
    }
  } else if (e.state === "lunge") {
    const path = mind.swoop;
    if (!path || flySwoop(e, path)) Object.assign(e, { state: "recover", st: 0, vx: e.vx * 0.2, vy: -20 });
    return;
  } else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, -8, 200 * dt);
    if (mind.fired === 0 && e.st >= windupOf(e, "strikes")) strikeAll(e);
    if (fxRng.chance(dt * 25))
      particles.spawn(PK.SPARK, e.x + fxRng.range(-8, 8), e.y - 18, 0, -fxRng.range(30, 80), 0.25, {
        sparks: SKY_SPARKS.volt,
      });
    if (e.st >= windupOf(e, "strikes") + ROC_TIMES.strikesDone) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "volley") {
    hover(e, dt, ROC_HOVER.height - 6);
    if (e.st >= windupOf(e, "volley")) {
      releaseFeathers(e);
      Object.assign(e, { state: "shoot", st: 0 });
    }
  } else if (e.state === "shoot") {
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, -20, 200 * dt);
    if (e.st >= ROC_TIMES.volleyHold) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, clamp((ROC_HOVER.height + 8 - e.y) * 2, -40, 40), 200 * dt);
    if (fxRng.chance(dt * 30)) {
      const [bx, by] = beakOf(e);
      particles.spawn(PK.SPARK, bx + fxRng.range(-12, 12), by + fxRng.range(-10, 10), 0, 0, 0.2, {
        sparks: SKY_SPARKS.volt,
      });
    }
    if (e.st >= windupOf(e, "breath")) {
      Object.assign(e, { state: "beam", st: 0 });
      sfx.thunder();
      shake(0.2, 2);
    }
  } else if (e.state === "beam") {
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, 0, 200 * dt);
    if (e.st >= ROC_TIMES.breath) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "blink") {
    Object.assign(e, { vx: 0, vy: 0, pinned: 0, halt: 0 });
    if (fxRng.chance(dt * 40))
      lights.add(e.x + fxRng.range(-20, 20), e.y + fxRng.range(-14, 10), 30, C.volt[3], 0.8, 0.08);
    if (e.st >= ROC_TIMES.roar) rest(e);
  } else {
    hover(e, dt, ROC_HOVER.height);
    e.vy = approach(e.vy, 10, 60 * dt);
    if (e.st >= ROC_TIMES.recover) rest(e);
  }
  e.x = clampStageX(e.x + e.vx * dt, 18);
  e.y = clamp(e.y + e.vy * dt, 24, GROUND - 18);
  crackle(e, ts);
}
