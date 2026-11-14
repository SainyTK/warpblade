import { fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { DUSK_RAMP, DUSK_SPARKS } from "../../look/colors";
import { gainTempo } from "../tempo";

const ID = "ve_thread";
/** the thread reaches its foe in this long, pulls it in over this long, and throws it up this fast (higher with `high`) */
const PULL = { out: 0.1, back: 0.16, launch: 240, high: 330, stop: 14 } as const;
/** seconds a thread's mark lasts */
const MARK_TIME = 3;

/** a thread of dusk from her hand to a foe: it flies out, catches, pulls the foe to her and throws it up */
function createThread(foe: Enemy, damage: number): Effect {
  const v = skillValues(ID);
  const o = { t: 0, caught: false };
  return {
    update(dt) {
      o.t += dt;
      if (foe.hp <= 0) return false;
      if (!o.caught && o.t >= PULL.out) {
        o.caught = true;
        const [x, y] = enemyCenter(foe);
        const side = Math.sign(x - hero.x) || hero.face;
        // pulled in to stop just in front of her
        foe.vx = ((hero.x + side * PULL.stop - foe.x) / PULL.back) * 0.9;
        dealDamage(foe, damage, { fromX: hero.x, launch: -(v.high ? PULL.high : PULL.launch), source: "abilities" });
        game.fx.push(createImpact(x, y, -side, false, DUSK_SPARKS));
        if (v.mark) markFoe(foe, ID, MARK_TIME, v.mark);
        if (v.tempo) gainTempo(v.tempo);
      }
      return o.t < PULL.out + PULL.back;
    },
    draw() {
      place();
      const [x, y] = enemyCenter(foe);
      const hx = hero.x + hero.face * 8;
      const hy = hero.y - 18;
      const k = o.caught ? 1 : o.t / PULL.out;
      const ex = hx + (x - hx) * k;
      const ey = hy + (y - hy) * k;
      const n = Math.max(2, Math.ceil(Math.hypot(ex - hx, ey - hy) / 1.5));
      for (let i = 0; i <= n; i++) {
        const u = i / n;
        const sag = Math.sin(Math.PI * u) * (o.caught ? 0 : 4);
        fleck(hx + (ex - hx) * u, hy + (ey - hy) * u + sag, i % 3 ? DUSK_RAMP[4] : WHITE);
      }
      glow(ex, ey, 6, DUSK_RAMP[4], 0.5);
    },
  };
}

/**
 * Dusk Thread: a thread flies from her hand to the nearest foes ahead, pulls each in to her and throws it up for her air
 * string; its skill marks the foes, catches more of them and gives Tempo. Held, it catches two more.
 */
export function castThread(power: number, wide: boolean): boolean {
  const v = skillValues(ID);
  const reach = withCharms("area", v.reach);
  const most = withCharms("amount", v.foes) + (wide ? 2 : 0);
  const foes = game.enemies
    .filter((e) => e.hp > 0 && Math.sign(e.x - hero.x) !== -hero.face && Math.abs(e.x - hero.x) <= reach)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
    .slice(0, most);
  const damage = progress.stats.ap * v.power * power;
  for (const foe of foes) game.fx.push(createThread(foe, damage));
  return foes.length > 0;
}
