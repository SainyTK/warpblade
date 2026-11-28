import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { shardBurst } from "../burst";
import { CRYSTAL_SPARKS, VEIL } from "../colors";
import { CALL, COLOSSUS, COLOSSUS_HITS, SLAM } from "./constants";
import { createSpireSpike } from "./spike";
import { createFallingStone } from "./stone";

export const windTime = (e: Enemy): number =>
  (e.n === SLAM ? COLOSSUS.slamWind : COLOSSUS.callWind) * waveScale(game.wave).windup;

function startSlam(e: Enemy): void {
  Object.assign(e, { state: "wind", st: 0, n: SLAM, vx: 0 });
  const wind = windTime(e);
  COLOSSUS.spikes.forEach((reach, i) => {
    const x = clampStageX(e.x + e.face * reach, 6);
    game.fx.push(createSpireSpike(x, wind + COLOSSUS.spikeEvery * (i + 1), COLOSSUS_HITS.spike * e.power));
  });
  sfx.swing(0.4);
}

function startCall(e: Enemy): void {
  Object.assign(e, { state: "wind", st: 0, n: CALL, vx: 0 });
  const mark = windTime(e) + COLOSSUS.fall;
  for (let i = -1; i <= 1; i++) {
    const x = clampStageX(hero.x + i * COLOSSUS.stoneSpread + rng.range(-4, 4), 8);
    game.fx.push(createFallingStone(x, mark + (i + 1) * 0.15, COLOSSUS_HITS.stone * e.power));
  }
  sfx.chime(0);
}

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const go = e.halt <= 0 && (!foeSees(e) || gap > COLOSSUS.near * 0.7);
  e.vx = approach(e.vx, go ? e.face * COLOSSUS.pace : 0, 80 * dt);
  if (e.cd > 0 || hero.state === "dead" || !facesHero(e)) return;
  if (gap < COLOSSUS.near) startSlam(e);
  else if (gap < COLOSSUS.far) startCall(e);
}

function slam(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0 });
  const reach = e.x + e.face * COLOSSUS.slamReach;
  const box = [Math.min(e.x, reach), GROUND - 34, Math.max(e.x, reach), GROUND] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(COLOSSUS_HITS.slam * e.power, e.x);
  });
  const at = e.x + e.face * 20;
  dust(at, GROUND, 8);
  shardBurst(at, GROUND - 2, 10, VEIL.crystal);
  shake(0.25, 3);
  sfx.boom();
}

function gather(e: Enemy): void {
  particles.spawn(
    PK.SPARK,
    e.x - e.face * 6 + fxRng.range(-4, 4),
    e.y - 52 + fxRng.range(-4, 4),
    fxRng.range(-10, 10),
    -fxRng.range(10, 30),
    0.4,
    { sparks: CRYSTAL_SPARKS },
  );
}

export function updateSpirecolossus(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (fxRng.chance(0.8 * ts)) gather(e);
    if (e.st >= windTime(e)) {
      if (e.n === SLAM) slam(e);
      else Object.assign(e, { state: "summon", st: 0 });
    }
  } else if (e.state === "swipe") {
    if (e.st >= COLOSSUS.slam) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "summon") {
    if (e.st >= COLOSSUS.call) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= COLOSSUS.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.5, 2.3) * scale.cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 4 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 14);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(COLOSSUS_HITS.touch * e.power, e.x);
  });
}
