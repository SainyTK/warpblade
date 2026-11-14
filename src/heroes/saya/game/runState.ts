import { hero } from "../../../game/state";
import { runLine } from "./brushline";
import { runCounter } from "./counter";
import { runRise } from "./moonrise";
import { runCast, runStill } from "./spells";
import { runMoon } from "./ultimate/silentMoon";
import { runWarpArrival } from "./warpStyle";

/** Saya's own states, and her click in the shared warp arrival; true when the state is hers alone */
export function runState(): boolean {
  switch (hero.state) {
    case "counter":
      runCounter();
      return true;
    case "line":
      runLine();
      return true;
    case "rise":
      runRise();
      return true;
    case "moon":
      runMoon();
      return true;
    case "still":
      runStill();
      return true;
    case "cast":
      runCast();
      return false;
    case "warpStrike":
      runWarpArrival();
      return false;
    default:
      return false;
  }
}
