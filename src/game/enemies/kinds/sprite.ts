import { rng } from "../../state";
import { PRISM } from "../twilight/colors";
import { drawSprite } from "../twilight/drawSprite";
import { updateSprite } from "../twilight/sprite";
import type { EnemyKind } from "./kind";

/** the Prism Sprite of the twilight: a crystal fairy that blinks around Kael and fires fans of prism shards */
export const sprite: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 6, e.y - 8, e.x + 6, e.y + 8],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.8, 1.8),
  rift: { height: 11, y: () => rng.range(40, 100), riftY: (y) => y },
  update: updateSprite,
  draw: drawSprite,
  glow: { radius: 16, color: PRISM[3], eyeY: -6 },
  evades: true,
};
