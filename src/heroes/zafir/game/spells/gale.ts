import { fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { consumeStacks } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { fxRng, game, hero, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import { GRAIN, SAND_RAMP } from "../../constants/palette";
import { GALE } from "../../constants/spells";
import { WOUND, WOUND_SOURCE } from "../../constants/wounds";
import { sandSound } from "../sound";
import { openWounds } from "../wounds";

const ID = "za_gale";

/** a foe inside the cone from (x, y) toward `dir` */
function inCone(ex: number, ey: number, x: number, y: number, dir: number, reach: number, spread: number): boolean {
  const ahead = (ex - x) * dir;
  if (ahead < -4 || ahead > reach) return false;
  return Math.abs(ey - y) <= 6 + (spread * Math.max(0, ahead)) / reach;
}

/** Simoom: a foe's open wounds all bleed at once, for what they would have bled in full */
function bleedOut(e: (typeof game.enemies)[number]): void {
  const n = consumeStacks(e, WOUND_SOURCE);
  if (!n) return;
  const ticks = (skillValues("za_deep").life ?? WOUND.life) / (skillValues("za_deep").every ?? WOUND.every);
  dealDamage(e, progress.stats.ad * (skillValues("za_deep").per ?? WOUND.per) * n * ticks, { source: ID });
}

/** the visible gust: streaks of hot air and grains running out along the cone */
function createGust(x: number, y: number, dir: number, reach: number, spread: number): Effect {
  let t = 0;
  const seeds = Array.from({ length: 28 }, () => [fxRng.range(0, 1), fxRng.range(-1, 1), fxRng.range(0.6, 1)] as const);
  return {
    update(dt) {
      t += dt;
      return t < GALE.life;
    },
    draw() {
      place();
      const u = t / GALE.life;
      for (const [i, [a, b, sp]] of seeds.entries()) {
        const d = Math.min(1, a * 0.3 + u * sp * 1.4) * reach;
        const gx = x + dir * d;
        const gy = y + b * (6 + (spread * d) / reach);
        fleck(gx, gy, GRAIN[i % GRAIN.length], 1 - u);
        fleck(gx - dir * 2, gy, SAND_RAMP[4], (1 - u) * 0.5);
      }
      glow(x + dir * reach * 0.5 * u, y, 14, SAND_RAMP[3], 0.18 * (1 - u));
    },
  };
}

/** Hot Gale: a cone of hot wind that cuts and pushes every foe in it, opens wounds and halts walkers as it levels; the
 *  wide form, or level 7, blows both ways; evolved as Simoom, every wound it meets bleeds out at once */
export function castGale(wide: boolean): void {
  const v = skillValues(ID);
  const reach = withBuild("area", GALE.reach * (v.reach ?? 1));
  const spread = GALE.spread * (v.reach ?? 1);
  const y = hero.y - 16;
  const dirs = wide || v.both ? [hero.face, -hero.face] : [hero.face];
  for (const dir of dirs) {
    game.fx.push(createGust(hero.x, y, dir, reach, spread));
    for (const e of foesOnScreen()) {
      const [ex, ey] = enemyCenter(e);
      if (!inCone(ex, ey, hero.x, y, dir, reach, spread)) continue;
      if (skillEvolved(ID)) bleedOut(e);
      dealDamage(e, progress.stats.ap * v.power, { fromX: hero.x, kx: dir * GALE.push, source: "abilities" });
      openWounds(e, v.wounds ?? 0);
      if (v.halt) e.halt = Math.max(e.halt, withBuild("duration", v.halt));
    }
  }
  sandSound.gust(0.14);
}
