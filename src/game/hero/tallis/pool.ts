import { RES } from "../../../constants/stage";
import { POOL } from "../../../constants/tallis/look";
import { SINK } from "../../../constants/tallis/sink";
import { fleck, glow, putImage, toScreenX, toScreenY } from "../../../engine/frame";
import { fineRing } from "../../effects/fine";
import { game, hero } from "../../state";
import { tallis } from "./memory";

/** the pool's depth on the floor in art pixels, and how much longer it draws out behind him at full glide */
const DEPTH = 1.75;
const STRETCH = 0.5;
/** seconds between the ripples that leave its edge */
const RIPPLE = 0.45;

/** how far the pool has spread, 0 to 1: it grows as his body pours down and shrinks as he rises */
function poolShare(): number {
  if (hero.state === "sink") return Math.min(1, tallis.sinkT / SINK.pour);
  if (hero.state === "rise") return Math.max(0, 1 - hero.st / SINK.rise);
  return 0;
}

/**
 * The ink pool on the floor he stands on: a flat oval drawn to the image pixel, deep at its heart with a paler lip, wet
 * rose glints sliding along its far edge, a ripple leaving it now and then, a tail drawn out behind as it glides, and
 * two eyes looking the way he faces.
 */
export function drawPool(): void {
  const k = poolShare();
  if (k <= 0) return;
  const half = (SINK.width / 2) * k;
  const tail = Math.min(1, Math.abs(hero.vx) / SINK.glide) * STRETCH * half;
  const back = -Math.sign(hero.vx);
  const cx = hero.x + (back * tail) / 2;
  const rx = half + tail / 2;
  const y = hero.y - DEPTH / 2;
  const left = Math.floor(toScreenX(cx - rx) * RES);
  const right = Math.ceil(toScreenX(cx + rx) * RES);
  const top = Math.floor(toScreenY(y - DEPTH) * RES);
  const bottom = Math.ceil(toScreenY(y + DEPTH) * RES);
  const mx = toScreenX(cx) * RES;
  const my = toScreenY(y) * RES;
  for (let iy = top; iy <= bottom; iy++) {
    const v = (iy + 0.5 - my) / (DEPTH * RES);
    for (let ix = left; ix <= right; ix++) {
      const u = (ix + 0.5 - mx) / (rx * RES);
      const d = u * u + v * v;
      if (d > 1) continue;
      // the far edge catches the dusk: glints that slide along it as the surface moves
      const glint = v < -0.2 && d > 0.55 && Math.sin(ix * 0.55 + game.t * 7) > 0.5;
      putImage(ix, iy, glint ? POOL.shine : d > 0.72 ? POOL.lip : d > 0.3 ? POOL.body : POOL.deep);
    }
  }
  const beat = (game.t % RIPPLE) / RIPPLE;
  fineRing(cx, y, rx + 1 + beat * 5, DEPTH * (0.7 + beat * 0.6), POOL.lip, (1 - beat) * 0.8 * k);
  if (k >= 1) {
    const look = hero.face;
    for (const at of [1, 3.5]) {
      fleck(hero.x + look * at, y - 0.25, POOL.eye);
      fleck(hero.x + look * at + 0.5, y - 0.25, POOL.eyeCore);
    }
  }
  glow(cx, y, 12 * k, POOL.shine, 0.14);
}
