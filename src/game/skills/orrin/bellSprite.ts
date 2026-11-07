import { PAL } from "../../../constants/palette";
import { ellipseRing, glow, line, place, px } from "../../../engine/frame";
import { ramp, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { drawLinks } from "../../effects/orrin/chainLinks";
import { game } from "../../state";
import { BELL_TIME, type Bell, bellAngle, bellChain, bellMouth, tollReach } from "./bellShape";

/** old bronze, deep shadow to glint */
const BRONZE = ramp(["#24140a", "#4e2c12", "#7e4a1c", "#b0702a", "#d89a48", "#f4cc84", "#fff0c8"]);

/** how open the bell's rift is, 0 to 1: it opens as the bell drops and closes once it has risen back */
function riftOpen(b: Bell): number {
  if (b.phase === "drop") return clamp(b.t / (BELL_TIME.drop * 0.5));
  if (b.phase === "rise") return clamp(1 - (b.t - BELL_TIME.rise * 0.6) / (BELL_TIME.rise * 0.4));
  return 1;
}

/** the small volt rift the bell hangs from, behind the foes */
export function drawBellRift(b: Bell): void {
  const open = riftOpen(b);
  if (open <= 0) return;
  place();
  const V = PAL.volt;
  const w = (5 + 2 * b.size) * open;
  line(b.x - w, b.y, b.x + w, b.y, V[2]);
  line(b.x - w * 0.6, b.y - 1, b.x + w * 0.6, b.y - 1, V[1], 0.8);
  line(b.x - w * 0.6, b.y + 1, b.x + w * 0.6, b.y + 1, V[3], 0.8);
  px(b.x, b.y, WHITE);
  glow(b.x, b.y, 14 * b.size, V[2], 0.4 * open);
}

/**
 * The bell on its chain: links from the rift down to the crown, then a bronze bell flaring from a narrow shoulder to a
 * wide lip, lit on the side the light comes from, with a dark mouth and a clapper. Twice the size as a Great Bell.
 */
export function drawBell(b: Bell): void {
  place();
  const a = bellAngle(b);
  const len = bellChain(b);
  const ux = Math.sin(a);
  const uy = Math.cos(a);
  const crownX = b.x + ux * len;
  const crownY = b.y + uy * len;
  if (len > 1) drawLinks(b.x, b.y, crownX, crownY);
  const s = b.size;
  const height = 8 * s;
  // across the bell, at right angles to the chain
  const nx = uy;
  const ny = -ux;
  for (let i = 0; i <= height * 2; i++) {
    const d = i / 2;
    const k = d / height;
    // the bell's profile: a rounded crown, a straight waist, a flared lip
    const half = s * (2 + 1.5 * k + (k > 0.75 ? (k - 0.75) * 8 : 0));
    const cx = crownX + ux * d;
    const cy = crownY + uy * d;
    for (let j = -Math.ceil(half * 2); j <= Math.ceil(half * 2); j++) {
      const w = j / 2;
      if (Math.abs(w) > half) continue;
      const edge = Math.abs(w) > half - 0.75 || d < 0.75 || d > height - 0.75;
      const lit = -w / half;
      const shadeIdx = edge ? 0 : clamp(Math.round(3 + lit * 2 - k * 0.8), 1, 5);
      px(cx + nx * w, cy + ny * w, BRONZE[shadeIdx]);
    }
  }
  // a raised band near the lip, the dark mouth and the clapper hanging in it
  const lipX = crownX + ux * (height - 1.5 * s);
  const lipY = crownY + uy * (height - 1.5 * s);
  line(lipX - nx * 3 * s, lipY - ny * 3 * s, lipX + nx * 3 * s, lipY + ny * 3 * s, BRONZE[2]);
  const [mx, my] = bellMouth(b);
  line(mx - nx * 3.5 * s, my - ny * 3.5 * s, mx + nx * 3.5 * s, my + ny * 3.5 * s, BRONZE[0]);
  // the clapper lags behind the swing
  const lag = Math.sin(game.t * 20) * 0.6;
  px(mx + nx * lag, my + ny * lag + 1, PAL.brass[2]);
  // a glint on the shoulder
  px(crownX + ux * 2 * s - nx * s, crownY + uy * 2 * s - ny * s, BRONZE[6]);
  if (b.flash > 0) glow(mx, my, 10 * s, PAL.brass[4], 0.6 * (b.flash / 0.12));
}

/** the toll: a brass ring of sound spreading from the bell's mouth */
export function drawToll(b: Bell): void {
  const r = tollReach(b);
  if (r <= 0) return;
  place();
  const [mx, my] = bellMouth(b);
  const fade = 1 - b.t / BELL_TIME.toll;
  ellipseRing(mx, my, r, r * 0.55, PAL.brass[4], 0.7 * fade);
  ellipseRing(mx, my, r * 0.75, r * 0.4, PAL.brass[3], 0.45 * fade);
  glow(mx, my, r * 0.6, PAL.brass[3], 0.25 * fade);
}
