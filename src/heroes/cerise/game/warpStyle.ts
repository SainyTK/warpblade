import { createSlash } from "../../../game/effects/slash";
import { meleeHit } from "../../../game/meleeHit";
import { skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { boxAhead } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { RIPOSTE } from "../constants/guard";
import { LUNGE_BOX } from "../constants/string";
import { atFloor, atHero, ceriseFx } from "./fx";
import { roseMark } from "./mark";
import { LUNGE_STREAK, THRUST } from "./moves/slashes";
import { gainPoints } from "./points";

/** the arrival: a thrust on her line at the shared power, reaching through to the foe behind with Rose Mark */
function strike(power: number, _foe: Enemy | null, sureCrit: boolean): void {
  const pierce = !!skillValues("ce_markwarp").pierce;
  game.fx.push(createSlash(hero.x, hero.y, hero.face, pierce ? LUNGE_STREAK : { ...THRUST, R: 34, W: 4 }));
  meleeHit([boxAhead(...(pierce ? LUNGE_BOX : RIPOSTE.box))], { power, kx: 60, ky: -20, big: true, sureCrit });
}

/** after the thrust: the Rose mark on the foe it was thrown at, and a Point with Rose Mark */
function arrived(foe: Enemy | null): void {
  if (foe && foe.hp > 0) roseMark(foe);
  const v = skillValues("ce_markwarp");
  const damage = progress.stats.ad * (1 + (v.warp ?? 0) + (v.pierce ?? 0)) * 2;
  ceriseFx("ce_markwarp", "mark", atHero(14, 18), { damage, sigil: "rose" });
  ceriseFx("ce_markwarp", "nova", atFloor(hero.x, hero.y, v.seal ?? 22), { damage, quiet: true });
  gainPoints(skillValues("ce_markwarp").points ?? 0);
}

/** Cerise's warp: her rapier thrown like a dart, an arrival thrust, and the Rose mark; Rose Mark's numbers */
export const CERISE_WARP: WarpStyle = {
  strike,
  arrived,
  tune: () => skillValues("ce_markwarp"),
};
