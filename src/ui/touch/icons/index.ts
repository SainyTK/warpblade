import type { BrannocAbility } from "../../../types/brannoc";
import type { HuldaAbility } from "../../../types/hulda";
import type { JoryAbility } from "../../../types/jory";
import type { MirelAbility } from "../../../types/mirel";
import type { OrrinAbility } from "../../../types/orrin";
import type { SableAbility } from "../../../types/sable";
import type { KaelAbility } from "../../../types/spell";
import type { SpriteImage } from "../../../types/sprite";
import type { TallisAbility } from "../../../types/tallis";
import type { TouchButtonAction } from "../../../types/touch";
import type { WennaAbility } from "../../../types/wenna";
import type { RiteId } from "../../../types/ysra/pyre";
import { selectionKey, type TouchSelection } from "../selection";
import { brannocArt } from "./brannocArt";
import { huldaArt } from "./huldaArt";
import { iconFrom } from "./iconArt";
import { joryArt } from "./joryArt";
import { kaelArt } from "./kaelArt";
import { mirelArt } from "./mirelArt";
import { orrinArt } from "./orrinArt";
import { sableArt } from "./sableArt";
import { DODGE } from "./sharedArt";
import { tallisArt } from "./tallisArt";
import { wennaArt } from "./wennaArt";
import { ysraArt } from "./ysraArt";

export { stickIcon } from "./stickIcons";

/** a button's icon, per hero, action and selected ability; the front dodge is the same for every hero */
export function touchIcon(action: TouchButtonAction, s: TouchSelection): SpriteImage {
  const key = `${action}:${selectionKey(s)}`;
  if (action === "dash") return iconFrom("dodge", DODGE);
  const known = s.known;
  switch (s.kit) {
    case "sable":
      return iconFrom(key, sableArt(action, s.ability as SableAbility, known as SableAbility[]));
    case "hulda":
      return iconFrom(key, huldaArt(action, s.ability as HuldaAbility, known as HuldaAbility[]));
    case "orrin":
      return iconFrom(key, orrinArt(action, s.ability as OrrinAbility, known as OrrinAbility[]));
    case "mirel":
      return iconFrom(key, mirelArt(action, s.ability as MirelAbility, known as MirelAbility[]));
    case "wenna":
      return iconFrom(key, wennaArt(action, s.ability as WennaAbility, known as WennaAbility[]));
    case "tallis":
      return iconFrom(key, tallisArt(action, s.ability as TallisAbility, known as TallisAbility[]));
    case "jory":
      return iconFrom(key, joryArt(action, s.ability as JoryAbility, known as JoryAbility[]));
    case "brannoc":
      return iconFrom(key, brannocArt(action, s.ability as BrannocAbility, known as BrannocAbility[]));
    case "ysra":
      return iconFrom(key, ysraArt(action, s.ability as RiteId));
    default:
      return iconFrom(key, kaelArt(action, s.ability as KaelAbility, known as KaelAbility[]));
  }
}
