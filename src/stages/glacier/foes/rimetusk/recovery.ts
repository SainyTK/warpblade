import type { Enemy } from "../../../../types/enemy";
import { TUSK } from "./constants";

export type Recovery = "skid" | "toss" | "dazed";

const recoveries = new WeakMap<Enemy, Recovery>();

export const isDazed = (e: Enemy): boolean => e.state === "recover" && recoveries.get(e) === "dazed";

export function recoverFrom(e: Enemy, recovery: Recovery): void {
  recoveries.set(e, recovery);
  Object.assign(e, { state: "recover", st: 0 });
}

export const recoveryTime = (e: Enemy): number => {
  const recovery = recoveries.get(e) ?? "skid";
  if (recovery === "dazed") return TUSK.dazed;
  return recovery === "toss" ? TUSK.tossRecover : TUSK.skid;
};
