import { GROUND } from "../../../../constants/stage";
import {
  castShadow,
  ellipseRing,
  glow,
  hairline,
  place,
  polygon,
  toScreenX,
  toScreenY,
} from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { clamp } from "../../../../utils/math";
import { shardBurst } from "../burst";
import { VEIL } from "../colors";
import { COLOSSUS } from "./constants";

const S = VEIL.stone;
const DROP = 0.22;
const TOP = -12;

export function createFallingStone(x: number, mark: number, damage: number): Effect {
  let t = 0;
  let landed = false;
  const half = COLOSSUS.stoneHalf;
  const struck = new Set<number>();
  const y = () => {
    const u = clamp((t - (mark - DROP)) / DROP);
    return TOP + (GROUND - 6 - TOP) * u * u;
  };
  return {
    update(dt) {
      t += dt;
      if (t >= mark - DROP && !landed)
        eachStanding(() => {
          const cy = y();
          if (struck.has(heroSlot()) || !boxHit([x - half, cy - 6, x + half, cy + 6], heroBox())) return;
          struck.add(heroSlot());
          hurtHero(damage, x);
        });
      if (t >= mark && !landed) {
        landed = true;
        sfx.boom();
        dust(x, GROUND, 6);
        shardBurst(x, GROUND - 4, 8, S);
      }
      return t < mark + 0.3;
    },
    draw() {
      place();
      const k = clamp(t / mark);
      if (!landed) {
        castShadow(x, GROUND, half * (0.6 + k * 0.6), 1.8, 0.3 + 0.5 * k);
        ellipseRing(x, GROUND - 0.5, half + 1, 1.8, VEIL.rune[2 + Math.round(k * 2)], 0.3 + 0.7 * k);
      }
      if (t < mark - DROP && !landed) return;
      const cy = landed ? GROUND - 5 : y();
      const fade = landed ? 1 - (t - mark) / 0.3 : 1;
      polygon(
        [
          [x - half, cy - 3],
          [x - half + 3, cy - 6],
          [x + half - 1, cy - 5],
          [x + half, cy + 2],
          [x + half - 3, cy + 5],
          [x - half + 1, cy + 4],
        ],
        (sx, sy = 0) => (sy < toScreenY(cy - 1) ? S[4] : sx < toScreenX(x) ? S[3] : S[2]),
        fade,
      );
      hairline(x - half + 2, cy - 1, x + half - 2, cy, VEIL.rune[3], fade);
      glow(x, cy, 10, VEIL.rune[2], 0.3 * fade);
    },
  };
}
