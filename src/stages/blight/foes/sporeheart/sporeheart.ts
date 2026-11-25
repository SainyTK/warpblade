import { GROUND } from "../../../../constants/stage";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { createRift } from "../../../../game/effects/rift";
import { makeEnemy } from "../../../../game/enemies/enemy";
import { turnToHero } from "../../../../game/enemies/facing";
import { kindOf } from "../../../../game/enemies/kinds";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { shake, surfaceBelow } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BLIGHT, BLIGHT_SPARKS } from "../../colors";
import { createSporeShot } from "../../spores";
import { CORE, HEART_ENRAGE, HEART_HITS, HEART_TIMES, type HeartMove, MOVE_STATE, STRIKE_STATE } from "./moves";
import { createRootEruption } from "./rootEruption";
import { createSporePulse } from "./sporePulse";
import { createVineLash } from "./vineLash";
import { createVineSweep } from "./vineSweep";

const PUFF_LIMIT = 3;
const LAST_MOVE = new WeakMap<Enemy, HeartMove>();
const WIND: Record<HeartMove, number> = {
  lash: HEART_TIMES.lash,
  bomb: HEART_TIMES.bomb,
  root: HEART_TIMES.root,
  summon: HEART_TIMES.summon,
  sweep: HEART_TIMES.sweep,
  pulse: HEART_TIMES.pulse,
};
const HOLD: Record<HeartMove, number> = {
  lash: HEART_TIMES.lashHold,
  bomb: HEART_TIMES.bombHold,
  root: HEART_TIMES.rootHold,
  summon: HEART_TIMES.summonHold,
  sweep: HEART_TIMES.sweepSpin,
  pulse: HEART_TIMES.pulseHold,
};

const windOf = (e: Enemy, move: HeartMove): number =>
  WIND[move] * waveScale(game.wave).windup * (e.phase === 2 && move !== "pulse" && move !== "sweep" ? 0.85 : 1);

export const windTime = (e: Enemy, move: HeartMove): number => windOf(e, move);

const puffsAlive = (): number => game.enemies.filter((f) => f.type === "sporepuff" && f.hp > 0).length;

function weights(e: Enemy): [HeartMove, number][] {
  const dx = Math.abs(hero.x - e.x);
  const high = hero.y < GROUND - 24;
  const list: [HeartMove, number][] = [
    ["lash", dx < 90 ? 3 : 1.5],
    ["bomb", high ? 3 : 2],
    ["root", 2],
    ["summon", puffsAlive() < 2 ? 1.2 : 0],
  ];
  if (e.phase === 2) list.push(["sweep", dx < 85 ? 3 : 1.2], ["pulse", 1.6]);
  const last = LAST_MOVE.get(e);
  return list.map(([m, w]) => [m, m === last ? w * 0.15 : w]);
}

function choose(e: Enemy): HeartMove {
  const options = weights(e);
  const total = options.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng.range(0, total);
  for (const [m, w] of options) {
    roll -= w;
    if (roll <= 0) return m;
  }
  return options[0][0];
}

function begin(e: Enemy, move: HeartMove): void {
  LAST_MOVE.set(e, move);
  Object.assign(e, { state: MOVE_STATE[move], st: 0 });
  const wind = windOf(e, move);
  const coreX = e.x + e.face * CORE.x;
  const coreY = e.y + CORE.y;
  if (move === "lash") {
    const dirs = e.phase === 2 ? [-1, 1] : [Math.sign(hero.x - e.x) || e.face];
    for (const dir of dirs) {
      const x0 = e.x + dir * 18;
      const end = dir < 0 ? stageLeft() + 4 : stageRight() - 4;
      if ((end - x0) * dir > 10) game.fx.push(createVineLash(x0, dir, end, wind, HEART_HITS.lash * e.power));
    }
  } else if (move === "root") {
    const spots = e.phase === 2 ? [0, -34, 34, -68, 68] : [0, -40, 40];
    const struck = new Set<number>();
    const lead = clamp(hero.vx * 0.2, -20, 20);
    spots.forEach((off, i) => {
      const x = clamp(hero.x + lead + off + rng.range(-6, 6), stageLeft() + 8, stageRight() - 8);
      if (Math.abs(x - e.x) < 22) return;
      game.fx.push(createRootEruption(x, wind + 0.25 + i * 0.08, HEART_HITS.root * e.power, struck));
    });
  } else if (move === "sweep") {
    game.fx.push(createVineSweep(coreX, coreY, e.face, wind, HEART_TIMES.sweepSpin, HEART_HITS.sweep * e.power));
  }
}

function lobBombs(e: Enemy): void {
  const n = e.phase === 2 ? 5 : 3;
  for (let i = 0; i < n; i++) {
    const spread = (i - (n - 1) / 2) * 30 + rng.range(-5, 5);
    const tx = clamp(hero.x + spread, stageLeft() + 10, stageRight() - 10);
    const ty = surfaceBelow(tx, hero.y - 2);
    const damage = HEART_HITS.bomb * e.power;
    game.fx.push(
      createSporeShot({
        x: e.x + e.face * 2,
        y: e.y - 50,
        tx,
        ty,
        flight: 0.9 + i * 0.09,
        damage,
        size: 3,
        splash: 12,
        puddle: { half: 10, life: 3, damage: HEART_HITS.puddle * e.power },
      }),
    );
  }
  sfx.swing(0.6);
}

