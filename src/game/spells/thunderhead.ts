import { THUNDERHEAD as T } from "../../constants/evolutions";
import { PAL } from "../../constants/palette";
import { W } from "../../constants/stage";
import { circle, glow, place } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";
import { clamp, ease } from "../../utils/math";
import { enemyCenter } from "../enemies/enemy";
import { game } from "../state";
import { surfaceBelow } from "../world";
import { createLightning, STRIKE } from "./lightning";

/** the puff's overlapping discs: offset from its centre and radius, at full size */
const PUFF: readonly (readonly [number, number, number])[] = [
  [-12, 1, 3.5],
  [-5, -0.5, 4.5],
  [3, -1, 4.5],
  [10, 0.5, 4],
  [14.5, 2, 3],
];
/** the lit underside, where the bolts leave the cloud, sits this far under the puff's centre */
const UNDERSIDE = T.height / 2 + 2;

const live = (): Enemy[] => game.enemies.filter((e) => e.hp > 0);

/** the live foe nearest the cloud along the floor, within `reach` if given */
function nearestFoe(x: number, reach = Number.POSITIVE_INFINITY): Enemy | null {
  let best: Enemy | null = null;
  let bestD = reach;
  for (const e of live()) {
    const d = Math.abs(enemyCenter(e)[0] - x);
    if (d > bestD) continue;
    best = e;
    bestD = d;
  }
  return best;
}

/** a steady stepped flicker for the cloud's inner light, the same at any frame rate */
const flicker = (t: number): number =>
  T.flicker[0] + ((T.flicker[1] - T.flicker[0]) * ((Math.floor(t * 12) * 3) % 4)) / 3;

/** Thunderhead: a storm cloud gathers over the strike, drifts toward foes and calls three more bolts down on them, then fades.
 *  `ap` is the ability power of the cast, with Spellblade's boost if it had one. */
export function createThunderhead(x: number, ap: number): Effect {
  const V = PAL.volt;
  const last = T.strikes[T.strikes.length - 1];
  const cloud = { x: clamp(x, T.margin, W - T.margin), y: T.y };
  // seconds since the main strike: the cloud gathers once it lands
  let t = -STRIKE;
  let called = 0;
  const callBolt = () => {
    const target = nearestFoe(cloud.x, T.reach);
    const bottom = cloud.y + UNDERSIDE;
    game.fx.push(
      createLightning(target, [cloud.x, surfaceBelow(cloud.x, bottom)], {
        damage: T.power * ap,
        arcDamage: T.arcPower * ap,
        arcs: T.arcs,
        shock: T.shock,
        glow: T.glow,
        fromY: bottom,
        skyFlash: false,
        source: "abilities",
      }),
    );
  };
  return {
    update(dt) {
      t += dt;
      if (t < 0) return true;
      const foe = nearestFoe(cloud.x);
      if (foe) {
        const dx = enemyCenter(foe)[0] - cloud.x;
        cloud.x = clamp(cloud.x + Math.sign(dx) * Math.min(Math.abs(dx), T.drift * dt), T.margin, W - T.margin);
      }
      // each bolt is called a crackle early, so it lands on its beat
      if (called < T.strikes.length && t >= T.strikes[called] - STRIKE) {
        called++;
        callBolt();
      }
      return t < last + T.fade;
    },
    draw() {
      if (t < 0) return;
      place();
      const k = ease.outCubic(clamp(t / T.grow));
      const a = 1 - clamp((t - last) / T.fade);
      const warned = T.strikes.some((s) => t >= s - T.warn && t < s);
      const under = warned ? V[4] : V[3];
      const lip = warned ? WHITE : V[4];
      for (const [dx, dy, r] of PUFF) circle(cloud.x + dx * k, cloud.y + (dy - 1) * k, r * k, V[1], a);
      for (const [dx, dy, r] of PUFF) circle(cloud.x + dx * k, cloud.y + (dy + 2.5) * k, r * k, under, a);
      // a bright lip along the lit underside, so the cloud reads as lit from below by its own bolts
      for (const [dx, dy, r] of PUFF) circle(cloud.x + dx * k, cloud.y + (dy + 3) * k, r * 0.6 * k, lip, a);
      for (const [dx, dy, r] of PUFF) circle(cloud.x + dx * k, cloud.y + dy * k, r * k, V[0], a);
      glow(cloud.x, cloud.y + 2, T.light * k, V[2], flicker(t) * a * (warned ? 1.6 : 1));
    },
  };
}
