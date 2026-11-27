import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { createGlassRapier } from "./effects/glassRapier";
import { atFoe, atHero, ceriseFx } from "./fx";
import { gainPoints } from "./points";

/** the foes Feint has opened and the seconds left on each; holds foes, so only the host keeps it */
const opened: { list: { foe: Enemy; left: number }[] } = { list: [] };
rememberPerSeat(objectMemory(opened, true));

/** the rising thrust is Feint's feint: it opens the foe, gives a Point, turns it to face away from her, and evolved a
 *  glass rapier strikes it from behind */
export function feint(e: Enemy): void {
  const v = skillValues("ce_feint");
  if (!v.open) return;
  opened.list = [...opened.list.filter((o) => o.foe !== e), { foe: e, left: withBuild("duration", v.openTime) }];
  const damage = progress.stats.ad * (1 + v.open + (v.phantom ?? 0));
  ceriseFx("ce_feint", "slash", atHero(18), { damage, sigil: "thrust" });
  if (v.phantom) ceriseFx("ce_feint", "slash", atFoe(e, 16, -hero.face), { damage, quiet: true, delay: 0.12 });
  if (v.turn && e.rank === "minion") e.face = Math.sign(e.x - hero.x) || e.face;
  if (v.points) gainPoints(v.points);
  if (v.phantom) {
    const behind = Math.sign(e.x - hero.x) || hero.face;
    game.fx.push(createGlassRapier(e, behind, 0.15, progress.stats.ad * v.phantom, "ce_feint"));
  }
}

/** what a blow adds on a foe Feint has opened */
export const openBonus = (e: Enemy): number =>
  opened.list.some((o) => o.foe === e) ? (skillValues("ce_feint").open ?? 0) : 0;

/** the foes Feint has opened that still stand */
export const openedFoes = (): Enemy[] => opened.list.map((o) => o.foe).filter((e) => e.hp > 0);

export function tickFeint(dt: number): void {
  if (opened.list.length) opened.list = opened.list.map((o) => ({ ...o, left: o.left - dt })).filter((o) => o.left > 0);
}

export function resetFeint(): void {
  opened.list = [];
}
