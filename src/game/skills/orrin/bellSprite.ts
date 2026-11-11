import { BELL_LOOK, TEAR_LOOK } from "../../../constants/orrin/chainLook";
import { PAL } from "../../../constants/palette";
import { glow, place } from "../../../engine/frame";
import { ramp } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { fineRing } from "../../effects/fine";
import { drawLinks } from "../../effects/orrin/chainLinks";
import { drawTear } from "../../effects/orrin/tearLens";
import { drawTurned } from "../../effects/orrin/turned";
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
  const look = TEAR_LOOK.bell;
  drawTear(b.x, b.y, { ...look, tall: look.tall + 2 * b.size, light: look.light * b.size }, open, game.t, true);
}

/** the bell's half width at a share `k` of the way from its crown to its lip: a round crown, a waist, a flared lip */
const bellHalf = (k: number, s: number): number =>
  s * (1.2 + 2.4 * Math.sqrt(Math.min(1, k * 3)) * 0.6 + 1.3 * k + (k > 0.75 ? (k - 0.75) * 8 : 0));

/**
 * The bell on its chain: links from the rift down to the crown, then a bronze bell at full detail, flaring from a round
 * crown to a wide lip, lit down one side and dark down the other, with a raised band above the lip, a dark mouth and a
 * clapper that lags behind the swing. Twice the size as a Great Bell.
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
  const height = BELL_LOOK.tall * s;
  const lag = Math.sin(game.t * 20) * 0.6 * s;
  drawTurned(crownX, crownY, ux, uy, height + 4 * s, (d, w) => {
    // the clapper hangs out of the mouth, below the lip
    if (d > height) return (d - height - s) ** 2 + (w - lag) ** 2 <= (0.9 * s) ** 2 ? PAL.brass[2] : 0;
    if (d < -0.5) return 0;
    const k = Math.max(0, d) / height;
    const half = bellHalf(k, s);
    if (Math.abs(w) > half + 0.5) return 0;
    if (Math.abs(w) > half || d < 0 || d > height - 0.5) return BRONZE[0];
    const band = d > height - 2.2 * s && d < height - 1.5 * s;
    const lit = w / half;
    return BRONZE[clamp(Math.round(3.4 + lit * 2.4 - k * 0.8 - (band ? 1.4 : 0)), 1, 6)];
  });
  const [mx, my] = bellMouth(b);
  if (b.flash > 0) glow(mx, my, 10 * s, PAL.brass[4], 0.6 * (b.flash / 0.12));
}

/** the toll: thin brass rings of sound spreading from the bell's mouth, the outer one breaking up as it fades */
export function drawToll(b: Bell): void {
  const r = tollReach(b);
  if (r <= 0) return;
  place();
  const [mx, my] = bellMouth(b);
  const fade = 1 - b.t / BELL_TIME.toll;
  fineRing(mx, my, r, r * 0.55, PAL.brass[4], fade);
  fineRing(mx, my, r - 0.5, r * 0.55 - 0.5, PAL.brass[5], fade * 0.8);
  fineRing(mx, my, r * 0.75, r * 0.4, PAL.brass[3], 0.6 * fade);
  fineRing(mx, my, r * 0.5, r * 0.27, PAL.brass[3], 0.35 * fade);
  glow(mx, my, r * 0.6, PAL.brass[3], 0.25 * fade);
}
