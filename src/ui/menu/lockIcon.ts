import { hex } from "../../utils/color";
import { pixelIconUrl } from "../pixelIconUrl";

/** a padlock on a 7 by 8 pixel grid */
const LOCK = ["..ooo..", ".o...o.", ".o...o.", "ooooooo", "ohhhhgo", "ohhkhgo", "ohgkggo", "ooooooo"];

/** the padlock on a locked hero */
export function lockIcon(): HTMLImageElement {
  const img = document.createElement("img");
  img.className = "lock-icon";
  img.src = pixelIconUrl("lock", LOCK, {
    o: hex("#9a94c4"),
    h: hex("#4a4280"),
    g: hex("#2c2650"),
    k: hex("#0c0a18"),
  });
  img.alt = "";
  img.width = LOCK[0].length;
  img.height = LOCK.length;
  return img;
}
