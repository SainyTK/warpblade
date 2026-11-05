import { PAL } from "../../../constants/palette";
import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { eachStanding } from "../../coopHooks";
import { createFloorRing } from "../../effects/floorRing";
import { hurtHero } from "../../hurtHero";
import { game, hero, particles, rng } from "../../state";
import { boxHit, dust, heroBox, shake } from "../../world";
import { facesHero, turnToHero } from "../facing";
import { MUD_SPARKS, RAIN_HITS } from "./colors";
import { createMudGlob } from "./mudGlob";
import { createMudWave } from "./mudWave";

/** seconds each attack gathers before scaling: the two-fisted slam, the mud wave, the lobbed globs */
export const HULK_WINDUP = { slam: 0.65, wave: 0.7, globs: 0.8 } as const;
const SLAM_REACH = 46;

const enraged = (e: Enemy): boolean => e.hp < e.max * 0.5;

function slam(e: Enemy): void {
  const x = e.x + e.face * 24;
  game.fx.push(createFloorRing(x, GROUND, 30, PAL.shadow, 0.45));
  dust(x - 6, GROUND, 6, -1);
  dust(x + 6, GROUND, 6, 1);
  for (let i = 0; i < 12; i++)
    particles.spawn(PK.SPARK, x + rng.range(-12, 12), GROUND - 2, rng.range(-120, 120), -rng.range(80, 200), 0.5, {
      sparks: MUD_SPARKS,
    });
  shake(0.3, 3);
  sfx.boom();
  const reach =
    e.face > 0 ? ([e.x, e.y - 40, e.x + SLAM_REACH, e.y] as const) : ([e.x - SLAM_REACH, e.y - 40, e.x, e.y] as const);
  eachStanding(() => {
    if (boxHit(reach, heroBox())) hurtHero(RAIN_HITS.hulkSlam * e.power, e.x);
  });
}

function lob(e: Enemy): void {
  const spread = enraged(e) ? [-36, -12, 12, 36] : [-26, 0, 26];
  spread.forEach((off, i) => {
    const tx = clamp(hero.x + off, 12, W - 12);
    game.fx.push(createMudGlob(e.x - e.face * 4, e.y - 44, tx, 0.85 + i * 0.08, RAIN_HITS.hulkGlob * e.power, null));
  });
  sfx.swing(0.5);
}

/**
 * The Bog Hulk: a hill of bog mud and reeds. Up close it lifts both fists and slams the floor ahead; from mid range it
 * scoops a wave of mud that rolls along the floor; from afar it lobs globs at marked spots. Below half health it
 * sends a second wave and an extra glob.
 */
export function updateBoghulk(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const scale = waveScale(game.wave);
  const fast = enraged(e) ? 0.75 : 1;
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, Math.abs(dx) > 12 ? e.face * (enraged(e) ? 26 : 18) : 0, 140 * dt);
    if (e.cd <= 0 && facesHero(e) && hero.state !== "dead") {
      if (Math.abs(dx) < 40) Object.assign(e, { state: "wind", st: 0 });
      else if (Math.abs(dx) < 140 && hero.ground && rng.chance(0.6)) Object.assign(e, { state: "charge", st: 0 });
      else Object.assign(e, { state: "volley", st: 0 });
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= HULK_WINDUP.slam * fast * scale.windup) {
      Object.assign(e, { state: "swipe", st: 0 });
      slam(e);
    }
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= HULK_WINDUP.wave * fast * scale.windup) {
      game.fx.push(createMudWave(e.x + e.face * 18, e.face, RAIN_HITS.hulkWave * e.power));
      if (enraged(e)) game.fx.push(createMudWave(e.x + e.face * 18, e.face, RAIN_HITS.hulkWave * e.power, 0.55));
      dust(e.x + e.face * 18, GROUND, 6, e.face);
      shake(0.15, 1.5);
      sfx.swing(0.4);
      Object.assign(e, { state: "shoot", st: 0 });
    }
  } else if (e.state === "volley") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= HULK_WINDUP.globs * fast * scale.windup) {
      lob(e);
      Object.assign(e, { state: "shoot", st: 0 });
    }
  } else if (e.state === "swipe" || e.state === "shoot") {
    if (e.st >= 0.35) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.75)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1, 1.8) * (enraged(e) ? 0.7 : 1) * scale.cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 4 * dt;
  e.x = clamp(e.x + e.vx * dt, 16, W - 16);
  e.y = GROUND;
  if (rng.chance(0.12 * ts))
    particles.spawn(PK.SPARK, e.x + rng.range(-12, 12), e.y - rng.range(10, 30), 0, 20, rng.range(0.3, 0.6), {
      sparks: MUD_SPARKS,
    });
}
