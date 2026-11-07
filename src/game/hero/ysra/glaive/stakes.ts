import { GLAIVE_FEEL } from "../../../../constants/ysra/glaive";
import { meleeHit } from "../../../meleeHit";
import { skillEvolved, skillValues } from "../../../skills/query";
import { game, hero } from "../../../state";
import { boxAhead, newSwing, shake, struckThisSwing } from "../../../world";
import { impalePin, pinFoe } from "../pin";
import { createStakes } from "./effects/stakes";

/** where the row of stakes starts ahead of her feet */
const ROW_FROM = 36;

/** Pillory: the impale drives a row of burning stakes on along the floor; every foe in the row is struck and pinned */
export function driveStakes(): void {
  if (!skillEvolved("y_impale")) return;
  const v = skillValues("y_impale");
  const pin = impalePin();
  game.fx.push(createStakes(hero.x + hero.face * ROW_FROM, hero.y, hero.face, v.stakes));
  shake(0.2, 2.5);
  newSwing();
  meleeHit([boxAhead(ROW_FROM, -30, ROW_FROM + v.stakes, 2)], {
    power: v.power * 0.5,
    kx: 0,
    ky: 0,
    big: true,
    feel: GLAIVE_FEEL.impale,
  });
  if (!pin) return;
  for (const e of game.enemies) if (struckThisSwing(e)) pinFoe(e, pin);
}
