import { HERO_COLORS as HC } from "../../../constants/palette";
import { LANTERN } from "../../../constants/wenna/lantern";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { hookPoint } from "./lantern";
import { paintLantern } from "./lanternLook";

/** the lantern hanging still from the pole's hook, drawn into a hero's sprite for a portrait in the menus */
export function drawRestLantern(s: SpriteCanvas, p: Pose, hand: readonly [number, number]): void {
  const at = hookPoint(p, hand);
  const left = Math.round(at.x - LANTERN.size / 2);
  const top = Math.round(at.y) + LANTERN.chain + 1;
  s.begin();
  for (let k = 0; k < LANTERN.chain; k++) s.block(left + 2, Math.round(at.y) + k, k % 2 ? HC.bladeBack : HC.blade);
  paintLantern((x, y, c) => s.set(x, y, c), left, top, 0, 0);
  s.commit(false);
}
