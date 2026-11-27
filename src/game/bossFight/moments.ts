import { BOSS_ENTRANCE, BOSS_FINALE, BOSS_SHIFT, BOSS_TELEGRAPH } from "../../constants/bossFight";
import { GROUND } from "../../constants/stage";
import { drillFighter } from "../../drill";
import { sfx } from "../../services/audio";
import type { Ramp } from "../../types/color";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { mix, scale, WHITE } from "../../utils/color";
import { TAU } from "../../utils/math";
import { clampStageX, summonFoe } from "../adventure";
import { createFloorRing } from "../effects/floorRing";
import { createImpact } from "../effects/impact";
import { createRift } from "../effects/rift";
import { kindOf } from "../enemies/kinds";
import { fxRng, game, hero, lights, particles } from "../state";
import { shake } from "../world";
import type { BossFight } from "./fight";

const ADD_XP_SHARE = 0.25;

const lightRamp = (light: number): Ramp => [scale(light, 0.25), scale(light, 0.55), light, mix(light, WHITE, 0.6)];

const sparkRamp = (light: number): Ramp => [WHITE, mix(light, WHITE, 0.5), light, scale(light, 0.6)];

function slowWorld(seconds: number): void {
  game.slow = Math.max(game.slow, seconds);
}

function flare(x: number, y: number, light: number, count: number, speed: number): void {
  const sparks = sparkRamp(light);
  for (let i = 0; i < count; i++) {
    const a = fxRng.range(0, TAU);
    const v = fxRng.range(speed * 0.4, speed);
    particles.spawn(PK.SPARK, x, y, Math.cos(a) * v, Math.sin(a) * v - 40, fxRng.range(0.35, 0.8), { sparks });
  }
}

export function roar(f: BossFight, boss: Enemy): void {
  const light = f.profile.light;
  game.fx.push(createFloorRing(boss.x, GROUND, BOSS_ENTRANCE.ring, lightRamp(light), 0.7));
  lights.add(f.at[0], f.at[1], BOSS_ENTRANCE.light, light, 0.9, 0.9);
  flare(f.at[0], f.at[1], light, 26, 200);
  shake(BOSS_ENTRANCE.shake.time, BOSS_ENTRANCE.shake.amp);
  slowWorld(BOSS_ENTRANCE.slow);
  sfx.boom();
  sfx.thunder();
}

function pushHeroAway(x: number): void {
  if (hero.state === "dead") return;
  const gap = hero.x - x;
  if (Math.abs(gap) > BOSS_SHIFT.push.reach) return;
  const dir = Math.sign(gap) || -hero.face;
  const vx = dir * BOSS_SHIFT.push.speed;
  Object.assign(hero, { vx, vy: BOSS_SHIFT.push.lift, ground: false });
  const fighter = drillFighter();
  if (fighter) Object.assign(fighter, { vx, vy: BOSS_SHIFT.push.lift, grounded: false });
}

export function shiftBlast(f: BossFight, boss: Enemy): void {
  const light = f.profile.light;
  const ramp = lightRamp(light);
  game.fx.push(createFloorRing(boss.x, GROUND, BOSS_SHIFT.ring, ramp, 0.6));
  game.fx.push(createFloorRing(boss.x, GROUND, BOSS_SHIFT.ring * 0.6, ramp, 0.45));
  lights.add(f.at[0], f.at[1], BOSS_ENTRANCE.light, light, 1, 0.7);
  lights.add(f.at[0], f.at[1], 30, WHITE, 1, 0.2);
  flare(f.at[0], f.at[1], light, 34, 240);
  game.flash = Math.max(game.flash, BOSS_SHIFT.flash);
  slowWorld(BOSS_SHIFT.slow);
  shake(BOSS_SHIFT.shake.time, BOSS_SHIFT.shake.amp);
  pushHeroAway(boss.x);
  sfx.boom();
  sfx.thunder();
}

export function callAdds(f: BossFight): void {
  f.profile.adds.forEach((type, i) => {
    const rift = kindOf(type).rift;
    const side = i % 2 ? 1 : -1;
    const x = clampStageX(hero.x + side * BOSS_SHIFT.addSpread, 20);
    const y = rift.y();
    game.fx.push(
      createRift(x, rift.riftY(y), rift.height, i * 0.2, () => game.enemies.push(summonFoe(type, x, y, ADD_XP_SHARE))),
    );
  });
}

export function deflect(f: BossFight, boss: Enemy): void {
  const [x, y] = f.at;
  game.fx.push(createImpact(x - boss.face * 6, y, boss.face, false, sparkRamp(f.profile.light)));
  lights.add(x, y, 26, f.profile.light, 0.6, 0.15);
  sfx.block();
}

export function burst(f: BossFight, big: boolean): void {
  const spread = big ? 0 : BOSS_FINALE.spread;
  const x = f.at[0] + fxRng.range(-spread, spread);
  const y = f.at[1] + fxRng.range(-spread, spread * 0.6);
  const light = f.profile.light;
  lights.add(x, y, big ? 90 : 46, light, 0.9, big ? 0.6 : 0.3);
  lights.add(x, y, big ? 22 : 12, WHITE, 0.9, 0.12);
  flare(x, y, light, big ? 30 : 14, big ? 220 : 150);
  shake(big ? 0.4 : 0.15, big ? 4 : 2);
  if (big) sfx.boom();
  else sfx.hit(true, fxRng.range(0.7, 1.1));
}

export function finaleFlash(f: BossFight): void {
  const light = f.profile.light;
  game.flash = Math.max(game.flash, BOSS_FINALE.flash);
  game.fx.push(createFloorRing(f.at[0], GROUND, BOSS_SHIFT.ring * 1.4, lightRamp(light), 0.9));
  lights.add(f.at[0], f.at[1], BOSS_ENTRANCE.light * 1.4, light, 1, 1.2);
  flare(f.at[0], f.at[1], light, 48, 280);
  shake(0.6, 5);
  sfx.thunder();
}

export function telegraph(f: BossFight, boss: Enemy, seconds: number): void {
  const light = f.profile.light;
  game.fx.push(createFloorRing(boss.x, GROUND, BOSS_TELEGRAPH.ring, lightRamp(light), seconds));
  lights.add(f.at[0], f.at[1], BOSS_TELEGRAPH.light, light, 0.8, seconds);
  flare(f.at[0], f.at[1], light, 10, 120);
  sfx.chargeStep(1);
}
