import { SpriteCanvas } from "../../../engine/sprite";
import { hex } from "../../../utils/color";
import { spriteUrl } from "../../spriteUrl";
import { ARCANE_ICONS } from "./arcane";
import { BLADE_ICONS } from "./blade";
import { BOON_ICONS } from "./boon";
import { FUSION_ICONS } from "./fusion";
import { PHANTOM_ICONS } from "./phantom";
import { SHOP_ICONS } from "./shop";
import { YSRA_ICONS } from "./ysra";

const SIZE = 16;
const OUTLINE = hex("#0a0612");
/** every icon by skill, boon or shop item id */
const ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...BLADE_ICONS,
  ...PHANTOM_ICONS,
  ...ARCANE_ICONS,
  ...FUSION_ICONS,
  ...BOON_ICONS,
  ...SHOP_ICONS,
  ...YSRA_ICONS,
};
const canvas = new SpriteCanvas(SIZE, SIZE, 0, 0);
const cache = new Map<string, string>();

/** a skill's or shop item's icon as a PNG data URL, drawn once and kept */
export function iconUrl(id: string): string {
  const hit = cache.get(id);
  if (hit) return hit;
  const draw = ICONS[id];
  if (!draw) throw new Error(`No icon for skill ${id}`);
  canvas.clear();
  draw(canvas);
  canvas.outline(OUTLINE);
  const url = spriteUrl(canvas);
  cache.set(id, url);
  return url;
}
