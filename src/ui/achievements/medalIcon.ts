import { COIN_GOLD as G } from "../../constants/palette";
import { hex } from "../../utils/color";
import { pixelIconUrl } from "../pixelIconUrl";

/** a trophy on a 9 by 9 pixel grid */
const TROPHY = [
  "ooooooooo",
  "ohhhgggdo",
  "ohhgggddo",
  ".ohgggdo.",
  "..ogggo..",
  "...oko...",
  "...ogo...",
  "..ogggo..",
  ".ooooooo.",
];

const LIT = { o: hex("#3a2408"), h: G[4], g: G[3], d: G[2], k: G[1] };
const DIM = { o: hex("#15122a"), h: hex("#6c6694"), g: hex("#4a4280"), d: hex("#2c2650"), k: hex("#1d1938") };

/** the trophy of an achievement, gold once earned and grey before */
export function medalIcon(earned: boolean, cls = "medal"): HTMLImageElement {
  const img = document.createElement("img");
  img.className = cls;
  img.src = pixelIconUrl(earned ? "trophy-lit" : "trophy-dim", TROPHY, earned ? LIT : DIM);
  img.alt = "";
  img.width = TROPHY[0].length;
  img.height = TROPHY.length;
  return img;
}
