import { createFloorRing } from "../../../game/effects/floorRing";
import { createSlash } from "../../../game/effects/slash";
import { drawThrownBlade } from "../../../game/effects/thrownWeapon";
import { warpSlash } from "../../../game/hero/warp";
import { meleeHit } from "../../../game/meleeHit";
import { skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { boxAhead, newSwing } from "../../../game/world";
import type { WarpStyle } from "../../../types/moveset";
import { CRIMSON } from "../constants/colors";
import { SLASH } from "../constants/slashes";
import { ARRIVAL_RING, THROWN_SPIN } from "../constants/warp";
import { brynnFx, SPUN } from "./fx";

/** half of Anvilheart's length from the point, the middle it spins round */
const MIDDLE = 15;

/** the greatsword in flight, turning end over end round its middle */
function drawThrown(x: number, y: number, angle: number, t: number): void {
  const cx = x - Math.cos(angle) * MIDDLE;
  const cy = y - Math.sin(angle) * MIDDLE;
  const spun = angle + t * THROWN_SPIN;
  drawThrownBlade(cx + Math.cos(spun) * MIDDLE, cy + Math.sin(spun) * MIDDLE, spun);
}

/** the arrival: an overhead chop at the shared power */
function strike(power: number, _foe: unknown, sureCrit: boolean): void {
  warpSlash();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, SLASH.chop));
  meleeHit([boxAhead(-6, -44, 34, 4)], { power, kx: 120, ky: -70, big: true, sureCrit });
}

/** after the chop: a small shock ring round her knocks foes off their feet */
function arrived(): void {
  const v = skillValues("br_spin");
  const reach = withBuild("area", ARRIVAL_RING.reach + (v.ring ?? 0));
  newSwing();
  game.fx.push(createFloorRing(hero.x, hero.y, reach, CRIMSON, 0.35));
  const power = progress.stats.ad * (ARRIVAL_RING.power + (v.ringPower ?? 0));
  brynnFx(
    "br_spin",
    "slash",
    { x: hero.x + hero.face * 12, y: hero.y - 18, face: hero.face, reach: 20 },
    { damage: power * 2, signature: SPUN },
  );
  brynnFx("br_spin", "nova", { x: hero.x, y: hero.y, reach: reach * 0.7 }, { damage: power, quiet: true });
  meleeHit([boxAhead(-reach, -24, reach, 4)], {
    power: ARRIVAL_RING.power + (v.ringPower ?? 0),
    kx: 60,
    ky: -40,
    stun: ARRIVAL_RING.stun,
  });
}

/** Brynn's warp: Anvilheart thrown spinning, an overhead chop on arrival and a shock ring; Spinning Throw tunes it */
export const BRYNN_WARP: WarpStyle = {
  drawThrown,
  strike,
  arrived,
  tune: () => skillValues("br_spin"),
};
