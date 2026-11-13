import { CHAIN_BIND, CHAIN_GUARD } from "../../../constants/orrin/guard";
import { SPARKS } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { createTripLine } from "../../effects/orrin/tripLine";
import { createSlash } from "../../effects/slash";
import { enemyCenter } from "../../enemies/enemy";
import { markFoe } from "../../enemies/skillStatus";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { surfaceBelow } from "../../world";
import { bindFoe } from "./bind";
import { gainMomentum } from "./momentum";

const UNDERTOW = "o_undertow";

/** the chain whipped out at the blow: a brass arc from the spinning disc toward where it came from */
const LASH_OUT = { cx: 4, cy: -20, R: 30, sy: 0.4, rot: 0, a0: -1.2, a1: 0.5, W: 3, hold: 0.04, trail: 0.16 } as const;

/** the foes nearest the bound one, within reach of it, up to `count` */
function besideBound(foe: Enemy, reach: number, count: number): Enemy[] {
  const [fx, fy] = enemyCenter(foe);
  return game.enemies
    .filter((e) => e !== foe && e.hp > 0 && Math.hypot(enemyCenter(e)[0] - fx, enemyCenter(e)[1] - fy) <= reach)
    .sort((a, b) => Math.abs(a.x - fx) - Math.abs(b.x - fx))
    .slice(0, count);
}

/**
 * Chain Bind: the chain wraps the foe that struck and hauls it to the tip of his reach in front of him, stunned, with a
 * blow of its own; a mini boss or boss is held in place for a moment. Undertow holds longer, hits harder, drags the foes
 * beside it in too, leaves a chain on the floor that trips, and marks the bound foe.
 */
function chainBind(_fromX: number, foe: Enemy | null): void {
  const h = hero;
  game.fx.push(createSlash(h.x, h.y, h.face, LASH_OUT));
  gainMomentum(CHAIN_BIND.momentum);
  sfx.rattle();
  if (!foe || foe.hp <= 0) return;
  const v = skillValues(UNDERTOW);
  const big = foe.rank !== "minion";
  const haul = !big || v.big > 0;
  const hold = withCharms("duration", big ? CHAIN_BIND.bigHold * (v.big ? 2 : 1) : (v.bind ?? CHAIN_BIND.hold));
  const side = Math.sign(foe.x - h.x) || h.face;
  const from = foe.x;
  const tip = h.x + side * CHAIN_BIND.tip;
  bindFoe(foe, hold, haul ? tip : null, v.big > 0);
  dealDamage(foe, progress.stats.ad * (v.power ?? CHAIN_BIND.power), { fromX: h.x, kx: 0, heavy: true, melee: true });
  if (v.mark) markFoe(foe, UNDERTOW, hold, v.mark);
  const [cx, cy] = enemyCenter(foe);
  game.fx.push(createImpact(cx, cy, -side, true, SPARKS.brass));
  const riptide = v.riptide ? withCharms("area", v.riptide) : 0;
  const others = besideBound(foe, riptide || CHAIN_BIND.dragReach, riptide ? game.enemies.length : (v.drag ?? 0));
  others.forEach((e, i) => {
    bindFoe(e, hold, tip + side * CHAIN_BIND.dragGap * (i + 1), v.big > 0);
  });
  if (v.trip) game.fx.push(createTripLine(from, tip, surfaceBelow(tip, h.y - 4), v.trip, v.tripPower));
}

/** Orrin's guard: the chain spun into a disc in front of him, a weak block for a parry that binds the attacker */
export const ORRIN_GUARD: GuardStyle = {
  chip: CHAIN_GUARD.chip,
  blockCost: CHAIN_GUARD.blockCost,
  parried: chainBind,
};
