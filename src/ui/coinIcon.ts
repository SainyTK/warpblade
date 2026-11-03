import { COIN_GOLD as G } from "../constants/palette";
import { SpriteCanvas } from "../engine/sprite";
import { hex } from "../utils/color";
import { spriteUrl } from "./spriteUrl";

const COIN = [".oooo.", "ohhggo", "ohggdo", "oggddo", "ogddko", ".oooo."];
let url = "";

function coinUrl(): string {
  if (url) return url;
  const s = new SpriteCanvas(6, 6, 0, 0);
  s.begin();
  s.pixels(COIN, { o: hex("#3a2408"), h: G[4], g: G[3], d: G[2], k: G[1] }, 0, 0);
  s.commit(false);
  url = spriteUrl(s);
  return url;
}

/** the 6 by 6 pixel coin shown beside every coin amount */
export function coinIcon(): HTMLImageElement {
  const img = document.createElement("img");
  img.className = "coin-icon";
  img.src = coinUrl();
  img.alt = "";
  img.width = 6;
  img.height = 6;
  return img;
}

/** an amount of coins with the coin in front of it */
export function coinAmount(amount: number, cls = "coins"): HTMLSpanElement {
  const el = document.createElement("span");
  el.className = cls;
  el.append(coinIcon(), String(amount));
  return el;
}
