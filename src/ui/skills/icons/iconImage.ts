import { SpriteCanvas } from "../../../engine/sprite";
import { hex } from "../../../utils/color";
import { spriteUrl } from "../../spriteUrl";
import { BOON_ICONS } from "./boon";
import { CHARM_ICONS } from "./charms";
import { HULDA_ICONS } from "./hulda/index";
import { KAEL_SKILL_ICONS } from "./kael/index";
import { SABLE_ICONS } from "./sable/index";
import { SHOP_ICONS } from "./shop";
import { YSRA_ICONS } from "./ysra/index";

const SIZE = 16;
const OUTLINE = hex("#0a0612");
/** every icon by skill, boon or shop item id */
const ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...BOON_ICONS,
  ...SHOP_ICONS,
  ...YSRA_ICONS,
  ...SABLE_ICONS,
  ...HULDA_ICONS,
  ...CHARM_ICONS,
  ...KAEL_SKILL_ICONS,
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

/** a skill's icon id: its evolved form's own (`<id>_evo`) when evolved and drawn, otherwise the skill's */
export const skillIcon = (id: string, evolved: boolean): string => (evolved && `${id}_evo` in ICONS ? `${id}_evo` : id);
