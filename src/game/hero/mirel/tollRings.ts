import { STAFF_BLOWS } from "../../../constants/mirel/string";
import { PAL } from "../../../constants/palette";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { createFloorRing } from "../../effects/floorRing";
import { game, lights } from "../../state";
import { ringCentre, type StrikePlace } from "./shape";
import { type StaffStrike, strikeShape } from "./strike";

/** Midnight: twelve rings over this long, each this share of Toll, the twelfth this share */
const MIDNIGHT = { rings: 12, over: 1.2, share: 0.4, last: 3 } as const;

/** Toll's ring struck once more at another place, each foe there once, with its ring of light */
export function ringTollAt(s: StaffStrike, at: StrikePlace, scale = 1): void {
  const struck = new Set<Enemy>();
  const strike: StaffStrike = { ...s, at, scale: s.scale * scale, echo: false };
  strikeShape(
    strike,
    (e) => struck.has(e),
    (e) => struck.add(e),
  );
  const shape = STAFF_BLOWS.toll.shape;
  if (shape.kind !== "ring") return;
  const [cx, cy] = ringCentre(shape, at);
  game.fx.push(createFloorRing(cx, cy, shape.radius + s.grow, PAL.hour, 0.3, 0.6));
  lights.add(cx, cy, 30, PAL.hour[3], 0.45, 0.15);
}

/** Midnight: Toll rings twelve times where it struck, the twelfth hardest */
function createMidnight(s: StaffStrike): Effect {
  let t = 0;
  let rung = 0;
  return {
    update(dt) {
      t += dt;
      while (rung < MIDNIGHT.rings && t >= (MIDNIGHT.over * (rung + 1)) / MIDNIGHT.rings) {
        rung++;
        ringTollAt(s, s.at, rung === MIDNIGHT.rings ? MIDNIGHT.last : MIDNIGHT.share);
      }
      return rung < MIDNIGHT.rings;
    },
    draw() {},
  };
}

/** Midnight begins where Toll struck */
export function ringMidnight(s: StaffStrike): void {
  game.fx.push(createMidnight(s));
}
