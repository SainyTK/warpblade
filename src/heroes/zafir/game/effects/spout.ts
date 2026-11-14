import { fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { withCharms } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { particles, rng } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { TAU } from "../../../../utils/math";
import { SPOUT } from "../../constants/abilities";
import { GRAIN, SAND_RAMP } from "../../constants/palette";

/** what one spout does: its damage per cut, and how far it travels as a multiple of the base */
export interface SpoutSpec {
  damage: number;
  range: number;
  /** its own skill id for a spout a skill raises; left out, his abilities */
  source?: string;
}

/**
 * A sandspout: a small whirl of sand that runs along the floor from (x, y) toward `dir`. A foe it first catches is
 * lifted off its feet, and while it stays in the whirl it is cut again every `SPOUT.every`.
 */
export function createSpout(x0: number, y: number, dir: number, spec: SpoutSpec): Effect {
  let t = 0;
  let x = x0;
  const life = SPOUT.life * spec.range;
  const reach = withCharms("area", SPOUT.reach);
  const next = new Map<Enemy, number>();
  const strike = (e: Enemy) => {
    const first = !next.has(e);
    next.set(e, t + SPOUT.every);
    dealDamage(e, spec.damage, {
      fromX: x - dir * 4,
      kx: dir * 30,
      launch: first ? SPOUT.launch : undefined,
      source: spec.source ?? "abilities",
    });
  };
  const draw = (near: boolean) => {
    place();
    const fade = Math.min(1, (life - t) / 0.2, t / 0.08);
    for (let i = 0; i < 26; i++) {
      const h = (i / 26) * SPOUT.height;
      const r = 2.5 + (h / SPOUT.height) * reach * 0.9;
      const a = t * 14 + i * 1.7;
      if (Math.sin(a) > 0 !== near) continue;
      const c = GRAIN[i % GRAIN.length];
      fleck(x + Math.cos(a) * r, y - h + Math.sin(a) * r * 0.25, c, fade);
      fleck(x + Math.cos(a + 0.4) * r, y - h + Math.sin(a + 0.4) * r * 0.25, c, fade * 0.6);
    }
    if (near) glow(x, y - SPOUT.height * 0.5, reach + 4, SAND_RAMP[3], 0.12 * fade);
  };
  return {
    update(dt) {
      t += dt;
      x += dir * SPOUT.speed * dt;
      if (rng.chance(0.5))
        particles.spawn(PK.DUST, x + rng.range(-4, 4), y - 1, -dir * rng.range(10, 30), -rng.range(5, 20), 0.4, {
          col: GRAIN[3],
          size: 1.4,
        });
      for (const e of foesOnScreen()) {
        const [ex, ey] = enemyCenter(e);
        if (Math.abs(ex - x) > reach + 4 || ey < y - SPOUT.height - 6 || ey > y + 4) continue;
        if ((next.get(e) ?? 0) <= t) strike(e);
      }
      return t < life;
    },
    drawBack: () => draw(false),
    draw: () => draw(true),
  };
}

/** a ring of sand thrown up where a spout or the mirage bursts */
export function sandBurst(x: number, y: number, n: number): void {
  for (let i = 0; i < n; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(40, 140);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * sp, Math.sin(a) * sp - 40, rng.range(0.25, 0.5), {
      col: rng.pick(GRAIN),
      size: rng.range(0.8, 1.6),
    });
  }
}
