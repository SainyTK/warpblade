import { dealDamage } from "../../../game/damage";
import { createImpact } from "../../../game/effects/impact";
import { createSlash } from "../../../game/effects/slash";
import { enemyCenter } from "../../../game/enemies/enemy";
import { refundStamina } from "../../../game/hero/stamina";
import { meleeHit } from "../../../game/meleeHit";
import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { boxAhead, newSwing } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import type { HeroKit } from "../../../types/kit";
import { createPetalRing } from "./effects/petals";
import { atFloor, atFoe, ceriseFx } from "./fx";
import { LUNGE_STREAK } from "./moves/slashes";

/** where the dodge under way started, for Passing Touch's petals */
const dodge = { from: 0 };
rememberPerSeat(objectMemory(dodge, true));

/** Passing Touch: a foe she passes through is cut, and gives stamina back from its sixth level */
function passed(e: Enemy): void {
  const v = skillValues("ce_step");
  if (!v.pass) return;
  dealDamage(e, progress.stats.ad * v.pass, { fromX: hero.x, kx: 0, melee: true, stagger: 0.3 });
  game.fx.push(createImpact(...enemyCenter(e), hero.face, false));
  ceriseFx("ce_step", "slash", atFoe(e, 12), { damage: progress.stats.ad * v.pass, quiet: true });
  if (v.stamina) refundStamina(v.stamina);
}

/** Passing Touch: the dodge ends in a thrust ahead, Keen after a perfect dodge, pinning from its seventh level; evolved,
 *  a ring of petal blades is left where the dodge began */
function ended(): void {
  const v = skillValues("ce_step");
  if (!v.thrust) return;
  const y = hero.y - 15;
  ceriseFx(
    "ce_step",
    "trail",
    { x: dodge.from, y, face: hero.face, toX: hero.x + hero.face * 20, toY: y },
    {
      damage: progress.stats.ad * (v.thrust + (v.pass ?? 0)) * 2,
      sigil: "thrust",
    },
  );
  if (skillEvolved("ce_step")) ceriseFx("ce_step", "nova", atFloor(dodge.from, hero.y, 30), { quiet: true });
  newSwing();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, LUNGE_STREAK));
  meleeHit([boxAhead(0, -26, 54, -6)], {
    power: v.thrust,
    kx: 40,
    ky: 0,
    stagger: v.pin ?? 0.45,
    sureCrit: !!v.keen && hero.perfectUsed,
  });
  if (skillEvolved("ce_step"))
    game.fx.push(createPetalRing(dodge.from, hero.y - 14, 34, 2.5, progress.stats.ad * v.petals, "ce_step"));
}

/** the dodge's hooks for Passing Touch */
export const dodgeHooks: NonNullable<HeroKit["dodge"]> = {
  started: () => {
    dodge.from = hero.x;
  },
  passed,
  ended,
};
