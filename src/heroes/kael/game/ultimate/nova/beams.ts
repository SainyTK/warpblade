import { PAL } from "../../../../../constants/palette";
import { glowLine, line, place, polygon, sparkle } from "../../../../../engine/frame";
import { dealDamage } from "../../../../../game/damage";
import { createImpact } from "../../../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../../../game/enemies/enemy";
import { game, hero } from "../../../../../game/state";
import type { Effect } from "../../../../../types/effect";
import type { Enemy } from "../../../../../types/enemy";
import type { Vec } from "../../../../../types/rig";
import { WHITE } from "../../../../../utils/color";
import { ease } from "../../../../../utils/math";
import { segmentToBox } from "../../../../../utils/segmentToBox";
import { NOVA_RADIUS } from "../../../constants/nova";
import { PRISM_BEAMS as B } from "../../../constants/prism";
import { lodgeShard } from "../../prism/shards";

const P = PAL.prism;
/** a foe counts as crossed when its hit box is this close to the beam, besides the beam's own half width */
const BODY = 6;

/** each beam's way out from the chest: the angles on both sides, mirrored */
const DIRECTIONS: readonly Vec[] = [1, -1].flatMap((side) =>
  B.angles.map((deg): Vec => {
    const a = (deg * Math.PI) / 180;
    return [side * Math.cos(a), -Math.sin(a)];
  }),
);

/**
 * The Prism Knight's addition to Crystal Nova: a moment after the ring, six prism beams shoot out of Kael's chest, level
 * and at an angle up and down to each side. They grow, hold and thin away; every foe a beam crosses takes a share of the
 * ring's blow once from that beam and a prism shard.
 */
export function createPrismBeams(level: number, blow: number): Effect {
  const from: Vec = [hero.x, hero.y - B.chest];
  const reach = NOVA_RADIUS[level - 1] * B.reach;
  const struck: Set<Enemy>[] = DIRECTIONS.map(() => new Set());
  const end = B.grow + B.hold + B.fade;
  let t = -B.delay;
  const length = (): number => reach * ease.outCubic(Math.min(1, Math.max(0, t) / B.grow));
  const tipOf = (d: Vec): Vec => [from[0] + d[0] * length(), from[1] + d[1] * length()];
  const strike = (): void => {
    DIRECTIONS.forEach((d, i) => {
      const tip = tipOf(d);
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck[i].has(e)) continue;
        if (segmentToBox(from, tip, enemyBox(e)) > BODY + B.width / 2) continue;
        struck[i].add(e);
        const center = enemyCenter(e);
        dealDamage(e, blow * B.share, { fromX: from[0], kx: d[0] * 40, source: "ultimate" });
        lodgeShard(e);
        game.fx.push(createImpact(center[0], center[1], Math.sign(d[0]), false));
      }
    });
  };
  return {
    update(dt) {
      t += dt;
      if (t < 0) return true;
      if (t < B.grow + B.hold) strike();
      return t < end;
    },
    draw() {
      if (t < 0) return;
      place();
      const fading = Math.max(0, t - B.grow - B.hold) / B.fade;
      const a = 1 - fading;
      const half = (B.width / 2) * (1 - fading * 0.7);
      for (const d of DIRECTIONS) {
        const tip = tipOf(d);
        const n: Vec = [-d[1] * half, d[0] * half];
        polygon(
          [
            [from[0] + n[0], from[1] + n[1]],
            [tip[0] + n[0], tip[1] + n[1]],
            [tip[0] - n[0], tip[1] - n[1]],
            [from[0] - n[0], from[1] - n[1]],
          ],
          fading > 0.5 ? P[2] : P[3],
          a,
        );
        line(from[0], from[1], tip[0], tip[1], fading > 0.6 ? P[4] : WHITE, a);
        glowLine(from[0], from[1], tip[0], tip[1], 8, P[3], 0.5 * a);
        sparkle(tip[0], tip[1], 3 * a + 1, WHITE, P[4], 0.5 * a);
      }
    },
  };
}
