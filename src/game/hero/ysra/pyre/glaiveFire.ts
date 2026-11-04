import { RITE_RAMP, RITE_SPARKS } from "../../../../constants/ysra/emberLook";
import { PF, PK } from "../../../../types/particle";
import { bladeAngle } from "../../../../utils/poseFrame";
import { hero, lights, particles, rng } from "../../../state";
import { skin } from "../../skin";
import { overheatLeft, searing } from "./heat";

/** the blade head is the last this many pixels of the glaive */
const HEAD = 8;

/** a point on the blade head, in world pixels, from the hand as last drawn */
function bladePoint(along: number): [number, number] {
  const a = bladeAngle(hero.pose);
  const d = skin.reach - HEAD * along;
  const [hx, hy] = hero.hand;
  return [hero.x + hero.face * (hx + Math.cos(a) * d), hero.y + hy + Math.sin(a) * d];
}

/** Searing Edge: flames lick off the glaive's head while it burns, thicker in Overheat */
export function burnGlaive(): void {
  if (!searing() || !hero.hasSword) return;
  const fierce = overheatLeft() > 0;
  const n = fierce ? 3 : 1;
  for (let i = 0; i < n; i++) {
    if (!fierce && !rng.chance(0.7)) continue;
    const [x, y] = bladePoint(rng.range(0, 1));
    particles.spawn(PK.FIRE, x, y, rng.range(-8, 8), -rng.range(10, 30), rng.range(0.12, 0.24), {
      col: 0,
      size: rng.range(0.8, fierce ? 1.8 : 1.3),
      flag: fierce && rng.chance(0.2) ? PF.SMOKES : 0,
    });
  }
  if (rng.chance(fierce ? 0.3 : 0.1)) {
    const [x, y] = bladePoint(rng.range(0, 1));
    particles.spawn(PK.EMBER, x, y, rng.range(-20, 20), -rng.range(20, 50), rng.range(0.4, 0.8), {
      sparks: RITE_SPARKS,
    });
  }
  const [tx, ty] = bladePoint(0.5);
  lights.add(tx, ty, fierce ? 22 : 14, RITE_RAMP[4], fierce ? 0.5 : 0.3, 1 / 60);
}
