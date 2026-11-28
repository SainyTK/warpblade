import type { Enemy } from "../../../../types/enemy";
import { COLOSSUS } from "./constants";

export type Recovery = "exposed" | "settle";

const recoveries = new WeakMap<Enemy, Recovery>();

export const isExposed = (e: Enemy): boolean => e.state === "recover" && recoveries.get(e) === "exposed";

export function recoverFrom(e: Enemy, recovery: Recovery): void {
  recoveries.set(e, recovery);
  Object.assign(e, { state: "recover", st: 0 });
}

export const recoveryTime = (e: Enemy): number =>
  recoveries.get(e) === "exposed" ? COLOSSUS.exposed : COLOSSUS.callRecover;
