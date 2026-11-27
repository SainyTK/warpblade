import { fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks } from "../../../../game/enemies/skillStatus";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { game, progress, rng } from "../../../../game/state";
import { boxHit, surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { grain } from "../../../../utils/grain";
import { PHOSPHOR } from "../../constants/colors";
import { FLARE } from "../../constants/shots";
import { roundBlast } from "../effects/roundBlast";
import { calderFx } from "../skillFx";

const SKILL = "ca_flare";

/** the pool of green fire a shell leaves: every foe standing in it burns, held fast from Phosphor Shell's level 4 */
function createFirePool(x: number, y: number, reach: number, time: number): Effect {
  const o = { t: 0, tick: 0 };
  const v = skillValues(SKILL);
  return {
    update(dt) {
      o.t += dt;
      o.tick -= dt;
      if (o.tick <= 0) {
        o.tick = FLARE.burnEvery;
        for (const e of game.enemies) {
          if (e.hp <= 0 || !boxHit([x - reach, y - 26, x + reach, y + 2], enemyBox(e))) continue;
          addStacks(e, SKILL, {
            stacks: 1,
            max: FLARE.burnMax + (v.burnMax ?? 0),
            damage: progress.stats.ap * v.burn,
            every: FLARE.burnEvery,
            duration: FLARE.burnLast,
          });
          if (v.halt) e.halt = Math.max(e.halt, FLARE.burnEvery + 0.05);
        }
      }
      return o.t < time;
    },
    draw() {
      place();
      const k = Math.min(1, (time - o.t) / 0.4);
      const n = Math.round(reach * 1.2);
      for (let i = 0; i < n; i++) {
        const u = (i / n) * 2 - 1;
        const px = x + u * reach;
        const flick = grain(i, Math.floor(o.t * 14));
        const tall = (1 - u * u) * 7 * k * (0.5 + flick * 0.6);
        for (let j = 0; j < tall; j += 0.5) {
          const c = j < 1 ? PHOSPHOR[3] : j < tall * 0.5 ? PHOSPHOR[4] : PHOSPHOR[5];
          fleck(px, y - j, c, k * (1 - j / (tall + 1)) + 0.15);
        }
      }
      glow(x, y - 4, reach + 6, PHOSPHOR[4], 0.35 * k);
    },
  };
}

/** the shell bursts where it lands: a blast that strikes foes around it, then the pool */
function burst(x: number, y: number, power: number, lead: boolean): void {
  const v = skillValues(SKILL);
  const reach = withBuild("area", v.radius);
  roundBlast(x, y - 4, 1, false, true);
  calderFx(
    SKILL,
    "burst",
    { x, y: y - 4, reach: Math.min(7, reach * 0.3) },
    { damage: progress.stats.ap * v.power * power, quiet: !lead },
  );
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.hypot(ex - x, (ey - y) * 1.3) > reach + 6) continue;
    dealDamage(e, progress.stats.ap * v.power * power, {
      fromX: x,
      kx: (Math.sign(ex - x) || 1) * 60,
      ky: v.launch ? -220 : -40,
      source: "abilities",
    });
  }
  game.fx.push(createFirePool(x, y, reach, withBuild("duration", v.time)));
}

/** one shell in flight: it arcs under gravity and bursts on the floor or on the first foe it meets */
function createShell(x: number, y: number, vx: number, power: number, lead: boolean): Effect {
  const o = { x, y, vx, vy: FLARE.vy, t: 0 };
  return {
    update(dt) {
      o.t += dt;
      o.vy += FLARE.gravity * dt;
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      const floor = surfaceBelow(o.x, o.y - 2);
      const hit = game.enemies.some((e) => e.hp > 0 && boxHit([o.x - 2, o.y - 2, o.x + 2, o.y + 2], enemyBox(e)));
      if (o.y < floor && !hit) return o.t < 2;
      burst(o.x, Math.min(o.y, floor), power, lead);
      return false;
    },
    draw() {
      place();
      fleck(o.x, o.y, PHOSPHOR[6]);
      fleck(o.x - Math.sign(o.vx) * 0.5, o.y, PHOSPHOR[5]);
      for (let i = 1; i < 6; i++) fleck(o.x - o.vx * i * 0.006, o.y - o.vy * i * 0.006, PHOSPHOR[4], 1 - i / 6);
      glow(o.x, o.y, 8, PHOSPHOR[4], 0.4);
    },
  };
}

/** Phosphor Shell: one shell lobbed ahead, two from level 6, four evolved; held, two more fan out farther */
export function firePhosphorShell(x: number, y: number, dir: number, wide: boolean): void {
  const v = skillValues(SKILL);
  const count = (v.shells ?? 1) + (wide ? 2 : 0);
  for (let i = 0; i < count; i++) {
    const spread = count > 1 ? (i / (count - 1)) * FLARE.spread : 0;
    game.fx.push(createShell(x, y, dir * (FLARE.vx * 0.7 + spread * 2 + rng.range(-5, 5)), 1, i === 0));
  }
}
