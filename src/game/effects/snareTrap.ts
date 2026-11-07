import { line, place, px } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { hex, WHITE } from "../../utils/color";
import { enemyBox } from "../enemies/enemy";
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
const IRON = hex("#2a3236");

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
        lights.add(s.x, s.y - 2, 14, s.ramp[4], 0.6, 0.2);
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
      lights.add(s.x, s.y - 4, 26, s.ramp[4], 0.9, 0.2);
      return true;
    },
    drawBack() {
      place();
      const r = s.reach;
      if (shut >= 0) {
        // the jaws closed into a peak of teeth, fading
        const a = 1 - shut / SHUT;
        line(s.x - r * 0.6, s.y - 1, s.x, s.y - 7, STEEL, a);
        line(s.x + r * 0.6, s.y - 1, s.x, s.y - 7, STEEL, a);
        for (let i = -2; i <= 2; i++) px(s.x + i * 1.5, s.y - 4 + Math.abs(i), WHITE, a);
        return;
      }
      // open jaws lying flat with teeth up, a plate in the middle that pulses
      const pulse = 0.5 + 0.5 * Math.sin(t * 6);
      line(s.x - r, s.y - 1, s.x + r, s.y - 1, IRON);
      line(s.x - r, s.y - 2, s.x - 3, s.y - 2, STEEL);
      line(s.x + 3, s.y - 2, s.x + r, s.y - 2, STEEL);
      for (let i = 0; i <= 4; i++) {
        px(s.x - r + i * 1.5, s.y - 3, i % 2 ? STEEL : WHITE);
        px(s.x + r - i * 1.5, s.y - 3, i % 2 ? STEEL : WHITE);
      }
      line(s.x - 2, s.y - 2, s.x + 2, s.y - 2, s.ramp[3 + Math.round(pulse * 2)]);
    },
    draw() {},
  };
}
