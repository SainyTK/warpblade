import { launchEnemy } from "../../../../game/enemies/airborne";
import { addStacks, markFoe } from "../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { emitSkillEvent } from "../../../../game/skills/events";
import { hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { DRILL_STATUS } from "../../constants/drill/statuses";

export function liftFoe(foe: Enemy, speed: number): void {
  if (foe.hp <= 0) {
    return;
  }
  launchEnemy(foe, speed);
  if (foe.air) {
    emitSkillEvent({ type: "launch", foe });
  }
}

export function moonLift(foe: Enemy): void {
  liftFoe(foe, DRILL_STATUS.moonLift);
}

export function duskGale(foe: Enemy): void {
  const { stacks, max, power, every, duration } = DRILL_STATUS.galeStacks;
  addStacks(foe, "ve_gale", { stacks, max, damage: progress.stats.ap * power, every, duration });
  foe.vx += Math.sign(foe.x - hero.x || hero.face) * DRILL_STATUS.galePush;
  staggerFoe(foe, DRILL_STATUS.galeStagger);
}

export function duskThread(foe: Enemy): void {
  markFoe(foe, "ve_thread", DRILL_STATUS.threadMark.seconds, DRILL_STATUS.threadMark.bonus);
  foe.vx += Math.sign(hero.x - foe.x) * DRILL_STATUS.threadPull;
}
