import { enemyCenter } from "../../../../../game/enemies/enemy";
import { hero, progress } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { calderFx } from "../../skillFx";
import { later } from "../later";
import { fireRound } from "../round";
import { foesNear } from "../targets";
import { struckThisSwing } from "../trigger";

const ID = "ca_ricochet";
const BOUNCE_REACH = 80;

function bounce(from: Enemy, left: number, hit: Enemy[], values: Readonly<Record<string, number>>): void {
  const next = foesNear(...enemyCenter(from), BOUNCE_REACH, hit)[0];
  if (!next || left <= 0) {
    return;
  }
  hit.push(next);
  const [fx, fy] = enemyCenter(from);
  const [nx, ny] = enemyCenter(next);
  const jump = { x: fx, y: fy, face: Math.sign(nx - fx) || 1, toX: nx, toY: ny };
  calderFx(ID, "trail", jump, { damage: progress.stats.ad * values.round * 0.7, quiet: hit.length > 2, delay: 0.06 });
  later(0.06, () => {
    fireRound(
      next,
      { power: values.round * 0.7, kind: "shot", stagger: values.stagger, source: ID },
      enemyCenter(next),
    );
    bounce(next, left - 1, hit, values);
  });
}

export const RICOCHET_DRILL: CalderDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.air ?? 0;
  },
  slashed(strike, landed, { values }) {
    const foe = struckThisSwing()[0];
    if (strike !== "air" || !landed || !foe) {
      return;
    }
    fireRound(foe, { power: values.round, kind: "shot", stagger: values.stagger, source: ID });
    const [x, y] = enemyCenter(foe);
    calderFx(
      ID,
      "burst",
      { x, y, face: hero.face, reach: 7 },
      { damage: progress.stats.ad * values.round, quiet: true },
    );
    bounce(foe, values.bounces ?? 0, [foe], values);
  },
};
