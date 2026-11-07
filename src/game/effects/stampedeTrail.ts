import { ENEMIES } from "../../constants/enemies";
import { TRAIL } from "../../constants/hulda/stampede";
import { glowLine, place, px } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { enemyCenter } from "../enemies/enemy";
import { game, rng } from "../state";
import { dust } from "../world";

/** one piece of the trail: where it lies, how hard it strikes and how it behaves, all fixed when it is laid */
export interface TrailPiece {
  x: number;
  y: number;
  /** its width along the floor; pieces lie end to end, so a foe stands over one at a time */
  w: number;
  damage: number;
  twice: boolean;
  launch: boolean;
  /** seconds the evolved trail stays, striking every `TRAIL.every`; 0 for the plain trail */
  stay: number;
}

/** the times a piece strikes, from when it is laid */
function strikeTimes(p: TrailPiece): number[] {
  if (p.stay > 0)
    return Array.from({ length: Math.floor(p.stay / TRAIL.every) }, (_, i) => TRAIL.first + i * TRAIL.every);
  return p.twice ? [TRAIL.first, TRAIL.second] : [TRAIL.first];
}

/**
 * A piece of Stampede's cracked trail: it lies dark on the floor behind the Bull Rush and cracks open a moment later,
 * striking every foe standing over it (again later at higher levels, and over and over while the evolved trail stays).
 * Its hits are the skill's own.
 */
export function createTrailPiece(p: TrailPiece, ramp: Ramp): Effect {
  const times = strikeTimes(p);
  const last = times[times.length - 1];
  const depth = Array.from({ length: Math.ceil(p.w) + 1 }, () => rng.int(0, 2));
  let t = 0;
  let flash = 0;
  const strike = () => {
    flash = 1;
    for (const e of game.enemies) {
      if (e.hp <= 0) continue;
      const [cx, cy] = enemyCenter(e);
      if (Math.abs(cx - p.x) > p.w / 2 || cy < p.y - TRAIL.reach || cy > p.y + 2) continue;
      const minion = ENEMIES[e.type].launchable;
      dealDamage(e, p.damage, {
        source: "h_stampede",
        fromX: p.x,
        kx: 0,
        launch: p.launch && minion ? TRAIL.launch : undefined,
        heavy: true,
      });
    }
    dust(p.x, p.y, 2);
  };
  return {
    update(dt) {
      const before = t;
      t += dt;
      flash = Math.max(0, flash - dt * 4);
      for (const at of times) if (before < at && t >= at) strike();
      return t < last + TRAIL.fade;
    },
    draw() {},
    drawBack() {
      place();
      const open = clamp(t / TRAIL.first);
      const cool = clamp((t - last) / TRAIL.fade);
      const x0 = p.x - p.w / 2;
      const hot = flash > 0.3 ? ramp[6] : ramp[open >= 1 ? 4 : 2];
      for (let i = 0; i < depth.length; i++) {
        px(x0 + i, p.y + depth[i], hot, (0.4 + open * 0.6) * (1 - cool));
        px(x0 + i, p.y + depth[i] + 1, ramp[1], 1 - cool);
      }
      if (flash > 0) glowLine(x0, p.y, x0 + p.w, p.y, 7, ramp[4], 0.6 * flash);
    },
  };
}
