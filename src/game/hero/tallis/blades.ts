import { TALLIS_COLORS as TC } from "../../../constants/characters/tallis/look";
import { PAL } from "../../../constants/palette";
import { fleck, glow, glowLine, hairline } from "../../../engine/frame";
import { WHITE } from "../../../utils/color";

const G = PAL.gloam;
/** his warp knife from point to pommel: the blade's length, where the guard sits and where the ring pommel hangs */
const WARP_KNIFE = { blade: 5.5, grip: 8.5, guard: 1.3, wisp: 15 } as const;

/** a needle in flight: a hair of steel with a white point, and a rose thread fading out behind it */
export function drawNeedle(x: number, y: number, dx: number, dy: number): void {
  hairline(x - dx * 9, y - dy * 9, x - dx * 3, y - dy * 3, G[3], (u) => 0.25 + u * 0.75);
  hairline(x - dx * 3, y - dy * 3, x, y, G[5]);
  fleck(x, y, WHITE);
  glow(x, y, 4, G[4], 0.2);
}

/** a thrown knife: the blade turning end over end as it flies, a white point, and a rose streak fading out behind it */
export function drawSpinningKnife(x: number, y: number, face: number, flown: number): void {
  const turn = flown * 0.42 * face;
  const bx = Math.cos(turn) * 2.5;
  const by = Math.sin(turn) * 2.5;
  hairline(x - face * 11, y, x - face * 2, y, G[3], (u) => u * 0.7);
  hairline(x - face * 7, y + 0.5, x - face * 2, y + 0.5, G[4], (u) => u * 0.6);
  hairline(x - bx, y - by, x + bx, y + by, G[5]);
  hairline(x - bx * 0.4, y - by * 0.4 + 0.5, x + bx, y + by + 0.5, G[4]);
  fleck(x + bx, y + by, WHITE);
  glow(x, y, 5, G[4], 0.25);
}

/**
 * His warp knife flying point first, its point at (x, y): steel lit white along its hooked edge, a plum guard, a dark
 * wrapped grip with a rose ring pommel, and a thread of ink and dusk rose drawn out behind it that wavers as it flies,
 * the shadow he will step out of.
 */
export function drawThrownKnife(x: number, y: number, angle: number, t: number): void {
  const c = Math.cos(angle);
  const n = Math.sin(angle);
  const K = WARP_KNIFE;
  const at = (back: number, side: number): [number, number] => [x - c * back - n * side, y - n * back + c * side];
  const sway = Math.sin(t * 40) * 0.6;
  hairline(...at(K.wisp, sway), ...at(K.grip, 0), G[1], (u) => u * 0.8);
  hairline(...at(K.wisp - 3, -sway * 0.6), ...at(K.grip, 0.5), G[3], (u) => u * 0.6);
  glowLine(...at(K.wisp, 0), ...at(K.grip, 0), 4, G[4], 0.25);
  hairline(...at(0, 0), ...at(K.blade, 0), TC.blade);
  hairline(...at(0.5, 0.5), ...at(K.blade, 0.5), TC.bladeBack);
  hairline(...at(0.5, -0.5), ...at(K.blade - 0.5, -0.5), (u) => (u < 0.35 ? WHITE : TC.bladeEdge));
  hairline(...at(K.blade, -K.guard), ...at(K.blade, K.guard), TC.trimDark);
  hairline(...at(K.blade + 0.5, 0), ...at(K.grip, 0), TC.hilt);
  fleck(...at(K.grip + 0.5, 0), TC.trim);
  fleck(x, y, WHITE);
  glow(x, y, 6, G[4], 0.3);
}
