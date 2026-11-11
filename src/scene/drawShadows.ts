import { castShadow } from "../engine/frame";
import { eachHero } from "../game/coopHooks";
import { enemyBox } from "../game/enemies/enemy";
import { shownKit } from "../game/hero/kits";
import { game, hero } from "../game/state";
import { surfaceBelow } from "../game/world";
import { clamp } from "../utils/math";

/** a body this far above the floor casts no shadow; nearer, the shadow grows and darkens */
const REACH = 90;
/** the darkest a shadow gets, under a body standing on the floor */
const DARK = 0.42;
/** how deep into the floor's edge the shadow shows, in art pixels, and how much of a body's width it spans */
const DEPTH = 3;
const SPAN = 0.6;
const HERO_HALF_WIDTH = 7;

/** one body's shadow on the floor under it: `feet` is its lowest point and `half` half its width, in art pixels */
function shadowUnder(x: number, feet: number, half: number, strength = 1): void {
  const floor = surfaceBelow(x, feet - 1);
  const near = 1 - clamp((floor - feet) / REACH);
  if (near <= 0) return;
  castShadow(x, floor, half * (0.55 + 0.45 * near), DEPTH, DARK * near * strength);
}

/** soft shadows on the floor under every foe and hero, so they stand in the scene */
export function drawShadows(): void {
  for (const e of game.enemies) {
    const [x0, , x1, y1] = enemyBox(e);
    shadowUnder((x0 + x1) / 2, y1, ((x1 - x0) / 2) * SPAN + 2);
  }
  eachHero(() => shadowUnder(hero.x, hero.y, HERO_HALF_WIDTH, shownKit().heroAlpha?.() ?? 1));
}
