import { detailCanvas } from "../../engine/sprite";
import { applySkin, skin } from "../../game/hero/skin";
import { drawHero } from "../../rig";
import type { CharacterDef } from "../../types/character";
import { jobSkin } from "../../utils/jobs";
import { sashAnchor } from "../../utils/poseFrame";
import { restPose } from "../../utils/restPose";
import { spriteUrl } from "../spriteUrl";

const canvas = detailCanvas(64, 56, 30, 50);
const cache = new Map<string, string>();

/** a hero standing on the rig in the colours of a job (null for their own), as a PNG data URL, drawn once */
export function heroPortrait(c: CharacterDef, job: string | null = null): string {
  const key = `${c.id}/${job ?? ""}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const worn = skin;
  const look = jobSkin(c, job);
  applySkin(look);
  // scarf and hair at rest, hanging back from the neck (a sash from the belt) and the head
  const pose = restPose(c);
  const [kx, ky] = sashAnchor(pose);
  const scarf =
    look.scarfAt === "belt"
      ? Array.from({ length: 8 }, (_, i): [number, number] => [kx - i * 1.7, ky + i * 1.6])
      : Array.from({ length: 8 }, (_, i): [number, number] => [-1 - i * 1.9, -23 + i * 1.1]);
  const tail = Array.from({ length: 4 }, (_, i): [number, number] => [-4 - i * 1.6, -27 + i * 1.8]);
  drawHero(canvas, pose, look, { scarf, tail, flare: 0, sword: true });
  // back to the look the stage was wearing
  applySkin(worn);
  const url = spriteUrl(canvas);
  cache.set(key, url);
  return url;
}
