import { game } from "../../game/state";
import type { ArtDef, ArtLevel } from "../../types/art";
import { createRollOn, drawTideBolt, drawTideImpact, markWithInk, TIDE } from "./inkTide";

const CARDS = [
  "Rolling ink hits and marks foes.",
  "More damage; it rolls farther.",
  "More damage; a longer mark.",
  "A wider splash; a deeper mark.",
  "Full power: a towering tide.",
] as const;
const RADIUS = [22, 25, 28, 32, 38] as const;
const RANGE = [130, 140, 150, 160, 175] as const;

const level = (i: number): ArtLevel => ({
  cardText: CARDS[i],
  damageTimesAttack: TIDE.damage[i],
  radius: RADIUS[i],
  range: RANGE[i],
  speed: 150,
  delay: 0,
  freeze: 0,
});

export const inkwave: ArtDef = {
  id: "inkwave",
  name: "Ink Tide",
  element: "void",
  color: 0x6a5cff,
  core: 0xd8d2ff,
  look: "shard",
  levels: [level(0), level(1), level(2), level(3), level(4)],
  status: markWithInk,
  burst(x, y, at) {
    game.fx.push(createRollOn(x, y, at));
  },
  drawBolt: drawTideBolt,
  drawImpact: drawTideImpact,
};
