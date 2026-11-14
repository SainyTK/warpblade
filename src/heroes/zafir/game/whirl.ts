import { fleck, glow, place } from "../../../engine/frame";
import { dealDamage } from "../../../game/damage";
import { enemyCenter } from "../../../game/enemies/enemy";
import { feat } from "../../../game/feat";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillValues, withCharms } from "../../../game/skills/query";
import { foesOnScreen } from "../../../game/skills/targets";
import { game, hero, progress } from "../../../game/state";
import { TAU } from "../../../utils/math";
import { GRAIN, SAND_RAMP } from "../constants/palette";
import { RING_LOOK, RING_TIERS, type RingTier, WHIRL } from "../constants/whirl";
import { sandSound } from "./sound";
import { zafir } from "./state";
import { openWounds } from "./wounds";

/** the Whirl a tier needs: Unbroken Whirl lowers both thresholds */
const tierFrom = (tier: RingTier): number => tier.from - (skillValues("za_unbroken").lower ?? 0);

/** the ring turning round Zafir now: the highest tier his Whirl has reached, or null */
export function ringTier(): RingTier | null {
  let at: RingTier | null = null;
  for (const tier of RING_TIERS) if (zafir.whirl >= tierFrom(tier)) at = tier;
  return at;
}

/** the ring's reach, widened by charms and Unbroken Whirl */
const ringReach = (tier: RingTier): number => withCharms("area", tier.reach * (skillValues("za_unbroken").reach ?? 1));

/** one of his own hits landed: the Whirl rises, and a tier reached sounds the gust */
export function gainWhirl(amount: number): void {
  const before = ringTier();
  zafir.whirl = Math.min(WHIRL.most, zafir.whirl + amount * (skillValues("za_unbroken").gain ?? 1));
  zafir.whirlIdle = 0;
  if (ringTier() !== before) sandSound.gust(0.08);
}

/** a foe the ring touches: level with it round his waist, within its reach */
function inRing(x: number, y: number, reach: number): boolean {
  return Math.abs(x - hero.x) <= reach && Math.abs(y - (hero.y - 14)) <= RING_LOOK.height;
}

/** the ring cuts every foe it touches, opening wounds at its top tier */
function cut(tier: RingTier): void {
  const reach = ringReach(tier);
  const power = tier.power + (skillValues("za_unbroken").power ?? 0);
  zafir.ringCutting = true;
  for (const e of foesOnScreen()) {
    const [x, y] = enemyCenter(e);
    if (!inRing(x, y, reach)) continue;
    dealDamage(e, progress.stats.ad * power, { fromX: hero.x, kx: Math.sign(x - hero.x) * 25 });
    openWounds(e, tier.wounds);
    zafir.runRingCuts++;
    feat({ kind: "heroCount", stat: "zafir.ringCuts", add: 1 });
    emitSkillEvent({ type: "ringCut", foe: e });
  }
  zafir.ringCutting = false;
}

/** the Whirl holds a moment after his last hit, then drains; while it is up the ring cuts on its own clock */
export function tickWhirl(dt: number): void {
  zafir.whirlIdle += dt;
  const hold = skillValues("za_unbroken").hold ?? WHIRL.hold;
  if (zafir.whirlIdle > hold) zafir.whirl = Math.max(0, zafir.whirl - WHIRL.decay * dt);
  const tier = ringTier();
  if (!tier || hero.hp <= 0) {
    zafir.ringClock = 0;
    return;
  }
  zafir.ringClock -= dt;
  if (zafir.ringClock > 0) return;
  zafir.ringClock = tier.every;
  cut(tier);
}

/** the ring's grains, turning round his waist on a flat ellipse: `near` draws the half in front of him, else the half
 *  behind; the top tier is thicker and glows */
export function drawRing(near: boolean): void {
  const tier = ringTier();
  if (!tier || hero.hp <= 0) return;
  const top = tier === RING_TIERS[RING_TIERS.length - 1];
  const reach = ringReach(tier);
  const n = RING_LOOK.grains[top ? 1 : 0];
  const cy = hero.y - 14;
  place();
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + game.t * RING_LOOK.spin;
    const front = Math.sin(a) > 0;
    if (front !== near) continue;
    const x = hero.x + Math.cos(a) * reach;
    const y = cy + Math.sin(a) * reach * RING_LOOK.flat + Math.sin(a * 3 + game.t * 7) * 1.5;
    const c = GRAIN[(i + (front ? 0 : 2)) % GRAIN.length];
    fleck(x, y, c);
    fleck(x - Math.sin(a) * 1.5, y + Math.cos(a) * 0.5, c, 0.6);
    if (top && i % 2 === 0) fleck(x + 0.5, y - 1, GRAIN[0]);
  }
  if (near && top) glow(hero.x, cy, reach * 0.7, SAND_RAMP[4], 0.08);
}
