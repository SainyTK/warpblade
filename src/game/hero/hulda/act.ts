import { hero } from "../../state";
import { isFree } from "../actions";
import { unclaim } from "./claims";
import { drop } from "./hold";
import { hulda } from "./memory";
import { dropCarried } from "./rush";

/**
 * When the shared moves (warp, guard, dodge, ability, ultimate) may cut in on what she does: once a blow, a throw, a
 * roar, a stomp or a release has landed, once the rush or Skyfall Grab is in its recovery, and whenever she is free. A
 * foe in her hands, a taunt, a chain still out and a ride on a big foe run to their end.
 */
export function huldaMayAct(): boolean {
  const h = hero;
  switch (h.state) {
    case "fist":
    case "airFist":
      return hulda.struck;
    case "rush":
    case "skyfall":
      return hulda.landed;
    case "toss":
      return hulda.struck && !hulda.held;
    case "bellow":
    case "stomp":
    case "brace":
      return h.hitDone;
    case "hold":
    case "knee":
    case "taunt":
    case "chain":
    case "ride":
      return false;
    default:
      return isFree();
  }
}

/** a shared move cuts in: the string ends, a held foe is let go, foes on her shoulder drop */
export function huldaCut(): void {
  if (hulda.held) drop();
  dropCarried();
  if (hulda.ridden) unclaim(hulda.ridden);
  hulda.ridden = null;
  hulda.queued = false;
  hulda.link = 0;
}
