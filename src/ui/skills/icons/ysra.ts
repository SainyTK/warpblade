import { YSRA } from "../../../constants/characters/ysra/index";
import type { SpriteCanvas } from "../../../engine/sprite";
import { allNodes } from "../../../utils/stats";
import { flame } from "./parts";

/** Ysra's skill icons. Placeholder: a flame for every node until her own icons land. */
export const YSRA_ICONS: Record<string, (s: SpriteCanvas) => void> = Object.fromEntries(
  allNodes(YSRA).map((n) => [n.id, (s: SpriteCanvas) => flame(s, 8, 14, 10)]),
);
