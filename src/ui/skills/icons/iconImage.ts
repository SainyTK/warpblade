import { SpriteCanvas } from "../../../engine/sprite";
import { hex } from "../../../utils/color";
import { ARCANE_ICONS } from "./arcane";
import { BLADE_ICONS } from "./blade";
import { FUSION_ICONS } from "./fusion";
import { PHANTOM_ICONS } from "./phantom";
import { drawNovaIcon } from "./special";

const SIZE = 16;
const OUTLINE = hex("#0a0612");
/** every icon by skill id; "special" is the starting ultimate */
const ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...BLADE_ICONS,
  ...PHANTOM_ICONS,
  ...ARCANE_ICONS,
  ...FUSION_ICONS,
  special: drawNovaIcon,
};
const canvas = new SpriteCanvas(SIZE, SIZE, 0, 0);
const cache = new Map<string, string>();

/** a skill's icon as a PNG data URL, drawn once and kept */
export function iconUrl(id: string): string {
  const hit = cache.get(id);
  if (hit) return hit;
  const draw = ICONS[id];
  if (!draw) throw new Error(`No icon for skill ${id}`);
  canvas.clear();
  draw(canvas);
  canvas.outline(OUTLINE);
  const out = document.createElement("canvas");
  out.width = SIZE;
  out.height = SIZE;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("This browser cannot draw to a 2D canvas.");
  const img = ctx.createImageData(SIZE, SIZE);
  canvas.d.forEach((c, i) => {
    if (!c) return;
    img.data.set([(c >> 16) & 255, (c >> 8) & 255, c & 255, 255], i * 4);
  });
  ctx.putImageData(img, 0, 0);
  const url = out.toDataURL();
  cache.set(id, url);
  return url;
}
