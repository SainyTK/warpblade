import { isFree } from "../../../game/hero/actions";
import { blowsDone } from "../../../game/hero/combo";
import { hero } from "../../../game/state";
import { cutLine, lineCuttable } from "./brushline";
import { clickCounter } from "./counter";
import { clickRise } from "./moonrise";
import { clickCast } from "./spells";
import { saya } from "./state";

/** a shared action may cut her own states once they have landed: Brushline's dash, Moonrise's draw, the counter's cut,
 *  a spell's release from the shared cast; Silent Moon and Still Water hold */
export function sayaMayAct(): boolean {
  switch (hero.state) {
    case "line":
      return lineCuttable();
    case "rise":
    case "counter":
    case "cast":
      return saya.struck;
    case "moon":
    case "still":
      return false;
    default:
      return isFree() || blowsDone();
  }
}

/** through Brushline, Moonrise, the counter draw and a spell a shared press waits for the moment it may cut them; a press
 *  that can cut is used at once, and one made before the blow lands is still there on the step after it */
export const sayaHoldsPresses = (): boolean =>
  hero.state === "line" || hero.state === "rise" || hero.state === "counter" || hero.state === "cast";

/** a shared action cuts one of her states before its click: the click plays now, so no stored cut is lost; a dodge out
 *  of a spell before it is out keeps the early release */
export function sayaCutForAction(): void {
  if (hero.state === "line") cutLine();
  if (saya.clicked) return;
  if (hero.state === "rise") clickRise();
  if (hero.state === "counter") clickCounter();
  if (hero.state === "cast" && saya.struck) clickCast();
}
