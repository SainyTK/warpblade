import { detailCanvas } from "../../engine/sprite";
import { drawHero } from "../../game/hero/drawHero";
import { applySkin } from "../../game/hero/skin";
import { drawRestLantern } from "../../game/hero/wenna/restLantern";
import { shown } from "../../game/state";
import type { CharacterDef } from "../../types/character";
import { sashAnchor } from "../../utils/poseFrame";
import { restPose } from "../../utils/restPose";
import { spriteUrl } from "../spriteUrl";

const canvas = detailCanvas(64, 56, 30, 50);
const cache = new Map<string, string>();

/** a hero standing on the rig in their own colours, as a PNG data URL, drawn once */
export function heroPortrait(c: CharacterDef): string {
  const hit = cache.get(c.id);
  if (hit) return hit;
  applySkin(c.skin);
  // scarf and hair at rest, hanging back from the neck (a sash from the belt) and the head
  const pose = restPose(c.kit);
  const [kx, ky] = sashAnchor(pose);
  const scarf = c.skin.sash
    ? Array.from({ length: 8 }, (_, i): [number, number] => [kx - i * 1.7, ky + i * 1.6])
    : Array.from({ length: 8 }, (_, i): [number, number] => [-1 - i * 1.9, -23 + i * 1.1]);
  const tail = Array.from({ length: 4 }, (_, i): [number, number] => [-4 - i * 1.6, -27 + i * 1.8]);
  const hand = drawHero(canvas, pose, { scarf, tail, flare: 0, sword: true });
  // a lamp pole's lantern swings in the world in play; here it hangs still from the hook
  if (c.skin.weapon === "lampPole") drawRestLantern(canvas, pose, hand);
  // back to the hero on the stage, which on the hero screen is the one in focus
  applySkin(shown.skin);
  const url = spriteUrl(canvas);
  cache.set(c.id, url);
  return url;
}
