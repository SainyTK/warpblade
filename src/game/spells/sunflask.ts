import { SUNFLASK } from "../../constants/evolutions";
import { FIRE_RAMP } from "../../constants/palette";
import { FLASK_THROW } from "../../constants/spells";
import { circle, glow, place, px } from "../../engine/frame";
import type { Blast, Effect, Flask } from "../../types/effect";
import { WHITE } from "../../utils/color";
import { clamp, lobSpeed } from "../../utils/math";
import { enemyCenter } from "../enemies/enemy";
import { game } from "../state";
import { surfaceBelow } from "../world";
import { explode } from "./explosion";
import { flaskBurst, flyFlask, trailFlask } from "./flask";

/** the evolved flask: bigger, brighter, with a 2 x 2 white core */
export function drawSunflask(o: Flask): void {
  const f = SUNFLASK.flask;
  place();
  circle(o.x, o.y, f.body, FIRE_RAMP[4]);
  circle(o.x - 0.5, o.y - 0.5, f.inner, FIRE_RAMP[1]);
  for (const [dx, dy] of [
    [-1, -1],
    [0, -1],
    [-1, 0],
    [0, 0],
  ])
    px(o.x + dx, o.y + dy, WHITE);
  glow(o.x, o.y, f.glow, FIRE_RAMP[4], f.glowK);
}

/** one small flask thrown out of a Sunflask burst, bursting on its own with a smaller blast */
function createChildFlask(x: number, y: number, vx: number, vy: number, blast: Blast): Effect {
  const c = SUNFLASK.child;
  const o: Flask = { x, y, vx, vy, t: 0 };
  return {
    update(dt) {
      flyFlask(o, dt);
      trailFlask(o, c.trail, 1.6);
      const at = flaskBurst(o, dt, 2) ?? (o.t >= c.life ? o.y : null);
      if (at === null) return true;
      explode(o.x, at, blast);
      return false;
    },
    draw() {
      place();
      circle(o.x, o.y, c.body, FIRE_RAMP[4]);
      circle(o.x - 0.5, o.y - 0.5, c.body * 0.6, FIRE_RAMP[2]);
      px(o.x - 1, o.y - 1, WHITE);
      glow(o.x, o.y, 12, FIRE_RAMP[4], 0.4);
    },
  };
}

/** where each child flask aims: the centres of the live foes nearest the burst, nearest first and wrapping when there are fewer than three;
 *  with none in reach, fixed spots on the floor or ledge around the burst */
function childTargets(x: number, y: number, face: number): [number, number][] {
  const near = game.enemies
    .filter((e) => e.hp > 0)
    .map(enemyCenter)
    .filter(([ex]) => Math.abs(ex - x) <= SUNFLASK.reach)
    .sort((a, b) => Math.abs(a[0] - x) - Math.abs(b[0] - x));
  if (!near.length)
    return SUNFLASK.fallback.map((dx) => {
      const tx = x + dx * face;
      return [tx, surfaceBelow(tx, y)];
    });
  return SUNFLASK.fallback.map((_, i) => near[i % near.length]);
}

/** the follow-through of a Sunflask burst: three child flasks lob low out of the blast at the foes nearest it, each a smaller copy of it.
 *  Called after the main blast has dealt its damage, so foes it slew are passed over. */
export function launchChildFlasks(x: number, y: number, face: number, main: Blast): void {
  const c = SUNFLASK.child;
  const blast: Blast = {
    radius: main.radius * c.radius,
    damage: main.damage * c.damage,
    burn: main.burn,
    brands: c.brands,
    shake: c.shake,
    amp: c.amp,
    hitStop: c.hitStop,
    source: main.source,
  };
  const t = SUNFLASK.flight;
  const fromY = y - 4;
  for (const [tx, ty] of childTargets(x, fromY, face)) {
    const vx = clamp((tx - x) / t, -SUNFLASK.maxVx, SUNFLASK.maxVx);
    const vy = lobSpeed(ty - fromY, t, FLASK_THROW.gravity);
    game.fx.push(createChildFlask(x, fromY, vx, vy, blast));
  }
}
