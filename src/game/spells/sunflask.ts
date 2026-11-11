import { SUNFLASK } from "../../constants/evolutions";
import { FIRE_RAMP } from "../../constants/palette";
import { FLASK_THROW } from "../../constants/spells";
import { hairline, place } from "../../engine/frame";
import type { Blast, Effect, Flask } from "../../types/effect";
import { clamp, lobSpeed, TAU } from "../../utils/math";
import { enemyCenter } from "../enemies/enemy";
import { game } from "../state";
import { surfaceBelow } from "../world";
import { explode } from "./explosion";
import { flaskBurst, flyFlask, trailFlask } from "./flask";
import { drawFlaskBody } from "./flaskArt";

/** the rays about a Sunflask: how many, how long, and how fast they turn in radians a second */
const CORONA = { rays: 8, length: 3, turn: 5 } as const;

/** the evolved flask: bigger, brighter, with a 2 x 2 white core */
export function drawSunflask(o: Flask): void {
  const f = SUNFLASK.flask;
  drawFlaskBody(o, f.body, f.inner, f.glow, f.glowK);
  place();
  // a sun's corona: short rays turning about the flask
  for (let i = 0; i < CORONA.rays; i++) {
    const a = (i / CORONA.rays) * TAU + o.t * CORONA.turn;
    const r0 = f.body + 1.5;
    const r1 = r0 + CORONA.length * (i % 2 ? 0.6 : 1);
    hairline(
      o.x + Math.cos(a) * r0,
      o.y + Math.sin(a) * r0,
      o.x + Math.cos(a) * r1,
      o.y + Math.sin(a) * r1,
      (u) => FIRE_RAMP[u < 0.5 ? 1 : 3],
    );
  }
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
      drawFlaskBody(o, c.body, c.body * 0.6, 11, 0.35);
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
