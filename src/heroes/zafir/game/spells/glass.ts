import { fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { foesOnScreen, touches } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { WHITE } from "../../../../utils/color";
import { GRAIN } from "../../constants/palette";
import { GLASS } from "../../constants/spells";
import { openWounds } from "../wounds";

const ID = "za_glass";
/** pale glass, glint to shadow */
const GLASS_LOOK = [WHITE, 0xdff8f2, 0x9ee0d8, 0x4a9a96] as const;

/** one shard falling from above (x, y0) to the floor or the first foe it meets, then shattering */
function createShard(x: number, delay: number, damage: number): Effect {
  let t = -delay;
  const floor = surfaceBelow(x, hero.y - 1);
  let y = floor - GLASS.height;
  let done = false;
  const shatter = () => {
    done = true;
    const v = skillValues(ID);
    const reach = withCharms("area", GLASS.reach + (v.splash ?? 0));
    for (const e of foesOnScreen()) {
      if (!touches(e, x, y, reach)) continue;
      dealDamage(e, damage, { fromX: x, kx: Math.sign(e.x - x) * 30, source: "abilities" });
      openWounds(e, v.wounds ?? 0);
    }
    game.fx.push(createImpact(x, y, 1, false, [WHITE, ...GLASS_LOOK.slice(1)]));
  };
  return {
    update(dt) {
      t += dt;
      if (t < 0) return true;
      if (done) return false;
      y += GLASS.fall * dt;
      const hit = foesOnScreen().some((e) => touches(e, x, y, 3));
      if (hit || y >= floor) shatter();
      return true;
    },
    draw() {
      if (t < 0 || done) return;
      place();
      for (let i = 0; i < 5; i++) fleck(x, y - i, GLASS_LOOK[Math.min(3, i)]);
      fleck(x - 0.5, y - 6, GRAIN[1], 0.5);
      glow(x, y - 2, 4, GLASS_LOOK[2], 0.3);
    },
  };
}

/** where the shards fall: spread over the ground ahead, or, from level 6, on the foes nearest ahead first */
function targets(n: number, dir: number, from: number, to: number, aim: boolean): number[] {
  const ahead = aim
    ? foesOnScreen()
        .filter((e) => (e.x - hero.x) * dir > 0 && Math.abs(e.x - hero.x) <= to)
        .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
        .map((e) => enemyCenter(e)[0])
    : [];
  return Array.from(
    { length: n },
    (_, i) => ahead[i] ?? hero.x + dir * (from + ((to - from) * (i + 0.5)) / n + rng.range(-4, 4)),
  );
}

/** Glass Rain: shards of fused sand fall on the ground ahead and shatter on what they meet; wide, twice as many over
 *  twice the ground; evolved as Glass Storm, a second rain follows round him */
export function castGlass(wide: boolean): void {
  const v = skillValues(ID);
  const n = Math.round(withCharms("amount", v.shards)) * (wide ? 2 : 1);
  const to = GLASS.to * (wide ? 1.6 : 1);
  const damage = progress.stats.ap * v.power;
  const xs = targets(n, hero.face, GLASS.from, to, !!v.aim);
  xs.forEach((x, i) => game.fx.push(createShard(x, i * GLASS.gap, damage)));
  if (!skillEvolved(ID)) return;
  const round = targets(n, -hero.face, GLASS.from, to, true);
  round.forEach((x, i) => game.fx.push(createShard(x, 0.35 + i * GLASS.gap, damage)));
}
