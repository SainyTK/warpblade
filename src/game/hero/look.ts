import type { SpriteCanvas } from "../../engine/sprite";
import { drawHero } from "../../rig";
import type { Pose } from "../../types/pose";
import type { Vec } from "../../types/rig";
import { hero, ponytail, scarf } from "../state";
import { skin } from "./skin";

/**
 * Draw the hero in play into a canvas in this pose, dressed in the skin now applied: their ropes in local pixels, the
 * coat flaring back by `flare`, the sword in the hand unless it flies. Returns where the near hand ended up, as drawn.
 */
export function drawHeroSprite(canvas: SpriteCanvas, pose: Pose, flare: number): Vec {
  const toLocal = (q: { x: number; y: number }): Vec => [(q.x - hero.x) * hero.face, q.y - hero.y];
  return drawHero(canvas, pose, skin, {
    scarf: scarf.points.map(toLocal),
    tail: ponytail.points.map(toLocal),
    flare,
    sword: hero.hasSword,
  });
}
