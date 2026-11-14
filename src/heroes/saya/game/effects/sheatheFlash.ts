import { fleck, hairline, place } from "../../../../engine/frame";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { skin } from "../../../../game/hero/skin";
import { game, hero, lights } from "../../../../game/state";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";

/** how long the click's glint lasts, and how far its thin line runs ahead along the scabbard */
const CLICK = { life: 0.16, reach: 14 } as const;

/** the click: a white glint at the scabbard's mouth with a thin line drawn out ahead, and a faint ring on the floor */
export function sheatheFlash(): void {
  const x = hero.x + hero.face * 3;
  const y = hero.y - 15;
  const face = hero.face;
  lights.add(x, y, 16, WHITE, 0.45, 0.12);
  if (hero.ground) game.fx.push(createFloorRing(hero.x, hero.y, 18, skin.ramp, 0.2));
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      return t < CLICK.life;
    },
    draw() {
      place();
      const u = clamp(t / CLICK.life);
      const len = CLICK.reach * (0.3 + u);
      hairline(x, y, x + face * len, y - 0.5, WHITE, 1 - u);
      fleck(x, y, WHITE);
      fleck(x - face * 0.5, y - 0.5, skin.ramp[4], 1 - u);
    },
  });
}
