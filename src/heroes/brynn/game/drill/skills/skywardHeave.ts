import { drillFighter } from "../../../../../drill";
import { launchEnemy } from "../../../../../game/enemies/airborne";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { brynnFx } from "../../fx";
import { later } from "../later";
import { skillStrike } from "../strike";

const ID = "br_launch";
const CRASH_AFTER = 0.45;

export const SKYWARD_HEAVE_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.airSlashes ?? 0;
  },
  swordHit(foe, _infusion, { values, evolved }) {
    const strike = drillFighter()?.swing?.kind;
    if (foe.air && strike !== "second") {
      skillStrike(foe, values.air ?? 0, ID);
    }
    if (strike !== "second") {
      return;
    }
    launchEnemy(foe, -values.launch);
    const floor = surfaceBelow(foe.x, foe.y - 4);
    brynnFx(
      ID,
      "pillar",
      { x: foe.x, y: floor, reach: 30 + values.launch * 0.05 },
      { damage: progress.stats.ad * 1.4 },
    );
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    if (evolved) {
      later(CRASH_AFTER, () => {
        skillStrike(foe, values.crash, ID, { spike: true });
        const [x, y] = enemyCenter(foe);
        brynnFx(ID, "bolt", { x, y, reach: 60 }, { damage: progress.stats.ad * values.crash });
        brynnFx(ID, "nova", { x, y: surfaceBelow(x, y), reach: 24 }, { quiet: true, delay: 0.12 });
      });
    }
  },
};
