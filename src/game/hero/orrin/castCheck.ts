import { hero } from "../../state";
import { isFree } from "../actions";
import { deny } from "../deny";

/** an ability on I may start: from a free state or a flight, ready, and paid for; a refused press flashes the HUD */
export function canCast(wait: number, mp: number): boolean {
  if (!isFree() && hero.state !== "fly") return false;
  if (wait > 0) {
    deny("cast");
    return false;
  }
  if (hero.mp < mp) {
    deny("mp");
    return false;
  }
  return true;
}
