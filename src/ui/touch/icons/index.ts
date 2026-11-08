import type { SpriteImage } from "../../../types/sprite";
import type { TouchButtonAction } from "../../../types/touch";
import { selectionKey, type TouchSelection } from "../selection";
import { huldaArt } from "./huldaArt";
import { iconFrom } from "./iconArt";
import { kaelArt } from "./kaelArt";
import { orrinArt } from "./orrinArt";
import { sableArt } from "./sableArt";
import { ysraArt } from "./ysraArt";

export { stickIcon } from "./stickIcons";

/** a button's icon, per hero, action and selected ability or rite */
export function touchIcon(action: TouchButtonAction, s: TouchSelection): SpriteImage {
  const key = `${action}:${selectionKey(s)}`;
  if (s.kit === "sable") return iconFrom(key, sableArt(action));
  if (s.kit === "hulda") return iconFrom(key, huldaArt(action, s.ability, s.known));
  if (s.kit === "orrin") return iconFrom(key, orrinArt(action, s.ability, s.known));
  return iconFrom(key, s.kit === "ysra" ? ysraArt(action, s.rite) : kaelArt(action, s.ability, s.known));
}
