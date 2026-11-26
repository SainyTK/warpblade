import type { Recharge } from "../../types/drill";

export const idleRecharge = (): Recharge => ({ remaining: 0, duration: 0 });

export function startRecharge(recharge: Recharge, duration: number): void {
  recharge.duration = duration;
  recharge.remaining = duration;
}

export function tickRecharge(recharge: Recharge, dt: number): void {
  recharge.remaining = Math.max(0, recharge.remaining - dt);
}

export const rechargeLeft = ({ remaining, duration }: Recharge): number => (duration > 0 ? remaining / duration : 0);
