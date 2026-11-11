import { RES } from "../../../constants/stage";
import { SHADOW_FORM } from "../../../constants/tallis/look";
import { blendImage, putImage, shakeOffset } from "../../../engine/frame";
import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { Pose } from "../../../types/pose";
import { cb, cg, cr, mix } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { game, hero } from "../../state";
import { drawHero } from "../drawHero";
import { heroLook } from "../look";

/** how a shadow form is drawn */
export interface FormLook {
  /** 0 keeps his own colours, 1 is the full shadow form */
  ink: number;
  /** his height, 1 standing, toward 0 as he pours flat onto the floor */
  squash: number;
  /** how much of him shows at all, 0 to 1 */
  show: number;
}

const F = SHADOW_FORM;
/** the canvas his form is drawn into, the same size as the hero layer's */
const canvas = detailCanvas(80, 76, 40, 62);
/** what the canvas holds: a pose drawn without ropes stays good for the frame it was drawn in */
const held = { pose: null as Pose | null, t: -1 };

/** his sprite as he stands now, with his scarf and coat as the hero layer draws them */
export function heroForm(): SpriteCanvas {
  const flare = clamp((Math.abs(hero.vx) / 115) * 3, 0, 3) + (hero.ground ? 0 : 1.5);
  drawHero(canvas, hero.pose, heroLook(flare));
  held.pose = null;
  return canvas;
}

/** his sprite in a pose of its own, for a shade standing somewhere else */
export function poseForm(p: Pose): SpriteCanvas {
  if (held.pose === p && held.t === game.t) return canvas;
  drawHero(canvas, p, { scarf: [], tail: [], flare: 0, sword: true });
  held.pose = p;
  held.t = game.t;
  return canvas;
}

/** a sprite pixel's brightness, 0 to 1 */
const light = (c: Color): number => (cr(c) * 0.3 + cg(c) * 0.59 + cb(c) * 0.11) / 255;

/** the form's colour for a sprite pixel this bright: ink for the body, dusk rose for what was lit */
function formColor(l: number): Color {
  if (l >= F.lineAt[2]) return F.lines[2];
  if (l >= F.lineAt[1]) return F.lines[1];
  if (l >= F.lineAt[0]) return F.lines[0];
  return F.body[Math.min(2, Math.floor((l / F.lineAt[0]) * 3))];
}

/**
 * Draw a sprite as his shadow form with its feet at (x, y): the body in ink the scene shows through, his lit edges kept
 * as rose lines, a rim round him that is brightest at the hood, and his lowest part fraying into wisps that climb.
 */
export function drawForm(s: SpriteCanvas, x: number, y: number, flip: boolean, look: FormLook): void {
  const { ink, squash, show } = look;
  if (show <= 0.02 || squash <= 0.02) return;
  const [shx, shy] = shakeOffset();
  const bx = Math.floor((x + shx) * RES);
  const by = Math.floor((y + shy) * RES);
  const { box, w, d } = s;
  const tall = Math.max(1, s.oy - box.y0);
  const drift = game.t * 9;
  const filled = (i: number, j: number): boolean => i >= 0 && j >= 0 && i < w && j < s.h && d[j * w + i] !== 0;
  // each row of the picture drawn takes one row of the sprite, so a squashed form never draws a row twice
  const first = Math.floor((box.y0 - 1 - s.oy) * squash);
  const last = Math.ceil((box.y1 + 1 - s.oy) * squash);
  for (let row = first; row <= last; row++) {
    const j = s.oy + Math.round(row / squash);
    const up = clamp((s.oy - j) / tall, 0, 1);
    const iy = by + row;
    for (let i = box.x0 - 1; i <= box.x1 + 1; i++) {
      const ix = flip ? bx + (s.ox - i) : bx + (i - s.ox);
      const c = filled(i, j) ? d[j * w + i] : 0;
      // the wisps: columns of the lowest part come and go, climbing with time
      const frayed = up < F.fray ? up / F.fray + 0.5 + 0.5 * Math.sin(i * 0.8 + j * 0.45 + drift) + (1 - ink) : 2;
      if (!c) {
        if (ink < 0.5 || frayed < 1.2) continue;
        if (!filled(i - 1, j) && !filled(i + 1, j) && !filled(i, j - 1) && !filled(i, j + 1)) continue;
        const rim = F.rim[up > 0.72 ? 2 : up > F.rimBreak ? 1 : 0];
        putImage(ix, iy, rim, show * (up > F.rimBreak ? 1 : 0.5));
        continue;
      }
      const l = light(c);
      const line = l >= F.lineAt[0];
      const tone = ink >= 1 ? formColor(l) : mix(c, formColor(l), ink);
      const solid = (line ? 1 : 1 - (1 - F.solid) * ink) * show * Math.min(1, frayed);
      blendImage(ix, iy, tone, solid);
    }
  }
}
