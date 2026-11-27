import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillEvolved, skillLevel, skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { DUSK_RAMP, NIGHT_RAMP } from "../../look/colors";
import { createDuskWave } from "../effects/duskWave";
import { vesperFx } from "../skillFx";
import { vesper } from "../state";
import { gainTempo, tempoMost } from "../tempo";

const ID = "ve_warp";
/** Twin Throw's ring: both blades cut every foe this close to where she lands */
const TWIN_REACH = 40;

/**
 * Thrown Dusk, after the arrival: more Tempo, the foes opened as by a parry, the short blade thrown on as a wave, and as
 * Twin Throw a ring cut round her and Tempo to the top.
 */
export function warpArrived(_foe: Enemy | null): void {
  const v = skillValues(ID);
  if (skillLevel(ID)) {
    const twin = skillEvolved(ID) ? (v.twin ?? 0) : 0;
    vesperFx(ID, { x: hero.x, y: hero.y, face: hero.face }, { damage: progress.stats.ad * (1 + (v.wave ?? 0) + twin) });
  }
  if (v.tempo) gainTempo(v.tempo);
  if (v.open) vesper.opened = Math.max(vesper.opened, v.open);
  if (v.wave)
    game.fx.push(
      createDuskWave({
        x: hero.x + hero.face * 10,
        y: hero.y - 18,
        face: hero.face,
        rise: 0,
        damage: progress.stats.ad * v.wave,
        speed: 240,
        life: 0.45,
        struck: new Set<Enemy>(),
        ramp: NIGHT_RAMP,
      }),
    );
  if (!skillEvolved(ID)) return;
  game.fx.push(createFloorRing(hero.x, hero.y, TWIN_REACH, DUSK_RAMP, 0.4));
  for (const e of game.enemies) {
    if (e.hp <= 0 || Math.abs(e.x - hero.x) > TWIN_REACH || Math.abs(enemyCenter(e)[1] - (hero.y - 16)) > TWIN_REACH)
      continue;
    dealDamage(e, progress.stats.ad * v.twin, {
      fromX: hero.x,
      kx: Math.sign(e.x - hero.x) * 80,
      ky: -60,
      heavy: true,
      melee: true,
    });
  }
  gainTempo(tempoMost());
}
