import { ANVIL } from "../../../constants/hulda/anvilDrop";
import { HULDA_JUMP_RISE } from "../../../constants/hulda/motion";
import type { HeroState } from "../../../types/hero";
import { enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { skillLevel, skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { gainGrit } from "./grit";
import { hulda } from "./memory";
import { slamRing } from "./slam";

const ID = "h_anvilDrop";

/** the states of her own jump: a landing from any of them is her jump's landing */
const JUMPING: ReadonlySet<HeroState> = new Set<HeroState>(["jump", "fall", "airFist"]);

/** her jump's height: Anvil Drop raises it from level 3 */
export const jumpRise = (): number => HULDA_JUMP_RISE * (skillValues(ID).rise ?? 1);

/** Anvil Drop from level 6: Up in the air hops once more, a lower jump */
export const mayHop = (): boolean => !!skillValues(ID).hop && hulda.leapt && !hulda.hopped;

/** the hop's height, a share of her jump */
export const hopRise = (): number => jumpRise() * ANVIL.hop;

/** fliers over the landing are shaken down toward it and reel */
function shakeFliers(radius: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || !kindOf(e.type).flies) continue;
    if (Math.abs(enemyCenter(e)[0] - hero.x) > radius * ANVIL.flierReach) continue;
    e.y = Math.min(hero.y - 8, e.y + ANVIL.drag);
    e.stun = Math.max(e.stun, ANVIL.flierStun);
  }
}

/** the landing: a shock runs out along the floor round her feet, as a slam does */
function land(): void {
  const v = skillValues(ID);
  if (v.fliers) shakeFliers(v.radius);
  const hits = slamRing({
    x: hero.x,
    floor: hero.y,
    body: null,
    radius: v.radius,
    power: v.power,
    stun: v.reel,
    launch: v.launch ? ANVIL.launch : undefined,
    stop: ANVIL.stop,
    shake: ANVIL.shake,
  });
  if (hits && v.grit) gainGrit(v.grit);
}

/**
 * Watched every step: a jump taken over by another move (a warp, a hurt) is no longer hers to land, and the landing of
 * her own jump strikes with Anvil Drop. Landing gives the hop back.
 */
export function watchAnvil(): void {
  if (!hero.ground) {
    if (!JUMPING.has(hero.state)) hulda.leapt = false;
    return;
  }
  hulda.hopped = false;
  if (!hulda.leapt) return;
  hulda.leapt = false;
  if (skillLevel(ID)) land();
}
