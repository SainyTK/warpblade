import type { SpriteCanvas } from "../../../engine/sprite";
import { mix, WHITE } from "../../../utils/color";
import { RAIN_FOES as C } from "./colors";
import type { HulkLook } from "./hulkLook";

export function drawMotes(
  s: SpriteCanvas,
  look: HulkLook,
  motes: readonly (readonly [number, number])[],
  dy: number,
): void {
  const blink = look.warning > 0 && Math.floor(look.time * (8 + look.warning * 16)) % 2 === 0;
  for (const [x, y] of motes) {
    const lit = look.cracked || look.hot || look.warning > 0 || Math.sin(look.time * 2.5 + x * 0.7) > -0.2;
    s.block(x, y + dy, lit ? (blink ? C.wartHot : C.wart) : mix(C.wart, C.mud, 0.5));
    if (lit) s.set(x, y + dy, blink ? WHITE : C.wartHot);
  }
}
