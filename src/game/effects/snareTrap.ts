import { fleck, hairline, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { hex, WHITE } from "../../utils/color";
import { enemyBox } from "../enemies/enemy";
import { jadeLight } from "../hero/sable/effects/jadeLight";
import { game, lights } from "../state";

export interface SnareSet {
  x: number;
  y: number;
  reach: number;
  life: number;
  ramp: Ramp;
  /** times the jaws open again after biting */
  rearm?: number;
  /** a foe walked into the jaws */
  spring(e: Enemy): void;
  /** the snare is gone, sprung or fallen apart */
  gone(): void;
}

/** how long the shut jaws stay on the floor after they spring */
const SHUT = 0.5;
const STEEL = hex("#8a9aa0");
const STEEL_LIGHT = hex("#c8d4d8");
const IRON = hex("#2a3236");
/** the shut jaws jump this long as they bite */
const SNAP = 0.08;
/** the jaws: half the width of the plate between them, teeth each side, the gap between teeth, a tooth's height and
 *  the height of the peak they shut into */
const JAWS = { plate: 2.5, teeth: 5, gap: 1.5, tooth: 1.5, peak: 7 } as const;

/** a hunter's snare on the floor: open steel jaws with a glowing trigger plate, snapping shut on the first foe over it */
export function createSnareTrap(s: SnareSet): Effect {
  let t = 0;
  let shut = -1;
  let rearm = s.rearm ?? 0;
  const finish = () => {
    s.gone();
    return false;
  };
  return {
    update(dt) {
      t += dt;
      if (shut >= 0) {
        shut += dt;
        if (shut < SHUT) return true;
        if (rearm <= 0) return finish();
        rearm--;
        shut = -1;
        t = 0;
        jadeLight(s.x, s.y - 2, "snareSet");
        return true;
      }
      if (t > s.life) return finish();
      if (Math.floor(t * 4) !== Math.floor((t - dt) * 4)) lights.add(s.x, s.y - 2, 8, s.ramp[4], 0.3, 0.25);
      if (t < 0.15) return true;
      const prey = game.enemies.find((e) => {
        if (e.hp <= 0) return false;
        const [x0, , x1, y1] = enemyBox(e);
        return x1 > s.x - s.reach && x0 < s.x + s.reach && y1 > s.y - 6;
      });
      if (!prey) return true;
      shut = 0;
      s.spring(prey);
      jadeLight(s.x, s.y - 4, "snareShut");
      return true;
    },
    drawBack() {
      place();
      const r = s.reach;
      if (shut >= 0) {
        // the jaws shut into a peak, their teeth locked down both edges, fading
        const a = (1 - shut / SHUT) * 2;
        const lean = shut < SNAP ? (1 - shut / SNAP) * 1.5 : 0;
        const peak = s.y - JAWS.peak - lean;
        for (const side of [-1, 1]) {
          const bx = s.x + side * r * 0.6;
          hairline(bx, s.y - 0.5, s.x, peak, STEEL, a);
          hairline(bx + side * 0.5, s.y - 0.5, s.x + side * 0.5, peak, IRON, a);
          for (let i = 1; i < JAWS.teeth; i++) {
            const u = i / JAWS.teeth;
            fleck(bx + (s.x - bx) * u - side * 0.5, s.y - 0.5 + (peak - s.y + 0.5) * u, i % 2 ? STEEL_LIGHT : WHITE, a);
          }
        }
        fleck(s.x, peak - 0.5, WHITE, a);
        return;
      }
      // open jaws lying flat on an iron bar: a row of fine teeth each side, hinge pins at the ends, a plate that pulses
      const pulse = 0.5 + 0.5 * Math.sin(t * 6);
      hairline(s.x - r, s.y - 0.5, s.x + r, s.y - 0.5, IRON);
      hairline(s.x - r, s.y - 1, s.x + r, s.y - 1, IRON);
      for (const side of [-1, 1]) {
        hairline(s.x + side * JAWS.plate, s.y - 1.5, s.x + side * r, s.y - 1.5, STEEL);
        for (let i = 0; i < JAWS.teeth; i++) {
          const tx = s.x + side * (JAWS.plate + 0.75 + i * JAWS.gap);
          if (Math.abs(tx - s.x) > r) continue;
          const tall = i % 2 ? JAWS.tooth : JAWS.tooth - 0.5;
          hairline(tx, s.y - 2, tx, s.y - 1.5 - tall, STEEL_LIGHT);
          fleck(tx, s.y - 2 - tall, WHITE);
        }
        fleck(s.x + side * r, s.y - 1.5, STEEL_LIGHT);
        fleck(s.x + side * r, s.y - 2, STEEL);
      }
      hairline(s.x - JAWS.plate + 0.5, s.y - 1.5, s.x + JAWS.plate - 0.5, s.y - 1.5, s.ramp[3 + Math.round(pulse * 2)]);
      if (pulse > 0.5) hairline(s.x - 1, s.y - 2, s.x + 1, s.y - 2, s.ramp[5]);
    },
    draw() {},
  };
}
