import { heroModule } from "../../../heroes/registry";
import type { SpriteImage } from "../../../types/sprite";
import type { TouchButtonAction } from "../../../types/touch";
import { selectionKey, type TouchSelection } from "../selection";
import { iconFrom } from "./iconArt";
import { DODGE } from "./sharedArt";

export { stickIcon } from "./stickIcons";

/** a button's icon, per hero, action and selected ability; the front dodge is the same for every hero */
export function touchIcon(action: TouchButtonAction, s: TouchSelection): SpriteImage {
  if (action === "dash") return iconFrom("dodge", DODGE);
  return iconFrom(`${action}:${selectionKey(s)}`, heroModule(s.hero).touch.art(action, s.ability, s.known));
}
