import { drillSession } from "../../../../../drill";
import { dealDamage } from "../../../../../game/damage";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { createTracerLine } from "../../effects/tracerLine";
import { calderFx } from "../../skillFx";
import { later } from "../later";
import { skillStrike } from "../strike";
import { foesNear } from "../targets";

const ID = "ca_chainshot";
const ARC_REACH = 70;

function arcFrom(foe: Enemy, arcs: number, values: Readonly<Record<string, number>>): void {
  const hit = [foe];
  let from = foe;
  for (let i = 0; i < arcs; i++) {
    const next = foesNear(...enemyCenter(from), ARC_REACH, hit)[0];
    if (!next) {
      return;
    }
    game.fx.push(createTracerLine(...enemyCenter(from), ...enemyCenter(next)));
    const [fx, fy] = enemyCenter(from);
    const [nx, ny] = enemyCenter(next);
    const link = { x: fx, y: fy, face: Math.sign(nx - fx) || 1, toX: nx, toY: ny };
    calderFx(ID, "bolt", link, { damage: progress.stats.ap * (0.5 + values.bonus), quiet: true });
    dealDamage(next, progress.stats.ap * (0.5 + values.bonus), { fromX: from.x, kx: 30, ky: -20, source: "abilities" });
    next.shock = Math.max(next.shock, values.shock ? 2 : 1);
    if (values.stagger) {
      staggerFoe(next, values.stagger);
    }
    hit.push(next);
    from = next;
  }
}

export const CHAIN_SHOT_DRILL: CalderDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "chain") {
      return;
    }
    skillStrike(foe, values.bonus * 2.6, "abilities");
    const [cx, cy] = enemyCenter(foe);
    calderFx(
      ID,
      "bolt",
      { x: hero.x + hero.face * 16, y: hero.y - 18, face: hero.face, toX: cx, toY: cy },
      { damage: progress.stats.ap * (spell.damage / 10 + values.bonus * 2.6) },
    );
    foe.shock = Math.max(foe.shock, values.shock ? 2 : 1.2);
    arcFrom(foe, values.arcs, values);
    const session = drillSession();
    if (evolved && session) {
      const [x, y] = enemyCenter(foe);
      later(0.15, () => {
        session.elementImpacts.push({ spell, x, y, face: session.fighter.face, age: 0, fromSword: false });
        arcFrom(foe, values.arcs, values);
      });
    }
  },
  swordHit(foe, infusion, { values }) {
    if (infusion?.id === "chain" && values.infusedArc) {
      arcFrom(foe, 1, values);
    }
  },
};
