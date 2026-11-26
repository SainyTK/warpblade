import { Chain } from '@game/game/hero/chain';
import type { HeroSkin } from '@game/types/character';
import type { Pose } from '@game/types/pose';
import { sashAnchor, scarfAnchor, tailAnchor } from '@game/utils/poseFrame';
import { WORLD_STEP } from '@/constants/stage';
import type { Point } from '@/types/studio';

/** Steps a still pose this many times so the scarf and ponytail hang naturally. */
const SETTLE_STEPS = 90;
const FLOOR_Y = 0;

/** The hero's scarf (or sash) and ponytail, simulated with the game's own rope and anchored the way the game anchors them. */
export class RopeRig {
  private scarf = new Chain(8, 2.2, 340);
  private tail = new Chain(4, 2, 300);
  private t = 0;
  private readonly sash: boolean;

  constructor(skin: HeroSkin) {
    this.sash = skin.scarfAt === 'belt';
  }

  step(pose: Pose): void {
    this.t += WORLD_STEP;
    const wind = -(22 + Math.sin(this.t * 3.1) * 18);
    const [kx, ky] = this.sash ? sashAnchor(pose) : scarfAnchor(pose);
    const [tx, ty] = tailAnchor(pose);
    this.scarf.step(kx, ky, WORLD_STEP, this.sash ? wind * 0.5 : wind, FLOOR_Y);
    this.tail.step(tx, ty, WORLD_STEP, wind * 0.6, FLOOR_Y);
  }

  static settled(skin: HeroSkin, pose: Pose): RopeRig {
    const rig = new RopeRig(skin);
    for (let i = 0; i < SETTLE_STEPS; i++) {
      rig.step(pose);
    }
    return rig;
  }

  /** The ropes in pixels from the hero's feet, as drawHero takes them. */
  look(): { scarf: Point[]; tail: Point[] } {
    const local = (q: { x: number; y: number }): Point => [q.x, q.y];
    return { scarf: this.scarf.points.map(local), tail: this.tail.points.map(local) };
  }
}
