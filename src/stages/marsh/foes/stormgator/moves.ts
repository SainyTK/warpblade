import { GROUND } from "../../../../constants/stage";
import { clampStageX, summonFoe } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { MUD_SPARKS } from "../../../../game/enemies/rain/colors";
import { createMudWave } from "../../../../game/enemies/rain/mudWave";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { SCUTE_SPARKS } from "./colors";
import { GATOR, GATOR_HITS, GATOR_REACH, GATOR_SUMMON } from "./constants";
import { bodySpan } from "./frame";
import { createRushLine } from "./rushLine";
import { rushWindup } from "./timing";

export const boglingsAlive = (): number => game.enemies.filter((o) => o.type === "bogling" && o.hp > 0).length;

function spray(x: number, n: number, up: number): void {
  for (let i = 0; i < n; i++)
    particles.spawn(
      PK.SPARK,
      x + fxRng.range(-6, 6),
      GROUND - 1,
      fxRng.range(-90, 90),
      -fxRng.range(up * 0.4, up),
      fxRng.range(0.25, 0.5),
      { sparks: MUD_SPARKS },
    );
}

export function crackle(e: Enemy, chance: number): void {
  if (!fxRng.chance(chance)) return;
  particles.spawn(
    PK.SPARK,
    e.x + fxRng.range(-14, 10) * e.face,
    e.y - fxRng.range(20, 27),
    fxRng.range(-20, 20),
    -fxRng.range(20, 60),
    0.2,
    { sparks: SCUTE_SPARKS },
  );
}

export function beginRushWind(e: Enemy): void {
  const front = e.x + e.face * GATOR_REACH.front;
  const to = clampStageX(e.x + e.face * GATOR.rushReach, 24) + e.face * GATOR_REACH.front;
  Object.assign(e, { state: "charge", st: 0, vx: 0 });
  game.fx.push(createRushLine(e, front, to, rushWindup()));
  sfx.swing(0.5);
}

export function launchRush(e: Enemy): void {
  Object.assign(e, { state: "lunge", st: 0, ax: e.x, ay: 0, vx: e.face * GATOR.rushSpeed });
  dust(e.x - e.face * 10, GROUND, 8, -e.face);
  spray(e.x, 6, 120);
  sfx.lunge();
}

export function rushHits(e: Enemy): void {
  const nose = e.x + e.face * (GATOR_REACH.front + 2);
  const box = [Math.min(e.x, nose), e.y - 20, Math.max(e.x, nose), e.y] as const;
  eachStanding(() => {
    if (e.ay || !boxHit(box, heroBox())) return;
    e.ay = 1;
    hurtHero(GATOR_HITS.rush * e.power, e.x);
  });
}

export function rushDone(e: Enemy, before: number): boolean {
  const went = Math.abs(e.x - e.ax);
  return went >= GATOR.rushReach || e.st >= GATOR.rushMost || Math.abs(e.x - before) < 0.01;
}

export function slam(e: Enemy): void {
  const back = e.x - e.face * GATOR.slamReach;
  const front = e.x + e.face * GATOR.slamFront;
  const box = [Math.min(back, front), GROUND - GATOR.slamHeight, Math.max(back, front), GROUND] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(GATOR_HITS.slam * e.power, e.x - e.face * 20);
  });
  const tip = clampStageX(e.x - e.face * GATOR.waveFrom, 8);
  game.fx.push(createMudWave(tip, -1, GATOR_HITS.wave * e.power, 0.05));
  game.fx.push(createMudWave(tip, 1, GATOR_HITS.wave * e.power, 0.05));
  spray(tip, 14, 170);
  dust(tip, GROUND, 8);
  shake(0.15, 1.5);
  sfx.boom();
}

export function bellow(e: Enemy): void {
  sfx.thunder();
  const room = Math.min(GATOR_SUMMON.each, GATOR_SUMMON.most - boglingsAlive());
  for (let i = 0; i < room; i++) {
    const side = i % 2 ? -1 : 1;
    const x = clampStageX(e.x + side * (GATOR_REACH.front + GATOR_SUMMON.gap * (1 + (i >> 1))), 12);
    const child = summonFoe("bogling", x, GROUND, GATOR_SUMMON.xp);
    Object.assign(child, { vx: side * GATOR_SUMMON.fling, face: side, cd: 1 });
    game.enemies.push(child);
    spray(x, 10, 140);
  }
}

export function touch(e: Enemy): void {
  if (e.halt > 0) return;
  const [x0, x1] = bodySpan(e.x, e.face, GATOR_REACH.back - 8, GATOR_REACH.front - 4);
  const box = [x0, e.y - GATOR_REACH.tall + 6, x1, e.y] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox()) && hero.state !== "dead") hurtHero(GATOR_HITS.touch * e.power, e.x);
  });
}
