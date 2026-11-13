import { maySharedAct } from "../sharedCut";
import { mirel } from "./memory";

/** an ability on I may start now: when the shared actions may cut in, or from a hover */
export const mayCast = (): boolean => maySharedAct() || mirel.hovering;
