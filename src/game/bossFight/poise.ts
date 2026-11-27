import { BOSS_POISE } from "../../constants/bossFight";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { showBanner } from "../state";
import { shake } from "../world";

export interface Poise {
  taken: number;
  fill: number;
  idle: number;
  broken: number;
  breaks: number;
}

export const freshPoise = (): Poise => ({ taken: 0, fill: 0, idle: 0, broken: 0, breaks: 0 });

function breakPoise(p: Poise, boss: Enemy): void {
  p.fill = 1;
  p.broken = BOSS_POISE.broken;
  p.breaks++;
  boss.stun = Math.max(boss.stun, BOSS_POISE.broken);
  boss.vx = 0;
  shake(0.4, 3);
  sfx.shatter();
  showBanner("Staggered", 1.2);
}

export function updatePoise(p: Poise, boss: Enemy, dt: number): void {
  if (p.broken > 0) {
    p.broken -= dt;
    p.taken = 0;
    if (p.broken <= 0 || boss.stun <= 0) {
      p.broken = 0;
      p.fill = 0;
    }
    return;
  }
  if (p.taken > 0) {
    p.fill += p.taken / (boss.max * BOSS_POISE.share * BOSS_POISE.growth ** p.breaks);
    p.taken = 0;
    p.idle = 0;
  } else {
    p.idle += dt;
    if (p.idle > BOSS_POISE.idle) p.fill = Math.max(0, p.fill - BOSS_POISE.drain * dt);
  }
  if (p.fill >= 1) breakPoise(p, boss);
}
