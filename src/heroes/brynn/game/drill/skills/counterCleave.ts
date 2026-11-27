import { drillSession } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { DefenseCue } from "../../../../../types/drill";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createFloorWave } from "../../effects/floorWave";
import { ARMOUR, brynnFx, CRESCENT } from "../../fx";
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
      const at = { x: hero.x + hero.face * 12, y: hero.y - 16, face: hero.face, reach: 24 };
      brynnFx(ID, "slash", at, { damage: progress.stats.ad * values.power, signature: CRESCENT });
      if (values.wave) {
        brynnFx(
          ID,
          "wave",
          { x: hero.x, y: hero.y, face: hero.face, reach: 100 },
          { damage: progress.stats.ad * values.wave, quiet: true },
        );
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
      const guard = { x: hero.x + hero.face * 10, y: hero.y - 18, face: hero.face, reach: 18 };
      brynnFx(ID, "slash", guard, { damage: progress.stats.ad * values.power * values.block, signature: ARMOUR });
    }
  },
};
