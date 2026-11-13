import { cutForSharedAction, maySharedAct } from "../sharedCut";

/** an ability on I may start now, when a shared action may cut in; it ends what she was doing */
export function startCasting(): boolean {
  if (!maySharedAct()) return false;
  cutForSharedAction();
  return true;
}
