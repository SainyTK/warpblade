import { createImpact } from "../../../game/effects/impact";
import { moveDef } from "../../../game/hero/kits";
import { skillValues } from "../../../game/skills/query";
import { game, hero, lights } from "../../../game/state";
import { ARMOUR } from "../constants/armour";
import { CRIMSON, CRIMSON_SPARKS } from "../constants/colors";

/** her abilities and Crimson Fall are swings too */
const SWINGING_STATES = new Set(["rend", "quake", "ultimate"]);

/**
 * Brynn wears armour while she swings: from the first frame of a move until a moment after its last blow is out, and for
 * the whole of her abilities and Crimson Fall.
 */
export function armoured(): boolean {
  const h = hero;
  if (SWINGING_STATES.has(h.state)) return true;
  if (h.state !== "move" || !h.move) return false;
  const m = moveDef(h.move);
  if (h.hitIndex < m.hits.length || m.untilLanding) return true;
  const last = m.hits[m.hits.length - 1];
  return !last || h.st < last.at + ARMOUR.after;
}

/** the share of a blow's damage she takes: less in armour, less again with Iron Skin */
export function hurtScale(): number {
  if (!armoured()) return 1;
  return ARMOUR.taken * (1 - (skillValues("br_ironskin").armour ?? 0));
}

/** a blow landed in armour: no flinch, and crimson sparks off her pauldron */
export function steadfast(): boolean {
  if (!armoured()) return false;
  const x = hero.x + hero.face * 2;
  const y = hero.y - 24;
  game.fx.push(createImpact(x, y, -hero.face, false, CRIMSON_SPARKS));
  lights.add(x, y, 16, CRIMSON[4], 0.6, 0.15);
  return true;
}
