import { loadIcons } from "./icons";
import { loadSprites } from "./sprites";

export { hasSkillArt, skillArtUrl } from "./icons";
export { spriteArt, spriteArtUrl } from "./sprites";
export type { ArtSprite } from "./types";

const disabled = (): boolean => new URLSearchParams(location.search).get("skillart") === "off";

export async function preloadSkillArt(): Promise<void> {
  if (disabled()) return;
  await Promise.all([loadIcons(), loadSprites()]);
}
