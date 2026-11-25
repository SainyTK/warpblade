import { GROUND, W } from "../../../constants/stage";
import { fleck, glow, line, place, px } from "../../../engine/frame";
import { stageCameraX } from "../../../game/adventure";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { BLIGHT } from "../colors";
import { FAR_GLOWS } from "./backdrop";
import type { SceneTones } from "./tones";

const ROOT_SPAN = 420;
const ROOT_PARALLAX = 0.65;
const HANGING = 11;
const SPORES = 46;
const SPORE_SPAN = 360;

const wrapIn = (v: number, span: number): number => ((v % span) + span) % span;

function hangingRoots(t: number, T: SceneTones): void {
  const shift = stageCameraX() * ROOT_PARALLAX;
  for (let i = 0; i < HANGING; i++) {
    const x = wrapIn(i * (ROOT_SPAN / HANGING) + grain(i, 41) * 20 - shift, ROOT_SPAN) - 40;
    if (x < -10 || x > W + 10) continue;
    const len = 18 + grain(i, 43) * 46;
    const thick = grain(i, 47) > 0.6;
    let lx = x;
    let ly = -2;
    for (let k = 1; k <= 6; k++) {
      const u = k / 6;
      const nx = x + Math.sin(t * 0.7 + i * 1.3 + u * 2.5) * 2.4 * u;
      const ny = len * u;
      line(lx, ly, nx, ny, T.canopy);
      if (thick) line(lx + 1, ly, nx + 1, ny, mix(T.canopy, T.canopyRim, 0.5));
      lx = nx;
      ly = ny;
    }
    if (grain(i, 49) > 0.35) {
      const c = grain(i, 53) > 0.5 ? T.glowA : T.glowB;
      const pulse = 0.5 + Math.sin(t * 1.8 + i) * 0.2;
      px(lx - 0.5, ly, c);
      fleck(lx - 0.5, ly, BLIGHT.spore[4]);
      glow(lx, ly + 1, 10, c, 0.3 * pulse);
    }
  }
}

export function drawBlightAmbient(t: number, k: number, T: SceneTones): void {
  place();
  for (const [x, y, kind] of FAR_GLOWS) {
    const c = kind ? T.glowB : T.glowA;
    glow(x, y, 9, c, 0.18 + Math.sin(t * 1.3 + x) * 0.06);
  }
  if (k > 0.75)
    glow(W / 2, 10, 70, BLIGHT.flesh[3], (0.1 + Math.max(0, Math.sin(t * 3.2)) ** 3 * 0.1) * (k - 0.75) * 4);
  hangingRoots(t, T);
}

export function drawBlightWeather(t: number, T: SceneTones): void {
  place();
  const shift = stageCameraX();
  for (let i = 0; i < SPORES; i++) {
    const speed = 3 + grain(i, 61) * 6;
    const rise = i % 3 === 0;
    const y0 = grain(i, 67) * GROUND;
    const y = wrapIn(y0 + (rise ? -t : t) * speed, GROUND + 10) - 5;
    const x =
      wrapIn(grain(i, 71) * SPORE_SPAN + Math.sin(t * 0.6 + i) * 6 - shift * (0.8 + (i % 4) * 0.1), SPORE_SPAN) - 20;
    if (x < -2 || x > W + 2) continue;
    const twinkle = Math.sin(t * 3 + i * 1.7);
    const c = i % 4 === 0 ? T.glowA : BLIGHT.spore[i % 2 ? 2 : 3];
    if (twinkle > 0.7) px(x, y, c, 0.9);
    else fleck(x, y, c, 0.5 + twinkle * 0.3);
  }
}
