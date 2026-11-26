import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { BLIGHT } from "../../colors";
import { drawRotcrawler } from "./drawRotcrawler";
import { crawlerTakes, rolling, updateRotcrawler } from "./rotcrawler";

export const rotcrawler: EnemyKind = {
  flies: false,
  box: (e) => (rolling(e) ? [e.x - 7, e.y - 14, e.x + 7, e.y] : [e.x - 11, e.y - 14, e.x + 12, e.y]),
  center: (e) => [e.x, e.y - 7],
  rest: "walk",
  firstCooldown: () => rng.range(1, 1.6),
  rift: { height: 12, y: () => GROUND, riftY: () => GROUND - 10 },
  update: updateRotcrawler,
  draw: drawRotcrawler,
  glow: { radius: 18, color: BLIGHT.spore[2], eyeY: -2 },
  takes: crawlerTakes,
  orbs: 2,
  heartChance: 0.2,
};
