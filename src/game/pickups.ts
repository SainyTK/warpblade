import { PAL } from "../constants/palette";
import { sfx } from "../services/audio";
import { PK } from "../types/particle";
import { coop } from "./coopHooks";
import { game, hero, particles, progress } from "./state";

const HOMING_DELAY = 0.35;
const RESTORE = { mp: 7, hp: 8 } as const;

/** orbs burst out, slow down, then home in on Kael's chest */
export function updatePickups(dt: number): void {
  const room = coop();
  for (const o of game.pickups) {
    room?.nearest(o.x, o.y);
    o.t += dt;
    const dx = hero.x - o.x;
    const dy = hero.y - 18 - o.y;
    const d = Math.hypot(dx, dy) || 1;
    if (o.t < HOMING_DELAY) {
      o.vx -= o.vx * 3 * dt;
      o.vy -= o.vy * 3 * dt;
    } else {
      o.vx += (dx / d) * 1100 * dt;
      o.vy += (dy / d) * 1100 * dt;
      const sp = Math.hypot(o.vx, o.vy);
      if (sp > 260) {
        o.vx *= 260 / sp;
        o.vy *= 260 / sp;
      }
    }
    o.x += o.vx * dt;
    o.y += o.vy * dt;
    if (o.t > HOMING_DELAY && d < 8 && hero.state !== "dead") {
      o.done = true;
      if (o.kind === "mp") hero.mp = Math.min(progress.stats.mp, hero.mp + RESTORE.mp);
      else hero.hp = Math.min(progress.stats.hp, hero.hp + RESTORE.hp);
      particles.spawn(PK.STAR, o.x, o.y, 0, -10, 0.3, {
        col: o.kind === "mp" ? PAL.crystal[4] : PAL.heal[3],
        size: 2.5,
      });
      sfx.pickup();
    }
  }
  game.pickups = game.pickups.filter((o) => !o.done);
}
