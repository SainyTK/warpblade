import { drillSession } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { DefenseCue } from "../../../../../types/drill";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createFloorWave } from "../../effects/floorWave";
import { foesAhead, skillStrike } from "../strike";

const ID = "br_counter";
const REACH = 48;
const seen = new WeakSet<DefenseCue>();

function cleave(power: number, stagger: number, crit: boolean): void {
  for (const foe of foesAhead(REACH)) {
    skillStrike(foe, power, ID, { sureCrit: crit });
    if (stagger) {
      staggerFoe(foe, stagger);
    }
  }
}

export const COUNTER_CLEAVE_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.parryWindow *= 1 + (values.window ?? 0);
  },
  tick(_dt, { values, evolved }) {
    const cue = drillSession()?.defenseCue;
    if (!cue || seen.has(cue)) {
      return;
    }
    seen.add(cue);
    if (cue.kind === "parry" || cue.kind === "enhancedParry") {
      cleave(values.power, values.stagger ?? 0, Boolean(values.crit));
      if (values.wave) {
        game.fx.push(
          createFloorWave({
            x: hero.x,
            y: hero.y,
            face: hero.face,
            reach: 100,
            speed: 300,
            damage: progress.stats.ad * values.wave,
            kind: "rend",
            source: ID,
          }),
        );
      }
    } else if (cue.kind === "block" && evolved) {
      cleave(values.power * values.block, 0, false);
    }
  },
};
