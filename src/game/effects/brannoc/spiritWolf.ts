import { PAL } from "../../../constants/palette";
import { blendScreen, fleck, glow, toScreenX, toScreenY } from "../../../engine/frame";
import { WHITE } from "../../../utils/color";

/**
 * A red wolf spirit about 22 px long and 12 px tall standing on its feet row, facing right, one string per row from the
 * top: a dark crimson outline (o), a crimson body (b) lit along its back and head (l), and a white eye (w). Pricked
 * ears, a long snout, a deep chest and a tail streaming back off its rump. Its legs take turns as it runs.
 */
const WOLF_ART = [
  "................o.o...",
  "...............oloo...",
  "..............obllo...",
  "oo...........obbllwoo.",
  ".oo..ooooooo.obbbblllo",
  "..oobbbbbbbbobbbbbboo.",
  "...obbbbbbbbbbbbbbo...",
  "...obbbbbbbbbbbbbo....",
  "....obbbbbbbbbbbo.....",
  "....obbo.....obbo.....",
] as const;
const WOLF_LEGS = [
  ["..obo..........obo....", ".oo..............oo..."],
  [".....obo....obo.......", ".....oo.....oo........"],
] as const;
/** the ramp step behind each letter of the art */
const WOLF_SHADE: Readonly<Record<string, number>> = { o: 1, b: 3, l: 4 };
/** the art column over its middle */
const MIDDLE = 11;

/** one art pixel laid over what is behind it, so the spirit shows the scenery through it */
function ghost(x: number, y: number, c: number, a: number): void {
  blendScreen(toScreenX(x), toScreenY(y), c, a);
}

function drawRow(row: string, x: number, y: number, face: number, a: number): void {
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === ".") continue;
    const cx = x + (i - MIDDLE) * face;
    if (ch === "w") ghost(cx, y, WHITE, Math.min(1, a * 1.3));
    else ghost(cx, y, PAL.rage[WOLF_SHADE[ch]], ch === "o" ? a : a * 0.85);
  }
}

/**
 * A red wolf spirit with its feet on `floor` at x, facing `face`, raised `lift` px off the floor in a lunge: the
 * translucent body, legs on run frame `step`, a soft crimson glow, and white flecks at its jaws as it bites. The
 * caller has placed the frame.
 */
export function drawSpiritWolf(
  x: number,
  floor: number,
  face: number,
  step: number,
  a: number,
  lift = 0,
  bite = false,
): void {
  if (a <= 0) return;
  const bx = Math.round(x);
  const top = Math.round(floor - lift) - WOLF_ART.length - 2;
  glow(bx, top + 6, 13, PAL.rage[3], 0.25 * a);
  for (let r = 0; r < WOLF_ART.length; r++) drawRow(WOLF_ART[r], bx, top + r, face, a);
  const legs = WOLF_LEGS[step % 2];
  drawRow(legs[0], bx, top + WOLF_ART.length, face, a * 0.9);
  drawRow(legs[1], bx, top + WOLF_ART.length + 1, face, a * 0.8);
  if (!bite) return;
  fleck(bx + face * (MIDDLE + 0.5), top + 5, WHITE, a);
  fleck(bx + face * (MIDDLE + 1), top + 6.5, WHITE, a);
  glow(bx + face * MIDDLE, top + 5, 6, PAL.rage[4], 0.5 * a);
}
