import { EMBER } from "../../../../constants/characters/ysra/look";
import { GLAIVE_FEEL } from "../../../../constants/ysra/glaive";
import { JAVELIN } from "../../../../constants/ysra/javelin";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import type { WarpStyle } from "../../../../types/moveset";
import { createFloorRing } from "../../../effects/floorRing";
import { createSlash } from "../../../effects/slash";
import { ignite } from "../../../enemies/burn";
import { meleeHit } from "../../../meleeHit";
import { skillValues } from "../../../skills/query";
import { game, hero } from "../../../state";
import { boxAhead, struckThisSwing } from "../../../world";
import { emitYsra } from "../events";
import { G_WRENCH } from "../glaive/slashes";
import { pinFoe } from "../pin";
import { javelin } from "./memory";
import { startRail } from "./rail";
import { drawThrownGlaive } from "./thrownGlaive";
import { wrenchBurst } from "./wrenchBurst";

/** Ember Javelin's numbers; empty when not held */
const skill = () => skillValues("y_javelin");

/**
 * The arrival: she lands on the haft of the glaive where it stands driven into the foe or the floor, and wrenches it
 * free up and over her head in a burst of embers. It strikes ahead of her and a little behind at exactly the warp's
 * power; Ember Javelin sets the struck foes burning, and Rail Lance pins them.
 */
function wrench(power: number, _foe: Enemy | null, sureCrit: boolean): void {
  const v = skill();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, G_WRENCH));
  wrenchBurst(hero.x + hero.face * JAVELIN.burstAhead, hero.y - JAVELIN.burstUp, hero.face);
  sfx.swing(0.6);
  const box = boxAhead(-JAVELIN.behind, -JAVELIN.height, JAVELIN.ahead, 2);
  meleeHit([box], { power, kx: 110, ky: -150, big: true, sureCrit, feel: GLAIVE_FEEL.rise });
  for (const e of game.enemies) {
    if (e.hp <= 0 || !struckThisSwing(e)) continue;
    if (v.burn) ignite(e, v.burn);
    if (v.pin) pinFoe(e, { time: v.pin, taken: 0, burn: 0 });
  }
}

/** after the wrench: the floor rings with her fire, the line she warped along is told to her other parts (Heat, Ashen
 *  Wake), and Ember Javelin's rail runs back along it */
function arrived(): void {
  game.fx.push(createFloorRing(hero.x, hero.y, 20, EMBER, 0.35));
  emitYsra("warp", { x0: javelin.x0, y0: javelin.y0, x: hero.x, y: hero.y });
  startRail(javelin.x0, hero.x + hero.face * JAVELIN.ahead, hero.y);
}

/** Ysra's warp: the glaive hurled like a javelin, the wrench on arrival, Heat and Ember Javelin's numbers and rail */
export const YSRA_WARP: WarpStyle = {
  drawThrown: drawThrownGlaive,
  strike: wrench,
  arrived,
  tune: () => skill(),
};
