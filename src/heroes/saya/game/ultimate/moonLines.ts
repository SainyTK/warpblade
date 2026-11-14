import { W } from "../../../../constants/stage";
import { hairline, line, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { skin } from "../../../../game/hero/skin";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, lights } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { SILENT_MOON } from "../../constants/moon";
import { ECHO_DELAY } from "../../constants/release";
import { SKILL } from "../../constants/skills/ids";
import { BEATS } from "../../constants/timing";
import { createInkBurst } from "../effects/inkBurst";

/** one line across the stage: a point it passes through and its angle */
interface MoonLine {
  x: number;
  y: number;
  a: number;
}

/** how far a point is from a line */
const off = (l: MoonLine, x: number, y: number): number =>
  Math.abs((x - l.x) * Math.sin(l.a) - (y - l.y) * Math.cos(l.a));

/** each line through a foe on screen, nearest first and round again, at an angle the caller picks */
export function aimLines(count: number, angle: () => number, foes: readonly Enemy[]): MoonLine[] {
  if (!foes.length) return [];
  return Array.from({ length: count }, (_, i) => {
    const [x, y] = enemyCenter(foes[i % foes.length]);
    return { x, y, a: angle() };
  });
}

/** what Silent Moon's skill adds to the burst: a damage-taken mark, and a second burst */
export interface MoonExtra {
  mark: number;
  twice: boolean;
}

/** every foe on a line takes `blow` for each line through it, and is marked */
function burstLines(lines: readonly MoonLine[], blow: number, extra: MoonExtra): void {
  for (const e of foesOnScreen()) {
    const [cx, cy] = enemyCenter(e);
    const on = lines.filter((l) => off(l, cx, cy) < SILENT_MOON.width);
    if (!on.length) continue;
    game.fx.push(
      createInkBurst(
        cx,
        cy,
        on.map((l) => l.a),
        true,
      ),
    );
    const fromX = e.x + e.face * 10;
    dealDamage(e, blow * on.length, { fromX, stun: SILENT_MOON.stun, ky: -60, heavy: true, source: "ultimate" });
    if (extra.mark) markFoe(e, SKILL.moon, SILENT_MOON.markTime, extra.mark);
  }
}

/**
 * Silent Moon's lines: drawn one after another across the stage while the foes stand still, then at the click every
 * line bursts (twice as New Moon), and each foe takes `blow` for every line through it.
 */
export function createMoonLines(lines: readonly MoonLine[], blow: number, extra: MoonExtra): Effect {
  let t = 0;
  let burst = false;
  let second = !extra.twice;
  const gap = SILENT_MOON.drawn / Math.max(1, lines.length);
  return {
    update(dt) {
      t += dt;
      if (!burst && t >= BEATS.moon.click) {
        burst = true;
        burstLines(lines, blow, extra);
        lights.add(W / 2, 90, 200, skin.ramp[5], 0.5, 0.3);
      }
      if (!second && t >= BEATS.moon.click + ECHO_DELAY) {
        second = true;
        burstLines(lines, blow, extra);
      }
      return t < BEATS.moon.click + ECHO_DELAY + 0.35;
    },
    draw() {
      place();
      const ramp = skin.ramp;
      lines.forEach((l, i) => {
        const shown = clamp((t - i * gap) / 0.08);
        if (shown <= 0) return;
        const fade = burst ? 1 - clamp((t - BEATS.moon.click) / 0.35) : 1;
        if (fade <= 0) return;
        const c = Math.cos(l.a);
        const s = Math.sin(l.a);
        const reach = W * shown;
        const [x0, y0, x1, y1] = [l.x - c * reach, l.y - s * reach, l.x + c * reach, l.y + s * reach];
        const w = burst ? 2 * fade : 0.6;
        line(x0, y0, x1, y1, ramp[1], fade);
        if (w > 1) line(x0 - s, y0 + c, x1 - s, y1 + c, ramp[2], fade);
        hairline(x0 + s * 0.8, y0 - c * 0.8, x1 + s * 0.8, y1 - c * 0.8, WHITE, fade);
      });
    },
  };
}
