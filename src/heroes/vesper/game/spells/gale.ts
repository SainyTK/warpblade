import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { dealDamage } from "../../../../game/damage";
import { enemyBox } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { TAU } from "../../../../utils/math";
import { DUSK_RAMP } from "../../look/colors";

const ID = "ve_gale";
/** the gale's speed along the floor, its half width and height, and how often it can cut the same foe again */
const GUST = { speed: 170, half: 9, tall: 30, again: 0.15 } as const;

interface Gust {
  x: number;
  y: number;
  face: number;
  t: number;
  turned: boolean;
  /** seconds left standing in place, and whether it has stood yet (Twilight Cyclone) */
  stand: number;
  stood: boolean;
  cuts: Map<Enemy, { n: number; next: number }>;
}

/** one gust of the gale running along the floor */
function createGust(x: number, y: number, face: number, power: number): Effect {
  const v = skillValues(ID);
  const life = withBuild("duration", v.life);
  const g: Gust = { x, y, face, t: 0, turned: false, stand: 0, stood: false, cuts: new Map() };
  const damage = progress.stats.ap * v.power * power;
  const strike = (e: Enemy) => {
    const c = g.cuts.get(e) ?? { n: 0, next: 0 };
    if (c.n >= (v.ticks ?? 1) || g.t < c.next) return;
    c.n++;
    c.next = g.t + GUST.again;
    g.cuts.set(e, c);
    const pull = v.pull ? g.face * 60 : g.face * 20;
    dealDamage(e, damage / (v.ticks ?? 1), {
      fromX: g.x - g.face * 6,
      kx: pull,
      launch: -v.launch,
      source: "abilities",
    });
  };
  return {
    update(dt) {
      g.t += dt;
      if (g.stand > 0) {
        g.stand -= dt;
        // standing, it juggles: every foe in it may be cut again on each beat
        if (Math.floor((g.t - dt) / GUST.again) !== Math.floor(g.t / GUST.again)) g.cuts.clear();
      } else g.x += g.face * GUST.speed * dt;
      for (const e of game.enemies) {
        if (e.hp <= 0 || !boxHit([g.x - GUST.half, g.y - GUST.tall, g.x + GUST.half, g.y + 2], enemyBox(e))) continue;
        strike(e);
      }
      if (g.t >= life && !g.turned && v.back) {
        g.turned = true;
        g.face = -g.face;
        g.t = life * 0.4;
        g.cuts.clear();
      }
      if (g.t >= life && !g.stood && skillEvolved(ID)) {
        g.stood = true;
        g.stand = withBuild("duration", v.stand);
      }
      return (g.t < life || g.stand > 0) && g.x > stageLeft() - 10 && g.x < stageRight() + 10;
    },
    draw() {
      place();
      const C = DUSK_RAMP;
      const spin = g.t * 18;
      for (let i = 0; i < 18; i++) {
        const h = (i / 18) * GUST.tall;
        const r = 2 + (h / GUST.tall) * (GUST.half - 2);
        const a = spin + i * 0.9;
        const px = g.x + Math.cos(a) * r;
        const py = g.y - h;
        fleck(px, py, Math.sin(a) > 0 ? C[5] : C[3]);
        if (i % 3 === 0) hairline(px, py, px - Math.sin(a) * 3, py + 0.5, C[4], 0.6);
      }
      for (let k = 0; k < 4; k++) {
        const a = spin * 0.5 + (k * TAU) / 4;
        fleck(g.x + Math.cos(a) * GUST.half, g.y - 1, C[4]);
      }
      glow(g.x, g.y - GUST.tall / 2, 16, C[3], 0.3);
    },
  };
}

/**
 * Dusk Gale: a whirl of violet wind runs along the floor ahead and throws up every foe it meets; its skill turns it back,
 * holds foes in it, sends one each way and drags foes along. Held, it goes both ways (and twice each way once it already
 * does).
 */
export function castGale(power: number, wide: boolean): void {
  const v = skillValues(ID);
  const x = hero.x + hero.face * 10;
  const y = hero.y;
  game.fx.push(createGust(x, y, hero.face, power));
  if (v.both || wide) game.fx.push(createGust(hero.x - hero.face * 10, y, -hero.face, power));
  if (v.both && wide) {
    game.fx.push(createGust(x + hero.face * 14, y, hero.face, power));
    game.fx.push(createGust(hero.x - hero.face * 24, y, -hero.face, power));
  }
}
