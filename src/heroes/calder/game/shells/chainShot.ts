import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PHOSPHOR_SPARKS } from "../../constants/colors";
import { ABILITY_COLOR, CHAIN } from "../../constants/shots";
import { calderFx } from "../skillFx";

const SKILL = "ca_chainshot";
/** the chain's half length, and how fast it turns */
const SPIN = { half: 6, rate: 22 } as const;

/**
 * Two weights on a chain, spinning as they fly ahead: each foe in its line is struck once on the way out (twice from
 * level 4), dragged along from level 3 and wrapped fast from level 6. Held, or evolved, it comes back to Calder and
 * strikes again on the way.
 */
function createChain(x: number, y: number, face: number, back: boolean): Effect {
  const v = skillValues(SKILL);
  const o = { x, t: 0, out: true, struck: 0 };
  const struck = new Map<Enemy, number>();
  const per = v.twice ? 2 : 1;
  const life = withBuild("duration", CHAIN.life);
  const half = withBuild("area", CHAIN.half);
  return {
    update(dt) {
      o.t += dt;
      const dir = o.out ? face : -face;
      o.x += dir * CHAIN.speed * dt;
      if (o.out && o.t >= life) {
        if (!back) return false;
        o.out = false;
        struck.clear();
      }
      for (const e of game.enemies) {
        const n = struck.get(e) ?? 0;
        if (n >= per || e.hp <= 0 || !boxHit([o.x - SPIN.half, y - half, o.x + SPIN.half, y + half], enemyBox(e)))
          continue;
        // a second strike on a foe waits until the chain has turned half round
        if (n > 0 && o.t % 0.14 > 0.07) continue;
        struck.set(e, n + 1);
        dealDamage(e, progress.stats.ap * v.power, {
          fromX: o.x - dir * 6,
          kx: dir * (v.drag ? CHAIN.drag : 30),
          ky: -20,
          source: "abilities",
        });
        if (v.wrap) e.halt = Math.max(e.halt, v.wrap);
        game.fx.push(createImpact(o.x, y, dir, false, PHOSPHOR_SPARKS));
        o.struck++;
        const link = { x: o.x - dir * 10, y, face: dir, toX: o.x + dir * 4, toY: y };
        calderFx(SKILL, "bolt", link, { damage: progress.stats.ap * v.power, quiet: o.struck > 1 });
      }
      if (!o.out && Math.abs(o.x - hero.x) < 6) return false;
      return o.t < life * 2.5;
    },
    draw() {
      place();
      const a = o.t * SPIN.rate;
      const dx = Math.cos(a) * SPIN.half;
      const dy = Math.sin(a) * SPIN.half * 0.6;
      const c = ABILITY_COLOR.chain;
      hairline(o.x - dx, y - dy, o.x + dx, y + dy, c);
      for (const s of [-1, 1]) {
        fleck(o.x + s * dx, y + s * dy, c);
        fleck(o.x + s * dx + 0.5, y + s * dy, c);
        fleck(o.x + s * dx, y + s * dy + 0.5, c);
      }
      glow(o.x, y, 9, PHOSPHOR_SPARKS[2], 0.25);
    },
  };
}

/** Chain Shot: the chain spins out ahead; held or evolved it comes back */
export function fireChainShot(x: number, y: number, dir: number, wide: boolean): void {
  game.fx.push(createChain(x, y, dir, wide || skillEvolved(SKILL)));
}
