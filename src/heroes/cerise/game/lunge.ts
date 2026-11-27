import { skillEvolved, skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import type { MoveHit } from "../../../types/move";
import { LUNGE_POINTS } from "../constants/points";
import { LUNGE_BOX, STRING_POWER } from "../constants/string";
import { createRoseLine } from "./effects/roseLine";
import { atFloor, ceriseFx } from "./fx";
import { gainPoints, pointCap, spendPoints } from "./points";
import { cerise } from "./state";

/** the lunge starts: it takes every Point she holds; with Poise a full lunge heals, and evolved gives Points back */
export function startLunge(): void {
  cerise.lungePoints = spendPoints(cerise.points);
  if (cerise.lungePoints < LUNGE_POINTS.sure) return;
  const v = skillValues("ce_poise");
  const damage = progress.stats.ad * STRING_POWER.longLunge * (1 + (v.full ?? 0)) * (1 + cerise.lungePoints * 0.2);
  ceriseFx("ce_poise", "wave", atFloor(hero.x - hero.face * 6, hero.y, 16), { damage, sigil: "thrust", lift: 16 });
  if (skillEvolved("ce_poise")) ceriseFx("ce_poise", "nova", atFloor(hero.x, hero.y, 26), { damage, quiet: true });
  if (v.heal) hero.hp = Math.min(progress.stats.hp, hero.hp + v.heal);
  if (v.refund) gainPoints(v.refund);
}

/** the line the lunge's petals and comet run along */
const TRAIL_HEIGHT = 16;

/** Long Lunge: petals cut the lunge's line again a moment later, and evolved a comet streak runs the whole screen */
export function lungeTrail(): void {
  const v = skillValues("ce_lunge");
  const blow =
    progress.stats.ad * (STRING_POWER.longLunge + cerise.lungePoints * LUNGE_POINTS.power) * (1 + (v.power ?? 0));
  const y = hero.y - TRAIL_HEIGHT;
  const from = hero.x - hero.face * 40;
  ceriseFx(
    "ce_lunge",
    "trail",
    { x: from, y, face: hero.face, toX: hero.x + hero.face * 30, toY: y },
    {
      damage: blow,
      sigil: "thrust",
    },
  );
  if (v.comet)
    ceriseFx("ce_lunge", "bolt", { x: hero.x + hero.face * 30, y: hero.y, reach: 60 }, { damage: blow, quiet: true });
  if (!v.echo && !v.comet) return;
  if (v.echo) {
    const reach = LUNGE_BOX[2] + (v.reach ?? 0) + cerise.lungePoints * LUNGE_POINTS.reach;
    game.fx.push(createRoseLine(hero.x, y, hero.face, blow * v.echo, "attacks", undefined, hero.x + hero.face * reach));
  }
  if (v.comet) game.fx.push(createRoseLine(hero.x + hero.face * 20, y, hero.face, blow * v.comet, "attacks"));
}

/** Poise: a full Points bar makes every hit harder */
export const poiseScale = (): number => (cerise.points >= pointCap() ? 1 + (skillValues("ce_poise").full ?? 0) : 1);

/**
 * The lunge as her Points and Long Lunge shape it: each Point adds power and reach, three break a guard, a full five
 * make it a sure crit, and Long Lunge adds power, reach and a guard break.
 */
export function shapeLunge(hit: MoveHit): MoveHit {
  const v = skillValues("ce_lunge");
  const pts = cerise.lungePoints;
  const perPoint = v.perPoint ?? LUNGE_POINTS.power;
  const reach = pts * LUNGE_POINTS.reach + (v.reach ?? 0);
  const [x0, y0, x1, y1] = hit.box;
  return {
    ...hit,
    power: (hit.power + pts * perPoint) * (1 + (v.power ?? 0)),
    box: [x0, y0, x1 + reach, y1],
    crit: pts >= LUNGE_POINTS.sure || hit.crit,
    big: hit.big || pts >= LUNGE_POINTS.heavy || !!v.guardBreak,
  };
}
