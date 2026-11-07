import { W } from "../../../../constants/stage";
import { sfx } from "../../../../services/audio";
import { emberBurst } from "../../../effects/emberBurst";
import { createFloorCrack } from "../../../effects/floorCrack";
import { layCinder } from "../../../spells/rites/cinder";
import { game, hero, lights } from "../../../state";
import { hitStop, shake } from "../../../world";
import { skin } from "../../skin";

/** the crater's burning floor: a patch every this many pixels, each tick this multiple of ability power */
const CRATER_STEP = 10;
const CRATER_POWER = 0.5;

/** Skyfall: the crash lands as a burning meteor, cracking the floor wide and leaving the crater burning */
export function skyfall(v: Readonly<Record<string, number>>): void {
  const x = hero.x;
  const floor = hero.y;
  emberBurst(x, floor - 8, v.reach, floor);
  for (const side of [-1, 1])
    game.fx.push(createFloorCrack(x, Math.max(0, Math.min(W, x + side * v.reach)), floor, 400, skin.ramp));
  for (let fx = x - v.reach; fx <= x + v.reach; fx += CRATER_STEP)
    if (fx > 4 && fx < W - 4)
      layCinder(fx, floor, {
        life: v.burn,
        power: CRATER_POWER,
        halfWidth: CRATER_STEP / 2,
        overlap: 1,
        stagger: 0,
        source: "y_vault",
      });
  lights.add(x, floor - 20, 90, skin.ramp[4], 1, 0.6);
  hitStop(0.08);
  shake(0.4, 5);
  sfx.boom();
}
