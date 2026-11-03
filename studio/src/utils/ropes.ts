import { Chain } from '@game/game/hero/chain';
import type { Pose } from '@game/types/pose';
import { scarfAnchor, tailAnchor } from '@game/utils/poseFrame';
import { WORLD_STEP } from '@/constants/stage';
import type { Point } from '@/types/studio';

/** Steps a still pose this many times so the scarf and ponytail hang naturally. */
const SETTLE_STEPS = 90;

/**
 * Kael's scarf and ponytail, simulated with the game's own rope and anchored the way animateHero anchors them,
 * with Kael facing right at `root`.
 */
export class RopeRig {
  private scarf = new Chain(8, 2.2, 340);
  private tail = new Chain(4, 2, 300);
  private t = 0;

  step(pose: Pose, root: { x: number; y: number }, vx = 0): void {
    this.t += WORLD_STEP;
    const wind = -(22 + Math.sin(this.t * 3.1) * 18) - vx * 1.4;
    const [kx, ky] = scarfAnchor(pose);
    const [tx, ty] = tailAnchor(pose);
    this.scarf.step(root.x + kx, root.y + ky, WORLD_STEP, wind);
    this.tail.step(root.x + tx, root.y + ty, WORLD_STEP, wind * 0.6);
  }

  /** A fresh rig at rest for a still pose. */
  static settled(pose: Pose): RopeRig {
    const rig = new RopeRig();
    for (let i = 0; i < SETTLE_STEPS; i++) {
      rig.step(pose, { x: 0, y: 0 });
    }
    return rig;
  }

  /** The ropes in local pixels from Kael's feet, as drawHero takes them. */
  look(root: { x: number; y: number }): { scarf: Point[]; tail: Point[] } {
    const local = (q: { x: number; y: number }): Point => [q.x - root.x, q.y - root.y];
    return { scarf: this.scarf.points.map(local), tail: this.tail.points.map(local) };
  }
}
