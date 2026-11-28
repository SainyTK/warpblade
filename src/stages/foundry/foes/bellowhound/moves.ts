import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FORGE_SPARKS } from "../../colors";

export const HOUND_HITS = { bite: 14, charge: 14, touch: 6 } as const;
export const HOUND_TIMES = { bite: 0.45, snap: 0.18, brace: 0.7, run: 0.6, recover: 0.85 } as const;
const HOUND_MOVE = { pace: 30, bite: 26, charge: 56, speed: 190, past: 40 } as const;

const exhaust = (e: Enemy): [number, number] => [e.x - e.face * 14, e.y - 16];

function puff(e: Enemy, hot: boolean): void {
  const [x, y] = exhaust(e);
  particles.spawn(PK.SMOKE, x, y, -e.face * fxRng.range(4, 14), -fxRng.range(10, 24), 0.7, {
    col: 0x2e2422,
    size: fxRng.range(1.5, 2.5),
  });
  if (hot)
    particles.spawn(PK.FIRE, x, y, -e.face * fxRng.range(10, 30), -fxRng.range(10, 30), 0.3, {
      size: fxRng.range(1.2, 2),
    });
}

function choose(e: Enemy): void {
  const gap = Math.abs(hero.x - e.x);
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead") return;
  if (gap < HOUND_MOVE.bite) {
    Object.assign(e, { state: "wind", st: 0 });
    sfx.swing(0.8);
  } else if (gap < HOUND_MOVE.charge) {
    Object.assign(e, { state: "charge", st: 0, ax: hero.x });
    sfx.swing(0.5);
  }
}

function bite(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0 });
  const front = e.x + e.face * 6;
  const reach = e.x + e.face * 26;
  const box = [Math.min(front, reach), GROUND - 20, Math.max(front, reach), GROUND - 4] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(HOUND_HITS.bite * e.power, e.x);
  });
  for (let i = 0; i < 5; i++)
    particles.spawn(
      PK.SPARK,
      e.x + e.face * 18,
      GROUND - 12,
      e.face * fxRng.range(20, 80),
      -fxRng.range(10, 60),
      0.25,
      {
        sparks: FORGE_SPARKS.molten,
      },
    );
}

function launch(e: Enemy): void {
  const dir = Math.sign(hero.x - e.x) || e.face;
  Object.assign(e, {
    state: "lunge",
    st: 0,
    n: 0,
    face: dir,
    vx: dir * HOUND_MOVE.speed,
    ax: hero.x + dir * HOUND_MOVE.past,
  });
  sfx.lunge();
  dust(e.x, GROUND, 6, -dir);
}

function run(e: Enemy, ts: number): void {
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(HOUND_HITS.charge * e.power, e.x - e.face * 6);
    }
  });
  if (fxRng.chance(0.8 * ts)) puff(e, true);
  if (fxRng.chance(0.5 * ts)) dust(e.x - e.face * 6, GROUND, 1, -e.face);
  const passed = (e.x - e.ax) * e.face >= 0;
  if (passed || e.st >= HOUND_TIMES.run || e.pinned > 0) Object.assign(e, { state: "recover", st: 0 });
}

export function updateBellowhound(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    const far = Math.abs(hero.x - e.x) > 18 || !foeSees(e);
    e.vx = approach(e.vx, far && e.halt <= 0 ? e.face * HOUND_MOVE.pace : 0, 160 * dt);
    if (fxRng.chance(0.06 * ts)) puff(e, false);
    choose(e);
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= HOUND_TIMES.bite * scale.windup) bite(e);
  } else if (e.state === "swipe") {
    if (e.st >= HOUND_TIMES.snap) Object.assign(e, { state: "recover", st: HOUND_TIMES.recover * 0.4 });
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, -e.face * 6, 300 * dt);
    if (fxRng.chance(0.5 * ts)) puff(e, e.st > HOUND_TIMES.brace * 0.5);
    if (fxRng.chance(0.3 * ts)) dust(e.x + e.face * 4, GROUND, 1, -e.face);
    if (e.st >= HOUND_TIMES.brace * scale.windup) launch(e);
  } else if (e.state === "lunge") run(e, ts);
  else if (e.st >= HOUND_TIMES.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.2, 2) * scale.cooldown });
  if (e.state !== "walk" && e.state !== "lunge") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(HOUND_HITS.touch * e.power, e.x);
  });
}
