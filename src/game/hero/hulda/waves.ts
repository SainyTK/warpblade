import { KNUCKLE_WAVE } from "../../../constants/hulda/knuckleWave";
import type { FistBlow } from "../../../types/hulda";
import { createKnuckleWave } from "../../effects/knuckleWave";
import { skillLevel, skillValues, withCharms } from "../../skills/query";
import { game, hero } from "../../state";
import { skin } from "../skin";

const ID = "h_knuckleWave";
/** the blows that send a wave at each `blows` value: the haymaker, then the hook too, then every blow */
const SENDS: Readonly<Record<FistBlow, number>> = { haymaker: 1, hook: 2, jab: 3 };

/** Knuckle Wave: a blow on its hit frame pushes a wave ahead, and the evolved one a second wave behind */
export function sendWaves(blow: FistBlow): void {
  if (!skillLevel(ID)) return;
  const v = skillValues(ID);
  if (v.blows < SENDS[blow]) return;
  const dirs = v.both ? [hero.face, -hero.face] : [hero.face];
  for (const dir of dirs) {
    const spec = {
      x: hero.x + dir * KNUCKLE_WAVE.from,
      floor: hero.y,
      dir,
      reach: withCharms("area", v.reach),
      power: v.power,
      pierce: v.pierce === 1,
      stagger: v.stagger,
      ring: v.ring ? withCharms("area", v.ring) : 0,
    };
    game.fx.push(createKnuckleWave(spec, skin.ramp));
  }
}
