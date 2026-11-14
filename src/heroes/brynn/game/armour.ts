import { createImpact } from "../../../game/effects/impact";
import { moveDef } from "../../../game/hero/kits";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { game, hero, lights, progress } from "../../../game/state";
import { ARMOUR } from "../constants/armour";
import { CRIMSON, CRIMSON_SPARKS } from "../constants/colors";
import { addHeft, heftMost } from "./heft";
import { brynn } from "./state";

/** her abilities and Crimson Fall are swings too */
const SWINGING_STATES = new Set(["rend", "quake", "ultimate"]);

/** a move is under way and its last blow is not long out */
function swinging(): boolean {
  const h = hero;
  if (SWINGING_STATES.has(h.state)) return true;
  if (h.state !== "move" || !h.move) return false;
  const m = moveDef(h.move);
  if (h.hitIndex < m.hits.length || m.untilLanding) return true;
  const last = m.hits[m.hits.length - 1];
  return !last || h.st < last.at + ARMOUR.after;
}

/** Brynn wears armour while she swings: from the first frame of a move until a moment after its last blow is out, and
 *  for the whole of her abilities and Crimson Fall. War Cry at its seventh level keeps it on while the cry lasts, and
 *  Living Anvil (Iron Skin evolved) while Heft is at half or more. */
export function armoured(): boolean {
  if (swinging()) return true;
  if (hero.state === "dead") return false;
  if (brynn.cry > 0 && skillValues("br_cry").armour) return true;
  return skillEvolved("br_ironskin") && brynn.heft >= heftMost() / 2;
}

/** the share of a blow's damage she takes: less in armour, less again with Iron Skin and Unbroken */
export function hurtScale(): number {
  const cry = brynn.cry > 0 ? 1 - (skillValues("br_cry").taken ?? 0) : 1;
  if (!armoured()) return cry;
  return ARMOUR.taken * (1 - (skillValues("br_ironskin").armour ?? 0)) * cry;
}

/** a blow landed in armour: no flinch, crimson sparks off her pauldron, and Heft and MP with Iron Skin */
export function steadfast(): boolean {
  if (!armoured()) return false;
  const x = hero.x + hero.face * 2;
  const y = hero.y - 24;
  game.fx.push(createImpact(x, y, -hero.face, false, CRIMSON_SPARKS));
  lights.add(x, y, 16, CRIMSON[4], 0.6, 0.15);
  const v = skillValues("br_ironskin");
  addHeft(v.heft ?? 0);
  if (v.mp) hero.mp = Math.min(progress.stats.mp, hero.mp + v.mp);
  return true;
}
