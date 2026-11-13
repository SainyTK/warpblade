import { ULT_LEVELS } from "../../constants/ultimate";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { createCrossbowBolt } from "../effects/crossbowBolt";
import { createImpact } from "../effects/impact";
import { enemyCenter } from "../enemies/enemy";
import { markFoe } from "../enemies/skillStatus";
import { sable } from "../hero/sable/memory";
import { skin } from "../hero/skin";
import { ultimateValues } from "../hero/ultimate";
import { game, hero, progress, rng } from "../state";
import { shake, surfaceBelow } from "../world";
import { foesOnSegment } from "./segmentHits";
import { ultSpan, ultTargets } from "./targets";

/** bolts that rain on open floor besides the ones on each foe, at each level */
const LOOSE = [6, 9, 12, 18] as const;
/** the rain starts after the bolt shot into the sky and lasts this long; each further strike on a foe adds this much */
const FROM = 0.22;
const SPAN = 0.6;
const PER_HIT = 0.25;
const FALL_SPEED = 520;
/** a perfect reload or a parry this recent counts as just before the cast */
const PERFECT_RECENT = 1;

/** one storm's tally: how often each foe has been struck, and the seconds kills have taken off the cooldown */
interface Tally {
  hits: Map<Enemy, number>;
  full: Set<Enemy>;
  refunded: number;
}

/** a falling bolt strikes a foe: the storm's power, and Bolt Storm's mark, pin and kill refund */
function strikeFoe(e: Enemy, damage: number, slant: number, tally: Tally): void {
  const v = ultimateValues();
  const n = (tally.hits.get(e) ?? 0) + 1;
  tally.hits.set(e, n);
  if (n >= (v.hits ?? 1)) tally.full.add(e);
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, damage, { fromX: cx - slant * 10, kx: 0, ky: -40, stun: 0.4, heavy: true, source: "ultimate" });
  if (v.mark) markFoe(e, "s_storm", v.markTime, v.mark);
  if (v.pin) e.pinned = Math.max(e.pinned, v.pin);
  game.fx.push(createImpact(cx, cy, Math.sign(slant) || 1, true));
  sfx.hit(true, 1.2);
  shake(0.06, 1);
  if (e.hp > 0 || !v.refund || tally.refunded >= v.refundCap) return;
  const back = Math.min(v.refund, v.refundCap - tally.refunded);
  tally.refunded += back;
  hero.ultCd = Math.max(0, hero.ultCd - back);
}

/** one bolt falling slantwise onto the floor at x, `delay` seconds from now */
function fall(x: number, delay: number, primed: boolean, damage: number, tally: Tally): void {
  const floor = surfaceBelow(x, 0);
  const slant = rng.range(0.15, 0.3) * (rng.chance(0.5) ? 1 : -1);
  const top = -20;
  game.fx.push(
    createCrossbowBolt({
      x: x - slant * (floor - top),
      y: top,
      angle: Math.atan2(floor - top, slant * (floor - top)),
      ramp: skin.ramp,
      primed,
      // the storm's bolts are drawn long and thick, so the rain reads as an ultimate's
      heavy: true,
      bounces: 0,
      delay,
      speed: FALL_SPEED,
      range: 400,
      pass(ax, ay, bx, by) {
        for (const e of foesOnSegment(ax, ay, bx, by, tally.full)) strikeFoe(e, damage, slant, tally);
        return false;
      },
    }),
  );
}

/**
 * Bolt Storm: she shoots one bolt into the sky and a rain of them comes down on every foe in reach and the floor around
 * them. Each foe takes the level's power from each bolt that reaches it, as many times as Bolt Storm's `hits` allow
 * (once with no skill). Bolt Storm the skill marks and pins, doubles the storm after a perfect reload or a parry, brings
 * it back sooner for kills, and evolved sends the open-floor bolts after foes too.
 */
export function castBoltStorm(level: number): void {
  const v = ultimateValues();
  const perfect = sable.sincePerfect <= PERFECT_RECENT ? (v.perfect ?? 1) : 1;
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad * (v.power ?? 1) * perfect;
  const tally: Tally = { hits: new Map(), full: new Set(), refunded: 0 };
  game.fx.push(
    createCrossbowBolt({
      x: hero.x + hero.face * 6,
      y: hero.y - 26,
      angle: -Math.PI / 2 + hero.face * 0.12,
      ramp: skin.ramp,
      primed: true,
      heavy: true,
      bounces: 0,
      range: 200,
      pass: () => false,
    }),
  );
  sfx.swing(1.4);
  if (perfect > 1) shake(0.2, 2.5);
  const [x0, x1] = ultSpan(level);
  const targets = ultTargets(level);
  const hits = v.hits ?? 1;
  const aims: number[] = [];
  for (let round = 0; round < hits; round++) for (const e of targets) aims.push(enemyCenter(e)[0]);
  const loose = Array.from({ length: LOOSE[level - 1] }, (_, i) =>
    v.seek && targets.length ? enemyCenter(targets[i % targets.length])[0] : rng.range(x0, x1),
  );
  const all = [...aims, ...loose];
  const span = SPAN + (hits - 1) * PER_HIT;
  all.forEach((x, i) => {
    fall(x, FROM + (i * span) / all.length, i < 4 || perfect > 1, damage, tally);
  });
}
