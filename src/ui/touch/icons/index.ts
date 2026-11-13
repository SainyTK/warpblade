import type { SpriteImage } from "../../../types/sprite";
import type { TouchButtonAction } from "../../../types/touch";
import { selectionKey, type TouchSelection } from "../selection";
import { brannocArt } from "./brannocArt";
import { huldaArt } from "./huldaArt";
import { iconFrom } from "./iconArt";
import { joryArt } from "./joryArt";
import { kaelArt } from "./kaelArt";
import { mirelArt } from "./mirelArt";
import { orrinArt } from "./orrinArt";
import { sableArt } from "./sableArt";
import { tallisArt } from "./tallisArt";
import { wennaArt } from "./wennaArt";
import { ysraArt } from "./ysraArt";

export { stickIcon } from "./stickIcons";

/** a button's icon, per hero, action and selected ability or rite */
export function touchIcon(action: TouchButtonAction, s: TouchSelection): SpriteImage {
  const key = `${action}:${selectionKey(s)}`;
  if (s.kit === "sable") return iconFrom(key, sableArt(action));
  if (s.kit === "hulda") return iconFrom(key, huldaArt(action, s.ability, s.known));
  if (s.kit === "orrin") return iconFrom(key, orrinArt(action, s.ability, s.known));
  if (s.kit === "mirel") return iconFrom(key, mirelArt(action, s.ability, s.known));
  if (s.kit === "wenna") return iconFrom(key, wennaArt(action, s.ability, s.known));
  if (s.kit === "tallis") return iconFrom(key, tallisArt(action, s.ability, s.known));
  if (s.kit === "jory") return iconFrom(key, joryArt(action, s.ability, s.known));
  if (s.kit === "brannoc") return iconFrom(key, brannocArt(action, s.ability, s.known));
  return iconFrom(key, s.kit === "ysra" ? ysraArt(action, s.rite) : kaelArt(action, s.ability, s.known));
}
