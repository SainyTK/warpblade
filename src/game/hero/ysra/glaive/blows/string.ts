import { frame } from "../../../../../constants/hero";
import { GLAIVE_FEEL, GLAIVE_STRING } from "../../../../../constants/ysra/glaive";
import type { MoveDef } from "../../../../../types/move";
import { createFloorRing } from "../../../../effects/floorRing";
import { skillValues } from "../../../../skills/query";
import { game, hero } from "../../../../state";
import { dust } from "../../../../world";
import { skin } from "../../../skin";
import { pinStruck } from "../../pin";
import { glaiveHit } from "../reach";
import { G_IMPALE, G_SWEEP, G_THRUST } from "../slashes";
import { driveStakes } from "../stakes";

/** where the impale bites the floor, ahead of her feet */
function bite(at: number, n: number): void {
  const x = hero.x + hero.face * at;
  dust(x, hero.y, n, hero.face);
  game.fx.push(createFloorRing(x, hero.y, 12, skin.ramp, 0.3));
}

/** Impale's numbers: its power, and how far past the tip it bursts */
const impale = () => skillValues("y_impale");

/** the impale's blow: power and reach from Impale when held */
const impaleHit = (at: number, share: () => number) =>
  glaiveHit(
    {
      at,
      box: [6, -32, 40, 2],
      power: 2.3,
      kx: 40,
      ky: 0,
      stun: 0.8,
      big: true,
      slash: G_IMPALE,
      feel: GLAIVE_FEEL.impale,
    },
    { power: () => (impale().power ?? 2.3) * share(), reach: () => impale().past ?? 0 },
  );

/** the string's last blow, driven through the foe into the floor; with Impale's twist it wrenches in a second time */
function impaleMove(id: "impale" | "impaleTwist"): MoveDef {
  return {
    id,
    name: "Impale",
    clip: "yImpale",
    pitch: 0.55,
    finisher: true,
    strides: [{ from: frame(3), to: frame(8), speed: 85 }],
    hits:
      id === "impale"
        ? [impaleHit(frame(9), () => 1)]
        : [impaleHit(frame(9), () => 1), impaleHit(frame(12), () => impale().twist ?? 0)],
    afterHit: () => {
      if (hero.hitIndex > 1) return;
      bite(28, 8);
      pinStruck();
      driveStakes();
    },
  };
}

/** the glaive string: the hip thrust, the reverse sweep that rises over her head, and the impale; every blow keeps her
 *  feet set except the impale's skip, and every blow before the impale holds the foe until the next one lands */
export const STRING_BLOWS = {
  hipThrust: {
    id: "hipThrust",
    name: "Hip thrust",
    clip: "yHipThrust",
    pitch: 0.85,
    cancel: GLAIVE_STRING.cancel.hip,
    hits: [
      glaiveHit({
        at: frame(6),
        box: [4, -26, 40, -6],
        power: 1.25,
        kx: 40,
        ky: -10,
        stagger: GLAIVE_STRING.stagger,
        slash: G_THRUST,
        feel: GLAIVE_FEEL.thrust,
      }),
    ],
  },
  reverseSweep: {
    id: "reverseSweep",
    name: "Reverse sweep",
    clip: "yReverseSweep",
    pitch: 0.72,
    cancel: GLAIVE_STRING.cancel.sweep,
    hits: [
      glaiveHit({
        at: frame(9),
        box: [-12, -58, 42, -2],
        power: 1.4,
        kx: 60,
        ky: -30,
        stagger: GLAIVE_STRING.stagger,
        slash: G_SWEEP,
        feel: GLAIVE_FEEL.rise,
      }),
    ],
  },
  impale: impaleMove("impale"),
  impaleTwist: impaleMove("impaleTwist"),
} satisfies Record<string, MoveDef>;
