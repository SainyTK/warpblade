import { ultimateValues } from "../../../../game/hero/ultimate";
import { game, hero } from "../../../../game/state";
import { muzzlePoint } from "../aim";
import { createMuzzleFlash } from "../effects/muzzleFlash";
import { createSlug } from "../shots/slug";

/** the sword's angle as the breaching shot leaves: level */
const FINALE_ANGLE = 0;

/** Cylinder Break's skill from level 4: the run ends in a breaching slug across the screen, `finale` times a cut */
export function breakFinale(blow: number): void {
  const finale = ultimateValues().finale;
  if (!finale) return;
  const [x, y] = muzzlePoint(hero.face > 0 ? FINALE_ANGLE : Math.PI - FINALE_ANGLE);
  game.fx.push(createMuzzleFlash(x, y, hero.face > 0 ? FINALE_ANGLE : Math.PI));
  game.fx.push(createSlug(x, y, hero.face, { damage: blow * finale, wide: true, source: "ultimate" }));
}
