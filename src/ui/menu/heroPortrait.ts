import { YSRA_STATE_CLIPS } from "../../constants/clips/ysra";
import { STAND } from "../../constants/hero";
import { detailCanvas } from "../../engine/sprite";
import { drawHero } from "../../game/hero/drawHero";
import { applySkin } from "../../game/hero/skin";
import { character } from "../../game/state";
import type { CharacterDef } from "../../types/character";
import type { Pose } from "../../types/pose";
import { sampleKeys } from "../../utils/sampleKeys";
import { spriteUrl } from "../spriteUrl";

const canvas = detailCanvas(64, 56, 30, 50);
const cache = new Map<string, string>();

/** the hero at rest: the first frame of their own idle clip, or the shared standing pose */
function restPose(c: CharacterDef): Pose {
  const idle = c.kit === "ysra" ? YSRA_STATE_CLIPS.idle : undefined;
  return idle ? sampleKeys(idle.keys, 0) : STAND;
}

/** a hero standing on the rig in their own colours, as a PNG data URL, drawn once */
export function heroPortrait(c: CharacterDef): string {
  const hit = cache.get(c.id);
  if (hit) return hit;
  applySkin(c.skin);
  // scarf and hair at rest, hanging back from the neck and the head
  const scarf = Array.from({ length: 8 }, (_, i): [number, number] => [-1 - i * 1.9, -23 + i * 1.1]);
  const tail = Array.from({ length: 4 }, (_, i): [number, number] => [-4 - i * 1.6, -27 + i * 1.8]);
  drawHero(canvas, restPose(c), { scarf, tail, flare: 0, sword: true });
  applySkin(character.skin);
  const url = spriteUrl(canvas);
  cache.set(c.id, url);
  return url;
}
