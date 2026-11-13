import { POINT_BLANK, SABLE_GUARD, STOCK_BASH } from "../../../constants/sable/guard";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { createFloorRing } from "../../effects/floorRing";
import { enemyCenter } from "../../enemies/enemy";
import { meleeHit } from "../../meleeHit";
import { emitSkillEvent } from "../../skills/events";
import { startMovePayoff } from "../../skills/payoff";
import { skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { boxAhead, dust, newSwing, struckThisSwing } from "../../world";
import { skin } from "../skin";
import { burst } from "./bolt/burst";
import { createFlyingFoe } from "./bolt/flyingFoe";
import { sable } from "./memory";
import { chargeBolts, flashQuiver, quiverSize } from "./quiver";
import { endReload } from "./reload";
import { kickKegs } from "./spells/keg";

const BOOT = "s_heavyBoot";

/** the foes the boot or the stock reached this swing */
const struckFoes = (): Enemy[] => game.enemies.filter((e) => e.hp > 0 && struckThisSwing(e));

/** Heavy Boot's gains from Point-Blank's kick that landed on these foes */
function heavyBoot(foes: readonly Enemy[]): void {
  const v = skillValues(BOOT);
  if (v.bodies) for (const e of foes) game.fx.push(createFlyingFoe(e, hero.face, v.bodies));
  if (!v.shock) return;
  const [cx, cy] = enemyCenter(foes[0]);
  burst({ x: cx, y: cy, radius: v.radius, power: v.shock });
}

/**
 * The boot drives out at the attacker and throws every foe it reaches away; returns the foes it landed on. Heavy Boot is
 * precise: its power lands on the nearest foe the boot reaches, and the rest take Point-Blank's own.
 */
function kick(): Enemy[] {
  const v = skillValues(BOOT);
  const [x0, y0, x1, y1] = POINT_BLANK.box;
  const wide = v.wide ?? 1;
  const box = boxAhead(x0, y0 * wide, x1 * wide, y1);
  newSwing();
  startMovePayoff();
  kickKegs(box);
  const hits = meleeHit([box], {
    power: v.power ?? POINT_BLANK.power,
    plain: v.power ? POINT_BLANK.power : undefined,
    kx: POINT_BLANK.kx,
    ky: POINT_BLANK.ky,
    stun: v.stun ?? POINT_BLANK.stun,
    big: true,
    wall: !!v.wall,
  });
  return hits ? struckFoes() : [];
}

/** the quiver fills at once and its first bolts are primed; a reload under way is done */
function refill(): void {
  endReload();
  sable.ammo = quiverSize();
  chargeBolts(POINT_BLANK.primed);
  flashQuiver("perfect");
}

/**
 * Point-Blank: she meets the blow with the crossbow stock and kicks the attacker away hard, and the quiver is full with
 * its first bolts primed. A parry counts as a perfect reload for Bolt Storm.
 */
function parried(): void {
  const foes = kick();
  if (foes.length) {
    heavyBoot(foes);
    emitSkillEvent({ type: "kick", foes });
  }
  refill();
  sable.sincePerfect = 0;
  dust(hero.x, hero.y, 4, -hero.face);
  game.fx.push(createFloorRing(hero.x + hero.face * 10, hero.y, 18, skin.ramp, 0.3));
  sfx.swing(0.7);
}

/** Heavy Boot's stock bash: a block shoves the attacker back */
function blocked(): void {
  const bash = skillValues(BOOT).bash;
  if (!bash) return;
  const [x0, y0, x1, y1] = STOCK_BASH.box;
  newSwing();
  meleeHit([boxAhead(x0, y0, x1, y1)], { power: bash, kx: STOCK_BASH.kx, ky: STOCK_BASH.ky, stun: STOCK_BASH.stun });
}

/** Sable's guard: the crossbow stock raised across her lets a lot through; its parry, Point-Blank, kicks and reloads.
 *  Heavy Boot lets less through and makes the block bash back */
export const SABLE_GUARD_STYLE: GuardStyle = {
  get chip() {
    return SABLE_GUARD.chip * (skillValues(BOOT).chip ?? 1);
  },
  blockCost: SABLE_GUARD.blockCost,
  blocked,
  parried,
};
