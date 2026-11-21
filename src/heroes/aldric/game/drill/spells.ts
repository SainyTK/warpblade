import { markFoe } from "../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { hero, progress } from "../../../../game/state";
import type { DrillSpell } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { DAWN_STATUS } from "../../constants/drill/spells";

function lanceMark(foe: Enemy): void {
  markFoe(foe, "al_lance", DAWN_STATUS.markTime, DAWN_STATUS.mark);
}

function pillarStun(foe: Enemy): void {
  staggerFoe(foe, DAWN_STATUS.stun);
}

function mendingLight(_foe: Enemy): void {
  hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * DAWN_STATUS.heal);
}

export const ALDRIC_SPELLS: readonly DrillSpell[] = [
  {
    id: "lance",
    art: "spell1",
    name: "Dawn Lance",
    color: 0xffd463,
    core: 0xfffbe8,
    damage: 30,
    speed: 236,
    delay: 0,
    range: 140,
    radius: 15,
    look: "shard",
    freeze: 0,
    status: lanceMark,
  },
  {
    id: "pillar",
    art: "spell2",
    name: "Sunpillar",
    color: 0xffb53d,
    core: 0xfff3c4,
    damage: 44,
    speed: null,
    delay: 0.13,
    range: 135,
    radius: 22,
    look: "spark",
    freeze: 0,
    status: pillarStun,
  },
  {
    id: "mend",
    art: "spell3",
    name: "Mending Light",
    color: 0xfff0b0,
    core: 0xffffff,
    damage: 26,
    speed: null,
    delay: 0.05,
    range: 64,
    radius: 30,
    look: "flame",
    freeze: 0,
    status: mendingLight,
  },
];
