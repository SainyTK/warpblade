import { FIRE_RAMP } from "../../constants/palette";
import { circle, fleck, glow, hairline, line, place } from "../../engine/frame";
import type { Flask } from "../../types/effect";
import { hex, WHITE } from "../../utils/color";

/** the glass of a flask, its cork, and how fast it tumbles in radians a second */
const GLASS = { rim: hex("#7a2a14"), neck: hex("#ffd9a0"), cork: hex("#6a4a2a"), spin: 15 } as const;

/**
 * a flask of flame tumbling through the air: a round glass body with fire inside, hot at the heart, a short neck with a
 * cork that turns as it flies, and a glint on the glass. `body` and `inner` are radii; the light is `glowR` wide.
 */
export function drawFlaskBody(o: Flask, body: number, inner: number, glowR: number, glowK: number): void {
  place();
  const a = o.t * GLASS.spin * Math.sign(o.vx || 1);
  const c = Math.cos(a);
  const s = Math.sin(a);
  line(o.x + c * body * 0.8, o.y + s * body * 0.8, o.x + c * (body + 1.4), o.y + s * (body + 1.4), GLASS.neck);
  fleck(o.x + c * (body + 2), o.y + s * (body + 2), GLASS.cork);
  fleck(o.x + c * (body + 2) + 0.5, o.y + s * (body + 2), GLASS.cork);
  circle(o.x, o.y, body + 0.5, GLASS.rim);
  circle(o.x, o.y, body, FIRE_RAMP[4]);
  // the fire sloshes to the side away from the neck
  circle(o.x - c * 0.6, o.y - s * 0.6, inner, FIRE_RAMP[2]);
  circle(o.x - c * 0.8, o.y - s * 0.8, inner * 0.5, FIRE_RAMP[0]);
  hairline(o.x - body * 0.6, o.y - body * 0.5, o.x - body * 0.1, o.y - body * 0.8, WHITE);
  glow(o.x, o.y, glowR, FIRE_RAMP[4], glowK);
}
