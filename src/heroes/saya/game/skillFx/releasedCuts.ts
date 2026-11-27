import { fleck, hairline, line, sparkle } from "../../../../engine/frame";
import { progress as run } from "../../../../game/state";
import type { Color, Ramp } from "../../../../types/color";
import type { ElementKit, FxCast } from "../../../../types/skillFx";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { ease, smooth, TAU } from "../../../../utils/math";
import type { FxPoint } from "../../types/skillFx";

const CUTS = [1, 3, 5, 9] as const;
const SPRAY = 12;
const STORE_END = 0.22;
const RELEASE_FROM = 0.24;
const RELEASE_TO = 0.38;

interface CutLook {
  R: Ramp;
  dark: Color;
  stored: number;
  open: number;
  alpha: number;
}

function cut(x: number, y: number, angle: number, half: number, look: CutLook): void {
  const dx = Math.cos(angle) * half * look.stored;
  const dy = Math.sin(angle) * half * look.stored;
  const nx = -Math.sin(angle) * look.open * 1.4;
  const ny = Math.cos(angle) * look.open * 1.4;
  if (look.open <= 0) {
    line(x - dx, y - dy, x + dx, y + dy, look.dark, look.alpha);
    hairline(x - dx, y - dy, x + dx, y + dy, look.R[3], look.alpha * 0.6);
    return;
  }
  line(x - dx + nx, y - dy + ny, x + dx + nx, y + dy + ny, look.dark, look.alpha);
  line(x - dx - nx, y - dy - ny, x + dx - nx, y + dy - ny, look.dark, look.alpha);
  hairline(x - dx, y - dy, x + dx, y + dy, look.R[4], look.alpha);
  hairline(x - dx * 0.6, y - dy * 0.6, x + dx * 0.6, y + dy * 0.6, WHITE, look.alpha * (1 - look.open * 0.5));
}

function droplets(x: number, y: number, angle: number, half: number, flung: number, look: CutLook): void {
  for (const side of [-1, 1]) {
    const d = half * (0.3 + 0.4 * grain(Math.round(angle * 10), side + 2));
    const px = x + Math.cos(angle) * d * side - Math.sin(angle) * flung * side;
    const py = y + Math.sin(angle) * d * side + Math.cos(angle) * flung * side;
    fleck(px, py, look.dark, look.alpha);
    fleck(px + 0.5, py, look.R[2], look.alpha);
  }
}

function sheathe(x: number, y: number, half: number, u: number, look: CutLook): void {
  const home = ease.outCubic(smooth(0.05, RELEASE_FROM, u));
  const left = x - half;
  const tip = left + half * 2 * home;
  line(left, y, x + half, y, look.dark, look.alpha);
  hairline(left, y - 0.5, tip, y - 0.5, look.R[4], look.alpha);
  const click = 1 - smooth(RELEASE_FROM, RELEASE_TO + 0.1, u);
  if (home >= 1 && click > 0) sparkle(x + half, y, 2.5, WHITE, look.R[4], 0.5 * click * look.alpha);
}

function spray(x: number, y: number, reach: number, u: number, look: CutLook): void {
  const out = ease.outCubic(smooth(RELEASE_FROM, 0.7, u));
  for (let i = 0; i < SPRAY; i++) {
    const a = (i / SPRAY) * TAU + grain(i, 9) * 0.4;
    const r0 = reach * (0.6 + 0.5 * out);
    const r1 = r0 + reach * 0.35 * (1 - out * 0.5);
    line(x + Math.cos(a) * r0, y + Math.sin(a) * r0, x + Math.cos(a) * r1, y + Math.sin(a) * r1, look.dark, look.alpha);
    fleck(x + Math.cos(a) * r1, y + Math.sin(a) * r1, look.R[4], look.alpha);
  }
}

export function drawReleasedCuts(cast: FxCast, kit: ElementKit, progress: number, fade: number, at: FxPoint): void {
  const rank = cast.feel.rank;
  const alpha = fade * (1 - smooth(0.6, 1, progress));
  if (alpha <= 0) return;
  const s = Math.sqrt(cast.size);
  const half = (5 + rank * 2.5) * s;
  const look: CutLook = {
    R: kit.look.ramp,
    dark: kit.look.dark,
    stored: ease.outCubic(smooth(0, STORE_END, progress)),
    open: smooth(RELEASE_FROM, RELEASE_TO, progress),
    alpha,
  };
  const cuts = CUTS[rank];
  for (let i = 0; i < cuts; i++) {
    const angle = -0.4 + (i / cuts) * Math.PI + (grain(i, rank) - 0.5) * 0.3;
    const length = half * (0.8 + 0.4 * grain(i, 3));
    cut(at.x, at.y, angle, length, look);
    if (rank >= 1 && look.open > 0) droplets(at.x, at.y, angle, length, look.open * (2 + rank), look);
  }
  const mastered = (run.build.mastery[cast.id] ?? 0) > 0 || rank >= 3;
  if (mastered) sheathe(at.x, at.y + half * 1.1, half * 1.2, progress, look);
  if (rank >= 3) spray(at.x, at.y, half * 1.4, progress, look);
}
