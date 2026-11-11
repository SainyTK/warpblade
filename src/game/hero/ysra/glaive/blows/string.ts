import { frame } from "../../../../../constants/hero";
import { GLAIVE_FEEL } from "../../../../../constants/ysra/glaive";
import type { MoveDef } from "../../../../../types/move";
import { createFloorRing } from "../../../../effects/floorRing";
import { skillValues } from "../../../../skills/query";
import { game, hero } from "../../../../state";
import { dust } from "../../../../world";
import { skin } from "../../../skin";
import { pinStruck } from "../../pin";
import { glaiveHit } from "../reach";
import { G_CLEAVE, G_IMPALE, G_RAM, G_SKY, G_SWEEP, G_THRUST, G_TWIRL_BACK, G_TWIRL_FRONT } from "../slashes";
import { driveStakes } from "../stakes";

/** where the cleave and the impale bite the floor, ahead of her feet */
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
      stun: 0.6,
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
        : [impaleHit(frame(9), () => 1), impaleHit(frame(13), () => impale().twist ?? 0)],
    afterHit: () => {
      if (hero.hitIndex > 1) return;
      bite(28, 8);
      pinStruck();
      driveStakes();
    },
  };
}

/** the plain glaive string and its situational blows; every blow keeps her feet set except the impale's skip */
export const STRING_BLOWS = {
  hipThrust: {
    id: "hipThrust",
    name: "Hip thrust",
    clip: "yHipThrust",
    pitch: 0.85,
    hits: [
      glaiveHit({
        at: frame(6),
        box: [4, -26, 40, -6],
        power: 1.25,
        kx: 40,
        ky: -10,
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
    hits: [
      glaiveHit({
        at: frame(7),
        box: [-12, -30, 40, -2],
        power: 1.4,
        kx: 60,
        ky: -30,
        slash: G_SWEEP,
        feel: GLAIVE_FEEL.sweep,
      }),
    ],
  },
  overheadCleave: {
    id: "overheadCleave",
    name: "Overhead cleave",
    clip: "yCleave",
    pitch: 0.6,
    hits: [
      glaiveHit({
        at: frame(8),
        box: [6, -46, 42, 2],
        power: 1.9,
        kx: 50,
        ky: 0,
        stun: 0.5,
        big: true,
        slash: G_CLEAVE,
        feel: GLAIVE_FEEL.cleave,
      }),
    ],
    afterHit: () => bite(32, 7),
  },
  twirl: {
    id: "twirl",
    name: "Glaive twirl",
    clip: "yTwirl",
    pitch: 1,
    hits: [
      glaiveHit({
        at: frame(5),
        box: [0, -44, 36, 0],
        power: 0.85,
        kx: 80,
        ky: -20,
        slash: G_TWIRL_FRONT,
        feel: GLAIVE_FEEL.twirl,
      }),
      glaiveHit({
        at: frame(9),
        box: [-36, -44, 0, 0],
        power: 0.85,
        kx: 80,
        ky: -20,
        slash: G_TWIRL_BACK,
        feel: GLAIVE_FEEL.twirl,
      }),
    ],
  },
  haftRam: {
    id: "haftRam",
    name: "Haft ram",
    clip: "yHaftRam",
    pitch: 0.95,
    hits: [
      glaiveHit({
        at: frame(5),
        box: [-30, -28, -2, -4],
        power: 1.1,
        kx: 150,
        ky: -20,
        stun: 0.4,
        slash: G_RAM,
        feel: GLAIVE_FEEL.thrust,
      }),
    ],
  },
  skyThrust: {
    id: "skyThrust",
    name: "Sky thrust",
    clip: "ySkyThrust",
    pitch: 0.95,
    hits: [
      glaiveHit({
        at: frame(5),
        box: [0, -72, 34, -26],
        power: 1.2,
        kx: 60,
        ky: -40,
        slash: G_SKY,
        feel: GLAIVE_FEEL.thrust,
      }),
    ],
  },
  impale: impaleMove("impale"),
  impaleTwist: impaleMove("impaleTwist"),
} satisfies Record<string, MoveDef>;
