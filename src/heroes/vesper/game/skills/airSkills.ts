import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { NIGHT_RAMP } from "../../look/colors";
import { createDuskWave } from "../effects/duskWave";
import { nightLanding } from "./fallingNight";

const ID = "ve_sky";
/** Sky Ribbon's floor waves from the nightfall's landing */
const FLOOR_WAVE = { speed: 210, life: 0.4, half: 6 } as const;
/** the feather and the ribbon climb this many pixels for each pixel they fly, toward foes in the air */
const RIBBON_RISE = -0.5;

/** the nightfall landed on these foes: Sky Ribbon's waves along the floor each way, and Falling Night's share */
export function nightfallLanded(foes: readonly Enemy[]): void {
  const v = skillValues(ID);
  if (v.waves)
    for (const face of [-1, 1])
      game.fx.push(
        createDuskWave({
          x: hero.x + face * 10,
          y: hero.y - 6,
          face,
          rise: 0,
          damage: progress.stats.ad * v.waves,
          speed: FLOOR_WAVE.speed,
          life: FLOOR_WAVE.life,
          half: FLOOR_WAVE.half,
          struck: new Set<Enemy>(),
        }),
      );
  nightLanding(foes);
}

/**
 * Sky Ribbon, when an air blow of hers lands: the foes it struck are kept rising, at the top of Tempo a feather of dusk
 * flies on to cut one more foe, and as Heaven's Ribbon a ribbon of night flies both ways and cuts every foe on its line.
 */
export function airBlowLanded(foes: readonly Enemy[], top: boolean): void {
  const v = skillValues(ID);
  if (v.lift) for (const e of foes) if (e.air) e.vy = Math.min(e.vy, -v.lift);
  if (!(v.feather && top) && !skillEvolved(ID)) return;
  const struck = new Set<Enemy>(foes);
  const damage = progress.stats.ad * (skillEvolved(ID) ? v.ribbon : v.feather);
  for (const face of skillEvolved(ID) ? [-1, 1] : [hero.face])
    game.fx.push(
      createDuskWave({
        x: hero.x,
        y: hero.y - 22,
        face,
        rise: RIBBON_RISE,
        damage,
        speed: 260,
        life: 0.5,
        half: 5,
        struck,
        ramp: NIGHT_RAMP,
        most: skillEvolved(ID) ? undefined : 1,
      }),
    );
}
