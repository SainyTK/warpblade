import { HULDA_SKIN } from "../../../../constants/characters/hulda/look";
import { THROWN_GAUNTLET as G } from "../../../../constants/hulda/moveset";
import { fleck, glow, hairline, line, px } from "../../../../engine/frame";
import { WHITE } from "../../../../utils/color";
import { hero } from "../../../state";
import { skin } from "../../skin";

const C = HULDA_SKIN.colors;

/** the chain from her hand to the gauntlet's cuff: links turned along and across in turn, sagging a little mid-way */
function drawChain(x1: number, y1: number): void {
  const x0 = hero.x + hero.face * 6;
  const y0 = hero.y - 20;
  const len = Math.hypot(x1 - x0, y1 - y0);
  const n = Math.floor(len / G.link);
  const ux = len ? (x1 - x0) / len : 1;
  const uy = len ? (y1 - y0) / len : 0;
  for (let i = 0; i <= n; i++) {
    const u = n ? i / n : 0;
    const x = x0 + (x1 - x0) * u;
    const y = y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * 1.5;
    if (i % 2 === 0) {
      fleck(x, y, C.steel);
      fleck(x + ux * 0.5, y + uy * 0.5, C.steelDark);
      fleck(x, y - 0.5, C.steelLight, 0.8);
      continue;
    }
    fleck(x - uy * 0.5, y + ux * 0.5, C.steelDark);
    fleck(x + uy * 0.5, y - ux * 0.5, C.steelDeep);
  }
}

/**
 * Hulda's iron gauntlet flying knuckles first, its knuckles at (x, y), on the chain that runs back to her hand: the
 * wrapped cuff, the iron fist with its finger bands lit along the top, white studs on the knuckles, and a rust glow.
 */
export function drawThrownGauntlet(x: number, y: number, angle: number): void {
  const c = Math.cos(angle);
  const n = Math.sin(angle);
  const at = (back: number, side: number): [number, number] => [x - c * back - n * side, y - n * back + c * side];
  const [cuffX, cuffY] = at(G.length, 0);
  drawChain(cuffX, cuffY);
  // the wrapped cuff, then the fist: three bands of iron across, dark below and lit above
  line(...at(G.length, 0), ...at(G.fist * 1.6, 0), C.glove);
  hairline(...at(G.length, -G.cuff * 0.5), ...at(G.fist * 1.6, -G.cuff * 0.5), C.gloveLight);
  for (const side of [-1, 0, 1]) {
    const w = side * G.fist * 0.55;
    line(...at(G.fist * 1.5, w), ...at(0.5, w), side < 0 ? C.steelLight : side > 0 ? C.steelDark : C.steel);
  }
  hairline(...at(G.fist * 1.6, -G.fist * 0.85), ...at(0.5, -G.fist * 0.85), C.steelGlint);
  hairline(...at(G.fist * 1.6, G.fist * 0.85), ...at(0.5, G.fist * 0.85), C.steelDeep);
  // the finger bands across the fist, and the white studs on the knuckles leading
  hairline(...at(G.fist, -G.fist), ...at(G.fist, G.fist), C.steelDeep);
  for (const k of [-0.6, 0, 0.6]) fleck(...at(0, k * G.fist), WHITE);
  px(...at(G.fist * 0.8, -G.fist * 0.4), C.steelLight);
  glow(x, y, 7, skin.ramp[4], 0.3);
}
