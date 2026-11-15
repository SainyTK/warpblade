import { isFree } from "../../../game/hero/actions";
import { blowsDone } from "../../../game/hero/combo";
import { hero } from "../../../game/state";
import { cutLine, lineCuttable } from "./brushline";
import { clickCounter } from "./counter";
import { clickRise } from "./moonrise";
import { saya } from "./state";

/** a shared action may cut her own states once they have landed: Brushline's dash, Moonrise's draw, the counter's cut;
 *  Silent Moon and Still Water hold */
export function sayaMayAct(): boolean {
  switch (hero.state) {
    case "line":
      return lineCuttable();
    case "rise":
    case "counter":
      return saya.struck;
    case "moon":
    case "still":
      return false;
    default:
      return isFree() || blowsDone();
  }
}

/** a shared action cuts one of her states before its click: the click plays now, so no stored cut is lost */
export function sayaCutForAction(): void {
  if (hero.state === "line") cutLine();
  if (saya.clicked) return;
  if (hero.state === "rise") clickRise();
  if (hero.state === "counter") clickCounter();
}
