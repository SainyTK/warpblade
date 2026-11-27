import { drawThrownBlade } from "../../../../game/effects/thrownWeapon";
import { hostMemory, rememberPerSeat } from "../../../../game/seatMemory";
import { THROWN_SPIN } from "../../constants/warp";

const MIDDLE = 15;
const spin = { age: 0 };
rememberPerSeat(hostMemory(spin));

export function spinThrown(dt: number): void {
  spin.age += dt;
}

export function drawSpinningGreatsword(x: number, y: number, angle: number): void {
  const cx = x - Math.cos(angle) * MIDDLE;
  const cy = y - Math.sin(angle) * MIDDLE;
  const turned = angle + spin.age * THROWN_SPIN;
  drawThrownBlade(cx + Math.cos(turned) * MIDDLE, cy + Math.sin(turned) * MIDDLE, turned);
}
