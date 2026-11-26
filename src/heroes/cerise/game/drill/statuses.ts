import { addStacks } from "../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { roseMark } from "../mark";
import { drillNumbers } from "./skills/numbers";

export function markWithRose(foe: Enemy): void {
  roseMark(foe);
}

export function staggerWithFlurry(foe: Enemy): void {
  staggerFoe(foe, 0.24 + (drillNumbers("ce_needle").stagger ?? 0));
}

export function bindWithBloom(foe: Enemy): void {
  const bloom = drillNumbers("ce_bloom");
  const hold = 0.8 + (bloom.hold ?? 0);
  foe.pinned = Math.max(foe.pinned, hold);
  foe.halt = Math.max(foe.halt, hold);
  if (bloom.bleed) {
    addStacks(foe, "ce_bloom", {
      stacks: 1,
      max: 5,
      damage: progress.stats.ap * bloom.bleed,
      every: 0.4,
      duration: 2.4,
    });
  }
}
