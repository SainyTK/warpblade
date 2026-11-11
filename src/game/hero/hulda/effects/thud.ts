import { BLOW_LOOK, SLAM_LOOK, THUD_LIGHT, type ThudSize } from "../../../../constants/hulda/look";
import { WORLD_COLORS } from "../../../../constants/palette";
import type { Enemy } from "../../../../types/enemy";
import type { FistBlow } from "../../../../types/hulda";
import { lerp } from "../../../../utils/math";
import { enemyCenter } from "../../../enemies/enemy";
import { game, hero, lights } from "../../../state";
import { skin } from "../../skin";
import { createChips } from "./chips";
import { createFloorDent } from "./floorDent";
import { createShockArcs } from "./shockArcs";

/** the stone a slam knocks out of the floor, lit and dark */
const STONE = [WORLD_COLORS.slabLip, WORLD_COLORS.rubble, WORLD_COLORS.groundEdge] as const;

/** the one light of a heavy blow: small, in a saturated step of her ramp */
export function thudLight(x: number, y: number, size: ThudSize): void {
  const [radius, strength, life] = THUD_LIGHT[size];
  lights.add(x, y, radius, skin.ramp[3], strength, life);
}

/** what a landed fist throws off the foe: pressure arcs along the blow, chips, and under a haymaker a dented floor */
export function fistHit(blow: FistBlow | "hammer", foe: Enemy): void {
  const look = BLOW_LOOK[blow];
  const [ex, ey] = enemyCenter(foe);
  const dir = Math.sign(ex - hero.x) || hero.face;
  const x = lerp(hero.x + dir * 8, ex, 0.6);
  const angle = dir > 0 ? look.angle : Math.PI - look.angle;
  const seed = hero.swing;
  const ramp = skin.ramp;
  game.fx.push(
    createShockArcs({ x, y: ey, angle, size: look.size, arcs: look.arcs, streaks: look.streaks, ramp, seed }),
  );
  game.fx.push(
    createChips({
      x,
      y: ey,
      floor: hero.ground ? hero.y : foe.y,
      angle: angle - dir * 0.5,
      spread: 0.8,
      count: look.chips,
      speed: [50, 150],
      colors: [ramp[5], ramp[4], ramp[3]],
      dark: ramp[1],
      seed,
    }),
  );
  if (look.dent && hero.ground) game.fx.push(createFloorDent(x + dir * 3, hero.y, look.size * 0.7, ramp, seed));
}

/** something heavy meets the floor: a dent, rubble thrown up either side and one small light */
export function floorThud(x: number, floor: number, size: ThudSize): void {
  const look = SLAM_LOOK[size];
  const seed = Math.round(x * 3 + game.swing);
  game.fx.push(createFloorDent(x, floor, look.dent, skin.ramp, seed));
  game.fx.push(
    createChips({
      x,
      y: floor - 1,
      floor,
      angle: -Math.PI / 2,
      spread: 1.1,
      count: look.chips,
      speed: [70, 190],
      colors: STONE,
      dark: WORLD_COLORS.mortar,
      seed,
    }),
  );
  thudLight(x, floor - 4, size);
}
