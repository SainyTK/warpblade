import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { game } from "../../../../game/state";
import type { Box } from "../../../../types/world";
import { FOE } from "../colors";
import { updatePagewyrm, wyrmUnderground } from "./behavior";
import { drawPagewyrm } from "./draw";
import { headBox, wyrmPose } from "./pose";

const HIDDEN = 60;

function box(e: Parameters<EnemyKind["box"]>[0]): Box {
  if (wyrmUnderground(e)) return [e.x - 2, GROUND + HIDDEN, e.x + 2, GROUND + HIDDEN + 4];
  const pose = wyrmPose(e, game.t);
  const [h0, h1, h2, h3] = headBox(e, pose.main);
  const top = Math.min(h1, GROUND - 6);
  return [Math.min(h0, e.x - 8), top, Math.max(h2, e.x + 8), Math.max(h3, GROUND)];
}

export const pagewyrm: EnemyKind = {
  flies: false,
  box,
  center: (e) => {
    if (wyrmUnderground(e)) return [e.x, GROUND - 2];
    const [hx, hy] = wyrmPose(e, game.t).main.head;
    return [e.x + e.face * hx, e.y + hy];
  },
  rest: "walk",
  firstCooldown: () => 1.6,
  rift: { height: 30, y: () => GROUND, riftY: () => GROUND - 26 },
  update: updatePagewyrm,
  draw: drawPagewyrm,
  glow: { radius: 34, color: FOE.letter, eyeY: 0 },
  steady: (e) => e.state !== "recover",
};