function summonPuffs(e: Enemy): void {
  const room = Math.max(0, PUFF_LIMIT - puffsAlive());
  const rift = kindOf("sporepuff").rift;
  for (let i = 0; i < Math.min(2, room); i++) {
    const x = clamp(e.x + (i ? 40 : -50) * e.face, stageLeft() + 20, stageRight() - 20);
    const y = 70 + i * 16;
    game.fx.push(
      createRift(x, rift.riftY(y), rift.height, i * 0.15, () => {
        game.enemies.push(makeEnemy("sporepuff", x, y, game.wave));
      }),
    );
  }
}

function strike(e: Enemy, move: HeartMove): void {
  Object.assign(e, { state: STRIKE_STATE[move], st: 0 });
  if (move === "bomb") lobBombs(e);
  else if (move === "summon") summonPuffs(e);
  else if (move === "pulse") {
    game.fx.push(createSporePulse(e.x + e.face * CORE.x, e.y + CORE.y, HEART_HITS.pulse * e.power));
    shake(0.35, 3);
  } else if (move === "root") {
    shake(0.2, 2);
    sfx.boom();
  }
}

function wake(e: Enemy): void {
  e.phase = 2;
  Object.assign(e, { state: "blink", st: 0, cd: 0 });
  shake(0.5, 3.5);
  sfx.boom();
}

function burstOpen(e: Enemy): void {
  for (let i = 0; i < 26; i++) {
    const a = fxRng.range(0, TAU);
    const v = fxRng.range(40, 140);
    particles.spawn(PK.SHARD, e.x, e.y + CORE.y, Math.cos(a) * v, Math.sin(a) * v - 40, fxRng.range(0.5, 1), {
      col: fxRng.pick(BLIGHT_SPARKS.flesh),
      size: fxRng.range(1.2, 2.4),
    });
  }
  for (let i = 0; i < 20; i++) {
    const a = fxRng.range(0, TAU);
    particles.spawn(PK.MOTE, e.x, e.y + CORE.y, Math.cos(a) * 60, Math.sin(a) * 60, fxRng.range(0.5, 1), {
      col: fxRng.pick(BLIGHT.spore),
      size: 0.7,
    });
  }
  shake(0.4, 3);
  sfx.boom();
}

function ambience(e: Enemy, ts: number): void {
  if (fxRng.chance((e.phase === 2 ? 0.3 : 0.12) * ts))
    particles.spawn(
      PK.MOTE,
      e.x + fxRng.range(-22, 22),
      e.y - fxRng.range(20, 60),
      fxRng.range(-4, 4),
      -fxRng.range(6, 16),
      fxRng.range(0.6, 1.2),
      { col: fxRng.pick(BLIGHT.spore), size: 0.5 },
    );
  if (fxRng.chance(0.05 * ts))
    particles.spawn(PK.SMOKE, e.x + fxRng.range(-10, 10), e.y - 46, 0, -8, 1, {
      col: BLIGHT.puff[1],
      size: fxRng.range(1.5, 2.5),
    });
}

export function updateSporeheart(e: Enemy, dt: number, ts: number): void {
  e.vx = 0;
  e.y = GROUND;
  ambience(e, ts);
  if (e.phase === 1 && e.hp < e.max * HEART_ENRAGE && e.state !== "blink") {
    wake(e);
    return;
  }
  if (e.state === "blink") {
    if (e.st >= HEART_TIMES.wake * 0.45 && e.st - dt < HEART_TIMES.wake * 0.45) burstOpen(e);
    if (e.st >= HEART_TIMES.wake) Object.assign(e, { state: "walk", st: 0, cd: 0.4 });
    return;
  }
  if (e.state === "walk") {
    turnToHero(e, dt);
    if (e.cd <= 0 && hero.state !== "dead") begin(e, choose(e));
    return;
  }
  const move = (Object.keys(MOVE_STATE) as HeartMove[]).find((m) => MOVE_STATE[m] === e.state);
  if (move) {
    if (move === "pulse" && fxRng.chance(0.8 * ts)) {
      const a = fxRng.range(0, TAU);
      const d = fxRng.range(30, 60);
      particles.spawn(
        PK.MOTE,
        e.x + Math.cos(a) * d,
        e.y + CORE.y + Math.sin(a) * d,
        -Math.cos(a) * d * 1.6,
        -Math.sin(a) * d * 1.6,
        0.6,
        {
          col: BLIGHT.spore[3],
          size: 0.6,
        },
      );
    }
    if (e.st >= windOf(e, move)) strike(e, move);
    return;
  }
  const struck = (Object.keys(STRIKE_STATE) as HeartMove[]).find((m) => STRIKE_STATE[m] === e.state);
  if (struck && e.st >= HOLD[struck]) {
    Object.assign(e, { state: "recover", st: 0 });
    return;
  }
  if (e.state === "recover" && e.st >= HEART_TIMES.rest) {
    const rest = e.phase === 2 ? rng.range(0.7, 1.1) : rng.range(1.1, 1.6);
    Object.assign(e, { state: "walk", st: 0, cd: rest * waveScale(game.wave).cooldown });
  }
}
