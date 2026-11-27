import { glowLine, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyBox } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { PHOSPHOR } from "../../constants/colors";
import { loadRounds } from "../chamber";
import { calderFx } from "../skillFx";
import { calder } from "../state";

const SKILL = "ca_tracer";
/** Green Line: how long the line burns, how often it strikes, and how close to it a foe must be */
const LINE = { life: 2, every: 0.25, half: 6 } as const;

/** how far a foe's box is from the segment (x0, y0) to (x1, y1), from its centre */
function nearSegment(cx: number, cy: number, x0: number, y0: number, x1: number, y1: number): number {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const u = Math.max(0, Math.min(1, ((cx - x0) * dx + (cy - y0) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(cx - (x0 + u * dx), cy - (y0 + u * dy));
}

/** Green Line: the tracer's line stays burning on the warp's path and strikes every foe on it */
function createGreenLine(x0: number, y0: number, x1: number, y1: number): Effect {
  const o = { t: 0, tick: 0 };
  const life = withBuild("duration", LINE.life);
  return {
    update(dt) {
      o.t += dt;
      o.tick -= dt;
      if (o.tick > 0) return o.t < life;
      o.tick = LINE.every;
      const damage = progress.stats.ad * skillValues(SKILL).line * LINE.every;
      for (const e of game.enemies) {
        if (e.hp <= 0) continue;
        const [bx0, by0, bx1, by1] = enemyBox(e);
        if (nearSegment((bx0 + bx1) / 2, (by0 + by1) / 2, x0, y0, x1, y1) > LINE.half + (bx1 - bx0) / 2) continue;
        dealDamage(e, damage, { fromX: x0, kx: 0, ky: -10, dot: true, source: SKILL });
      }
      return o.t < life;
    },
    draw() {
      place();
      const k = Math.min(1, (life - o.t) / 0.4);
      hairline(x0, y0, x1, y1, PHOSPHOR[5], k);
      glowLine(x0, y0, x1, y1, 6, PHOSPHOR[4], 0.35 * k);
    },
  };
}

/** Tracer Warp: the arrival loads a round from level 7, and Green Line leaves the warp's path burning */
export const tracerWarp: SkillBehavior = {
  create: () => ({}),
  on: {
    warp(_m, event) {
      const v = skillValues(SKILL);
      if (v.load) loadRounds(v.load);
      const line = { x: calder.warpFromX, y: calder.warpFromY, face: Math.sign(event.x - calder.warpFromX) || 1 };
      const to = { toX: event.x, toY: event.y - 18 };
      calderFx(
        SKILL,
        "trail",
        { ...line, ...to },
        { damage: progress.stats.ad * ((v.line ?? 0) + (v.damage ?? 0) + 0.6) },
      );
      if (skillEvolved(SKILL)) game.fx.push(createGreenLine(calder.warpFromX, calder.warpFromY, event.x, event.y - 18));
    },
  },
};
