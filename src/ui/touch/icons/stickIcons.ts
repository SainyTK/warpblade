import type { SpriteImage } from "../../../types/sprite";
import type { StickDirectionSpec } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt, iconFrom } from "./iconArt";

/** arrows for the stick's directions, as the Controls screen shows them */
const STICK_ARROWS: Record<StickDirectionSpec["direction"], IconArt> = {
  side: { rows: ["..W...W..", ".WW...WW.", "WWW...WWW", ".WW...WW.", "..W...W.."], colors: { W: ICON_WHITE } },
  "far side": { rows: [".W.W.W.W.", "W.W...W.W", ".W.W.W.W."], colors: { W: hex("#e0ac48") } },
  up: {
    rows: ["....W....", "...WWW...", "..WWWWW..", ".WWWWWWW.", "...WWW...", "...WWW..."],
    colors: { W: ICON_WHITE },
  },
  down: {
    rows: ["...WWW...", "...WWW...", ".WWWWWWW.", "..WWWWW..", "...WWW...", "....W...."],
    colors: { W: ICON_WHITE },
  },
};

/** the arrow for one of the stick's directions */
export const stickIcon = (direction: StickDirectionSpec["direction"]): SpriteImage =>
  iconFrom(`stick:${direction}`, STICK_ARROWS[direction]);
