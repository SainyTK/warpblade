import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillValues } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { atFloor, atFoe, ceriseFx } from "../fx";
import { isMarked, markedFoes, roseMark } from "../mark";

/** seconds between the bleed's ticks, and the reach of Crimson Weep's spill */
const TICK = 0.5;
const SPILL = 30;

/** one tick of the bleed on a marked foe; evolved, it spills onto the foes close to it */
function bleed(e: Enemy, damage: number, spread: number, fresh: boolean): void {
  dealDamage(e, damage, { fromX: e.x, kx: 0, dot: true, source: "ce_weep" });
  ceriseFx("ce_weep", "mark", atFoe(e, 16), {
    damage: damage * 8,
    sigil: fresh ? "rose" : undefined,
    lift: 6,
    quiet: !fresh,
  });
  if (!spread) return;
  const [x, y] = enemyCenter(e);
  if (fresh) ceriseFx("ce_weep", "nova", atFloor(x, e.y, SPILL), { damage: damage * 8, quiet: true });
  for (const o of game.enemies) {
    if (o === e || o.hp <= 0 || isMarked(o)) continue;
    const [ox, oy] = enemyCenter(o);
    if (Math.hypot(ox - x, oy - y) < SPILL)
      dealDamage(o, damage * spread, { fromX: x, kx: 0, dot: true, source: "ce_weep" });
  }
}

/** Weeping Mark: marked foes bleed, and a marked foe that falls passes its mark to the nearest foe */
export const weepingMark: SkillBehavior = {
  create: () => ({ next: TICK, seen: new Set<Enemy>() }),
  update(m: SkillMemory, _state, dt) {
    m.next = (m.next as number) - dt;
    if ((m.next as number) > 0) return;
    m.next = TICK;
    const v = skillValues("ce_weep");
    const seen = m.seen as Set<Enemy>;
    const now = markedFoes();
    for (const e of now) bleed(e, progress.stats.ad * v.dps * TICK, v.spread ?? 0, !seen.has(e));
    m.seen = new Set(now);
  },
  on: {
    kill(_m, { foe }) {
      if (!skillValues("ce_weep").pass || !isMarked(foe)) return;
      const [x, y] = enemyCenter(foe);
      const next = nearestFoe(x, y, [foe]);
      if (!next) return;
      roseMark(next);
      ceriseFx(
        "ce_weep",
        "trail",
        { x, y, face: Math.sign(next.x - x) || 1, toX: next.x, toY: enemyCenter(next)[1] },
        { quiet: true },
      );
    },
  },
};
