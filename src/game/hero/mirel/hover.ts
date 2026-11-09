import { HERO_MOVE, STAMINA } from "../../../constants/combat";
import { HOVER } from "../../../constants/mirel/hover";
import { PAL, SAND } from "../../../constants/palette";
import { PK } from "../../../types/particle";
import { approach } from "../../../utils/math";
import { enemyBox } from "../../enemies/enemy";
import { isHeld } from "../../input";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, particles, progress, rng } from "../../state";
import { travelEnded } from "../travelEnd";
import { mirel } from "./memory";
import { hasSand } from "./sand";

/** the states she may hover in: falling, and a Pendant Strike thrown from a hover */
const HOVER_STATES = new Set(["jump", "fall", "pendant"]);

/** seconds of hover each airtime: Suspended lengthens it */
export const hoverTime = (): number => withCharms("duration", skillValues("m_suspend").time ?? HOVER.time);

/** hovers each airtime */
export const hoversPerAir = (): number => skillValues("m_suspend").hovers ?? 1;

/** Hanging Hour: at 50 Sand or more the hover has no limit */
const unlimited = (): boolean => !!skillValues("m_suspend").grind && hasSand(50);

/** a foe below her, so Suspended can slow it, its sand grind it and the hover cost nothing */
export function foesBelow(): ReturnType<typeof game.enemies.filter> {
  return game.enemies.filter((e) => {
    if (e.hp <= 0) return false;
    const b = enemyBox(e);
    return b[0] - 4 < hero.x && b[2] + 4 > hero.x && b[1] > hero.y - 4;
  });
}

/** stamina a second the hover spends: Suspended lowers it, and makes it free over a foe */
function hoverCost(): number {
  const v = skillValues("m_suspend");
  if (v.free && foesBelow().length) return 0;
  return HOVER.stamina * (1 - (v.cost ?? 0));
}

/** sand trickling from her feet like an hourglass */
function trickle(): void {
  if (!rng.chance(0.4)) return;
  particles.spawn(
    PK.MOTE,
    hero.x + rng.range(-2, 2),
    hero.y + 1,
    rng.range(-3, 3),
    rng.range(18, 30),
    rng.range(0.4, 0.8),
    {
      col: rng.chance(0.7) ? SAND.light : SAND.shade,
      size: 0.5,
    },
  );
  if (rng.chance(0.15))
    particles.spawn(PK.MOTE, hero.x + rng.range(-6, 6), hero.y - rng.range(4, 20), 0, -6, 0.5, {
      col: PAL.hour[4],
      size: 0.5,
    });
}

/** the hover ends: a landing out of it is the end of a travel move */
function endHover(landed: boolean): void {
  if (!mirel.hovering) return;
  mirel.hovering = false;
  if (landed) travelEnded();
}

/** a landing hands the airtime's hover back */
export function giveHoverBack(): void {
  endHover(true);
  mirel.hoverLeft = hoverTime();
  mirel.hovers = hoversPerAir();
}

/**
 * W held once she falls: she hangs nearly still, drifting with A or D, while her time and stamina last. Letting go,
 * running out or landing drops her into a normal fall.
 */
export function tickHover(dt: number, dir: number): void {
  const h = hero;
  if (h.ground) return giveHoverBack();
  const able = HOVER_STATES.has(h.state) && isHeld("up") && h.vy >= 0;
  const left = unlimited() || mirel.hoverLeft > 0;
  if (!mirel.hovering) {
    if (!able || !left || h.stamina <= 0 || mirel.hovers <= 0) return;
    mirel.hovering = true;
    mirel.hovers--;
  }
  if (!able || !left || h.stamina <= 0) {
    endHover(false);
    if (!unlimited()) mirel.hoverLeft = Math.max(mirel.hoverLeft, 0);
    return;
  }
  if (!unlimited()) mirel.hoverLeft -= dt;
  h.stamina = Math.max(0, h.stamina - hoverCost() * dt);
  h.staminaWait = STAMINA.delay;
  h.vy = Math.min(h.vy, HOVER.fall);
  const drift = (skillValues("m_suspend").drift ?? HOVER.drift) * progress.stats.move;
  h.vx = approach(h.vx, dir * drift, HERO_MOVE.airAccel * dt);
  if (dir) h.face = dir;
  trickle();
}

/** her gravity while hovering */
export const hoverGravity = (): number => (mirel.hovering ? HOVER.gravity : 1);
