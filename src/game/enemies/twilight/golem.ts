import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { eachStanding } from "../../coopHooks";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { hurtHero } from "../../hurtHero";
import { game, hero, particles, rng } from "../../state";
import { boxHit, dust, heroBox, shake } from "../../world";
import { enemyBox } from "../enemy";
import { facesHero, turnToHero } from "../facing";
import { RUNE_RAMP, RUNE_SPARKS, TWILIGHT_COLORS as TC } from "./colors";
import { createRuneWave } from "./runeWave";

/** golem blows before wave scaling */
export const GOLEM_HITS = { punch: 17, wave: 14, touch: 8 } as const;
const PUNCH_RANGE = 26;
const SLAM_RANGE = 160;
/** e.n marks a slam just landed, so the sprite keeps its fists on the floor through the recovery */
const SLAMMED = 1;

function slam(e: Enemy): void {
  const fx = e.x + e.face * 9;
  game.fx.push(createFloorRing(fx, GROUND, 26, RUNE_RAMP, 0.35));
  game.fx.push(createRuneWave(fx, e.face, GOLEM_HITS.wave * e.power));
  dust(fx - 4, GROUND, 4, -1);
  dust(fx + 4, GROUND, 4, 1);
  for (let i = 0; i < 6; i++)
    particles.spawn(PK.SHARD, fx + rng.range(-6, 6), GROUND - 1, rng.range(-70, 70), rng.range(-150, -60), 0.6, {
      col: TC.stoneLight,
      size: rng.range(1.5, 2.5),
    });
  shake(0.2, 2.5);
  sfx.boom();
}

/** Rune Golems trudge toward Kael; close in they draw back a fist and punch, further off their runes flare and they slam a rune wave along the floor */
export function updateGolem(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const ws = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, Math.abs(dx) > 8 && e.stagger <= 0 ? e.face * 18 : 0, 120 * dt);
    if (e.cd <= 0 && facesHero(e) && hero.state !== "dead") {
      if (Math.abs(dx) < PUNCH_RANGE && Math.abs(hero.y - e.y) < 30) Object.assign(e, { state: "wind", st: 0 });
      else if (Math.abs(dx) < SLAM_RANGE) Object.assign(e, { state: "charge", st: 0 });
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= 0.6 * ws.windup) {
      Object.assign(e, { state: "swipe", st: 0, vx: e.face * 60 });
      game.fx.push(createImpact(e.x + e.face * 17, e.y - 11, e.face, false, RUNE_SPARKS));
      const reach = e.face > 0 ? ([e.x, e.y - 24, e.x + 27, e.y] as const) : ([e.x - 27, e.y - 24, e.x, e.y] as const);
      eachStanding(() => {
        if (boxHit(reach, heroBox())) hurtHero(GOLEM_HITS.punch * e.power, e.x);
      });
      sfx.swing(0.35);
    }
  } else if (e.state === "swipe") {
    if (e.st >= 0.22) Object.assign(e, { state: "recover", st: 0, n: 0 });
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (rng.chance(0.3 * ts))
      particles.spawn(PK.EMBER, e.x + rng.range(-8, 8), e.y - rng.range(4, 20), 0, -20, 0.4, { sparks: RUNE_SPARKS });
    if (e.st >= 0.8 * ws.windup) {
      Object.assign(e, { state: "recover", st: -0.2, n: SLAMMED });
      slam(e);
    }
  } else if (e.st >= 0.75) Object.assign(e, { state: "walk", st: 0, n: 0, cd: rng.range(1.3, 2.3) * ws.cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 5 * dt;
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  e.y = GROUND;
  if (rng.chance(0.05 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-7, 7), e.y - rng.range(6, 18), 0, -8, rng.range(0.4, 0.8), {
      sparks: RUNE_SPARKS,
    });
  eachStanding(() => {
    if (e.state === "walk" && e.stagger <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(GOLEM_HITS.touch * e.power, e.x);
  });
}
