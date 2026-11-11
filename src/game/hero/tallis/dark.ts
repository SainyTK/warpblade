import { PAL } from "../../../constants/palette";
import { H, W } from "../../../constants/stage";
import { DARK } from "../../../constants/tallis/look";
import { GLOAMING } from "../../../constants/tallis/special";
import { blendScreen, lightB, lightG, lightR, shakeOffset } from "../../../engine/frame";
import { blitRing } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { kindOf } from "../../enemies/kinds";
import { game } from "../../state";

/** the dark under way: how deep it is now, 0 to 1, and whether it is lifting */
export interface GloamDark {
  fading: boolean;
  k: number;
}

/** the light the scene gives off dims with the dark, so the sun's glow does not wash it out */
export function dimLights(dark: GloamDark): void {
  const keep = 1 - GLOAMING.dark * dark.k;
  if (keep >= 1) return;
  for (let i = 0; i < lightR.length; i++) {
    lightR[i] *= keep;
    lightG[i] *= keep;
    lightB[i] *= keep;
  }
}

/** the rows and columns the dark is laid over, a little past the stage so a shake shows no edge */
const MARGIN = 2;
const ROWS = H + MARGIN * 2;
const COLS = W + MARGIN * 2;
/** the dusk band sits at this row and is this many rows deep; the dark falls with a front this many rows soft */
const BAND = { row: 122, depth: 34 } as const;
const FRONT = 46;

/** each row's colour: ink, turning to dusk plum in a band low over the horizon, where the last light lingers */
const rowColor = Array.from({ length: ROWS }, (_, i) => {
  const d = (i - MARGIN - BAND.row) / BAND.depth;
  return mix(DARK.ink, DARK.dusk, Math.exp(-d * d));
});
/** how deep the dark is in each row and column: lighter in the dusk band, deeper toward the stage's sides */
const rowDepth = Float32Array.from({ length: ROWS }, (_, i) => {
  const d = (i - MARGIN - BAND.row) / BAND.depth;
  return 1 - DARK.band * Math.exp(-d * d);
});
const colDepth = Float32Array.from({ length: COLS }, (_, i) => {
  const d = (i - MARGIN - W / 2) / (W / 2);
  return 1 + DARK.edge * d * d;
});

/** the dark over the scene at depth k: as it comes on it falls from the top of the sky like a curtain; it lifts evenly */
function drawDark(k: number, falling: boolean): void {
  const [sx, sy] = shakeOffset();
  const front = k * (ROWS + FRONT);
  for (let j = 0; j < ROWS; j++) {
    const fallen = falling ? clamp((front - j) / FRONT) : k;
    if (fallen <= 0) break;
    const a = GLOAMING.dark * fallen * rowDepth[j];
    const c = rowColor[j];
    const y = j - MARGIN + sy;
    for (let i = 0; i < COLS; i++) blendScreen(i - MARGIN + sx, y, c, Math.min(1, a * colDepth[i]));
  }
}

/**
 * The dark Gloaming and Eclipse lay over the scene: drawn behind the foes and the heroes, so only they stand out of it,
 * each foe struck rimmed in dusk rose. It falls over the wind-up and lifts once `fading` is set.
 */
export function createDark(targets: readonly Enemy[]): GloamDark {
  const handle: GloamDark = { fading: false, k: 0 };
  game.fx.push({
    update(dt) {
      const step = handle.fading ? -dt / GLOAMING.light : dt / GLOAMING.windup;
      handle.k = Math.max(0, Math.min(1, handle.k + step));
      return !handle.fading || handle.k > 0;
    },
    drawBack() {
      drawDark(handle.k, !handle.fading);
      if (handle.fading) return;
      for (const e of targets) {
        if (e.hp <= 0) continue;
        blitRing(kindOf(e.type).draw(e, game.t), e.x, e.y, e.face < 0, 1, () => PAL.gloam[4]);
      }
    },
    draw() {},
  });
  return handle;
}
