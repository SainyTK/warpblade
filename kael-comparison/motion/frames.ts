import { STEP } from "../../src/constants/stage";
import { Chain } from "../../src/game/hero/chain";
import type { Vec } from "../../src/types/rig";
import { scarfAnchor, tailAnchor } from "../../src/utils/poseFrame";
import { support } from "./support";
import type { Frame, Motion } from "./types";

const RATE = 60;
const WARMUP = 2;

export function buildFrames(motion: Motion) {
  const count = Math.round(motion.duration * RATE);
  const rate = count / motion.duration;
  const scarf = new Chain(8, 2.2, 340);
  const tail = new Chain(4, 2, 300);
  const frames: Frame[] = [];
  const tick = (time: number, dt: number) => {
    const sample = motion.sample(motion.cycles ? time : Math.max(0, time));
    const pose = support(sample.pose, sample.contacts);
    const earlier = motion.sample(motion.cycles ? time - dt : Math.max(0, time - dt));
    const speed = (sample.root - earlier.root) / dt;
    const wind = -22 - speed * 1.4;
    const [sx, sy] = scarfAnchor(pose);
    const [tx, ty] = tailAnchor(pose);
    scarf.step(sample.root + sx, sy - sample.lift, dt, wind);
    tail.step(sample.root + tx, ty - sample.lift, dt, wind * 0.6);
    const toLocal = ({ x, y }: { x: number; y: number }): Vec => [x - sample.root, y + sample.lift];
    return {
      ...sample,
      pose,
      scroll: motion.scroll ?? 0,
      stageX: motion.scroll || motion.inPlace ? 0 : sample.root,
      look: {
        scarf: scarf.points.map(toLocal),
        tail: tail.points.map(toLocal),
        flare: Math.min(3, Math.abs(speed) * (3 / 115)) + (sample.lift > 0.1 ? 1.5 : 0),
        sword: true,
        turnLegs: true,
      },
    };
  };
  const substeps = Math.ceil(1 / (rate * STEP));
  const dt = 1 / (rate * substeps);
  for (let i = -Math.ceil(WARMUP / dt); i < count * substeps; i++) {
    const sample = tick(i * dt, dt);
    if (i >= 0 && i % substeps === 0) {
      frames.push(sample);
    }
  }
  return { frames, rate };
}
