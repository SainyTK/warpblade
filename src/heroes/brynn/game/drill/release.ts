import { game, lights, progress } from "../../../../game/state";
import { shake } from "../../../../game/world";
import type { SkillCast } from "../../../../types/drill";
import { CRIMSON } from "../../constants/colors";
import { createFloorWave } from "../effects/floorWave";
import { createCrescentWave } from "../effects/heavyWave";
import { createPillars } from "../effects/pillars";
import { createQuake } from "../effects/quake";

const SHARE = 0.35;
const FISSURE_SPEED = 330;

function fissure(x: number, y: number, face: number, reach: number, damage: number): void {
  game.fx.push(
    createFloorWave({ x, y, face, reach, speed: FISSURE_SPEED, damage, kind: "fissure", source: "ultimate" }),
  );
}

function pillars(x: number, y: number, face: number, count: number, damage: number): void {
  game.fx.push(
    createPillars({ x, y, face, count, gap: 26, every: 0.07, delay: 0.05, damage, launch: -230, burn: 1.5 }),
  );
}

export function releaseCrimsonFall({ tier, x, y, face }: SkillCast): void {
  const damage = (tier.damage / 10) * progress.stats.ad * SHARE;
  lights.add(x, y - 14, 34 + tier.level * 10, CRIMSON[4], 0.9, 0.4);
  shake(0.12 + tier.level * 0.05, 1 + tier.level);
  switch (tier.level) {
    case 1:
      game.fx.push(createCrescentWave({ x, y: y - 18, face, reach: tier.reach + 30, damage, source: "ultimate" }));
      return;
    case 2:
      fissure(x, y, face, tier.reach + 40, damage);
      return;
    case 3:
      fissure(x, y, face, tier.reach, damage);
      fissure(x, y, -face, tier.reach * 0.6, damage * 0.6);
      pillars(x + face * 24, y, face, 4, damage * 0.5);
      return;
    default:
      game.fx.push(createQuake({ x, y, reach: 90, damage, delay: 0, launch: -280, height: 40, source: "ultimate" }));
      fissure(x, y, face, tier.reach, damage);
      fissure(x, y, -face, tier.reach, damage);
      pillars(x + face * 24, y, face, 5, damage * 0.5);
      pillars(x - face * 24, y, -face, 5, damage * 0.5);
  }
}
