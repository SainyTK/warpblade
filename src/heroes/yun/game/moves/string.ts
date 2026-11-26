import { onFrame } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { skin } from "../../../../game/hero/skin";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { dust, shake } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import { SKILL } from "../../constants/skillIds";
import { STRING_CANCEL, STRING_FEEL, STRING_POWER, TIDE_WAVE } from "../../constants/string";
import { SPIRIT } from "../../constants/swords";
import { createDelayed } from "../effects/delayed";
import { createQiWave } from "../effects/qiWave";
import { gainSwords } from "../swords";
import { CRANE, LEAF, TIDE, WILLOW } from "./slashes";

/** Returning Tide meets the floor: a ring and dust, the qi crescent runs along the floor as High Tide shapes it, and a
 *  landed tide gives spirit swords (a missed one too, with Harmony at level 8) */
function tideImpact(hits: number): void {
  const v = skillValues(SKILL.tide);
  const gx = hero.x + hero.face * 20;
  if (hero.ground) {
    game.fx.push(createFloorRing(gx, hero.y, 26, skin.ramp, 0.35));
    dust(gx, hero.y, 6, hero.face);
  }
  const half = TIDE_WAVE.half * (v.tall ?? 1);
  const crescent = {
    reach: TIDE_WAVE.reach + withBuild("area", v.reach ?? 0),
    speed: TIDE_WAVE.speed,
    damage: progress.stats.ad * TIDE_WAVE.power * (v.wave ?? 1),
    half,
    launch: v.launch ? TIDE_WAVE.launch : undefined,
  };
  const ways = skillEvolved(SKILL.tide) ? [hero.face, -hero.face] : [hero.face];
  for (const face of ways) {
    const x = hero.x + face * 20;
    game.fx.push(createQiWave(x, hero.y + 1 - half, face, crescent));
    if (v.twin)
      game.fx.push(
        createDelayed(TIDE_WAVE.twinDelay, () => game.fx.push(createQiWave(x, hero.y + 1 - half, face, crescent))),
      );
  }
  shake(0.18, 2);
  if (hits > 0 || skillValues(SKILL.harmony).tide) gainSwords(v.gain ?? SPIRIT.gain);
}

/**
 * Yun's ground string, one flowing routine of circular cuts with his feet planted: Willow Cut, Turning Leaf, Crane
 * Wheel and Returning Tide, which steps in, knocks down and sends a qi crescent along the floor.
 */
export const STRING_MOVES = {
  willowCut: {
    id: "willowCut",
    name: "Willow Cut",
    clip: "willow",
    pitch: 1.05,
    cancel: STRING_CANCEL.willowCut,
    hits: [
      {
        at: onFrame(5),
        box: [-2, -38, 32, -2],
        power: STRING_POWER.willowCut,
        kx: 10,
        ky: -20,
        slash: WILLOW,
        feel: STRING_FEEL.willowCut,
      },
    ],
  },
  turningLeaf: {
    id: "turningLeaf",
    name: "Turning Leaf",
    clip: "leaf",
    pitch: 1.18,
    cancel: STRING_CANCEL.turningLeaf,
    hits: [
      {
        at: onFrame(5),
        box: [-4, -48, 28, -2],
        power: STRING_POWER.turningLeaf,
        kx: 10,
        ky: -40,
        slash: LEAF,
        feel: STRING_FEEL.turningLeaf,
      },
    ],
  },
  craneWheel: {
    id: "craneWheel",
    name: "Crane Wheel",
    clip: "crane",
    pitch: 0.95,
    cancel: STRING_CANCEL.craneWheel,
    hits: [
      {
        at: onFrame(6),
        box: [-6, -38, 34, -6],
        power: STRING_POWER.craneWheel,
        kx: 12,
        ky: -10,
        slash: CRANE,
        feel: STRING_FEEL.craneWheel,
      },
    ],
  },
  returningTide: {
    id: "returningTide",
    name: "Returning Tide",
    clip: "tide",
    pitch: 0.72,
    cancel: STRING_CANCEL.finisher,
    hits: [
      {
        at: onFrame(7),
        box: [-2, -42, 40, 2],
        power: STRING_POWER.returningTide,
        kx: 60,
        ky: -60,
        stun: 0.8,
        big: true,
        wall: true,
        slash: TIDE,
        feel: STRING_FEEL.returningTide,
      },
    ],
    strides: [{ from: frame(3), to: frame(7), speed: 200 }],
    afterHit: tideImpact,
  },
} satisfies Record<string, MoveDef>;
