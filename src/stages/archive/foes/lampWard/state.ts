import type { Enemy } from "../../../../types/enemy";

interface Ward {
  lamp: Enemy;
  left: number;
}

const wards = new WeakMap<Enemy, Ward>();

export function setWard(ally: Enemy, lamp: Enemy, seconds: number): void {
  wards.set(ally, { lamp, left: seconds });
}

export function wardHolds(e: Enemy): boolean {
  const ward = wards.get(e);
  return !!ward && ward.left > 0 && ward.lamp.hp > 0 && e.hp > 0;
}

export function ageWard(e: Enemy, dt: number): number {
  const ward = wards.get(e);
  if (!ward) return 0;
  ward.left = Math.max(0, ward.left - dt);
  return wardHolds(e) ? ward.left : 0;
}
