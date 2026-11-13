import { cutForSharedAction, maySharedAct } from "../sharedCut";

/**
 * An ability on I may start now: from a free state or once the blow under way has struck, which it then cuts. The shared
 * ability bar has already checked its recharge and its cost.
 */
export function startAbility(): boolean {
  if (!maySharedAct()) return false;
  cutForSharedAction();
  return true;
}
