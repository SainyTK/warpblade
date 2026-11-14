import { SpriteCanvas } from "../../../engine/sprite";
import { heroModule } from "../../../heroes";
import { CHARACTERS } from "../../../heroes/roster";
import { hex } from "../../../utils/color";
import { spriteUrl } from "../../spriteUrl";
import { BOON_ICONS } from "./boon";
import { CHARM_ICONS } from "./charms";
import { SHOP_ICONS } from "./shop";

const SIZE = 16;
const OUTLINE = hex("#0a0612");
/** the icons every hero shares, by boon, shop item or charm id */
const SHARED_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...BOON_ICONS,
  ...SHOP_ICONS,
  ...CHARM_ICONS,
};
/** an icon's drawing by id: a shared one, or one a hero's module brings (skills, evolved forms, damage sources) */
function iconDrawing(id: string): ((s: SpriteCanvas) => void) | undefined {
  if (id in SHARED_ICONS) return SHARED_ICONS[id];
  for (const c of CHARACTERS) {
    const draw = heroModule(c.id).icons[id];
    if (draw) return draw;
  }
  return undefined;
}

const canvas = new SpriteCanvas(SIZE, SIZE, 0, 0);
const cache = new Map<string, string>();

/** a skill's or shop item's icon as a PNG data URL, drawn once and kept */
export function iconUrl(id: string): string {
  const hit = cache.get(id);
  if (hit) return hit;
  const draw = iconDrawing(id);
  if (!draw) throw new Error(`No icon for skill ${id}`);
  canvas.clear();
  draw(canvas);
  canvas.outline(OUTLINE);
  const url = spriteUrl(canvas);
  cache.set(id, url);
  return url;
}

/** a skill's icon id: its evolved form's own (`<id>_evo`) when evolved and drawn, otherwise the skill's */
export const skillIcon = (id: string, evolved: boolean): string =>
  evolved && iconDrawing(`${id}_evo`) ? `${id}_evo` : id;
