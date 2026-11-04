import type { SpriteImage } from "../../../types/sprite";
import type { TouchButtonAction } from "../../../types/touch";
import { selectionKey, type TouchSelection } from "../selection";
import { iconFrom } from "./iconArt";
import { kaelArt } from "./kaelArt";
import { ysraArt } from "./ysraArt";

export { stickIcon } from "./stickIcons";

/** a button's icon, per hero, action and selected element or rite */
export const touchIcon = (action: TouchButtonAction, s: TouchSelection): SpriteImage =>
  iconFrom(`${action}:${selectionKey(s)}`, s.kit === "ysra" ? ysraArt(action, s.rite) : kaelArt(action, s.element));
