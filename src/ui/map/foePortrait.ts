import { foeArtImage } from "../../foeArt";
import { makeEnemy } from "../../game/enemies/enemy";
import { kindOf } from "../../game/enemies/kinds";
import type { EnemyType } from "../../types/enemy";
import type { SpriteImage } from "../../types/sprite";

const cache = new Map<EnemyType, string>();

function bounds(s: SpriteImage) {
  let x0 = s.w;
  let y0 = s.h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < s.h; y++)
    for (let x = 0; x < s.w; x++) {
      if (!s.d[y * s.w + x]) continue;
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
  return x1 < x0 ? { x0: 0, y0: 0, x1: s.w - 1, y1: s.h - 1 } : { x0, y0, x1, y1 };
}

export function foePortrait(type: EnemyType): string {
  const known = cache.get(type);
  if (known) return known;
  const foe = makeEnemy(type, 0, 0, 1);
  foe.face = -1;
  const sprite = foeArtImage(foe, 0.4) ?? kindOf(type).draw(foe, 0.4);
  const box = bounds(sprite);
  const out = document.createElement("canvas");
  out.width = box.x1 - box.x0 + 1;
  out.height = box.y1 - box.y0 + 1;
  const ctx = out.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(out.width, out.height);
  for (let y = box.y0; y <= box.y1; y++)
    for (let x = box.x0; x <= box.x1; x++) {
      const c = sprite.d[y * sprite.w + x];
      if (!c) continue;
      img.data.set([(c >> 16) & 255, (c >> 8) & 255, c & 255, 255], ((y - box.y0) * out.width + (x - box.x0)) * 4);
    }
  ctx.putImageData(img, 0, 0);
  const url = out.toDataURL();
  cache.set(type, url);
  return url;
}
