import atlasUrl from "./assets/atlas.webp?url";
import sheetJson from "./assets/sheet.json";
import type { SkillArtSheet } from "./types";

const sheet: SkillArtSheet = sheetJson;
const urls = new Map<string, string>();

const disabled = (): boolean => new URLSearchParams(location.search).get("skillart") === "off";

export async function preloadSkillArt(): Promise<void> {
  if (disabled()) return;
  try {
    const image = new Image();
    image.src = atlasUrl;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = sheet.size;
    canvas.height = sheet.size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    sheet.icons.forEach((id, i) => {
      const x = (i % sheet.columns) * sheet.size;
      const y = Math.floor(i / sheet.columns) * sheet.size;
      ctx.clearRect(0, 0, sheet.size, sheet.size);
      ctx.drawImage(image, x, y, sheet.size, sheet.size, 0, 0, sheet.size, sheet.size);
      urls.set(id, canvas.toDataURL());
    });
  } catch {
    urls.clear();
  }
}

export const skillArtUrl = (id: string): string | undefined => urls.get(id);

export const hasSkillArt = (id: string): boolean => urls.has(id);
