import { PAL } from "../../../constants/palette";
import { WICK } from "../../../constants/wenna/wick";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { skillValues } from "../../skills/query";
import { particles, progress, rng } from "../../state";
import { hitStop, shake } from "../../world";
import { byWick } from "./wickKills";
import { cappedWicks, relight, wicksNear } from "./wicks";

/** Wicks this near a Quarry lunge with Pack Lunge */
const NEAR = 40;

/**
 * Pack Lunge: a blow on her Quarry while enough Wicks stand near it sends every one of them lunging at it. The payoff
 * lands on the Quarry only. Feeding Frenzy makes each lunge strike three times, and a kill by a lunge relights every
 * Wick.
 */
export function packLunge(q: Enemy): void {
  const v = skillValues("w_packLunge");
  if (!v.power) return;
  const [cx, cy] = enemyCenter(q);
  const pack = wicksNear(cx, cy, NEAR);
  if (pack.length < (v.need ?? 3)) return;
  const strikes = v.frenzy ? 3 : 1;
  let killed = false;
  for (const w of pack) {
    w.lunge = WICK.lunge * 2;
    w.face = Math.sign(cx - w.x) || w.face;
    w.x += (cx - w.x) * 0.4;
    if (v.heal) w.hp = Math.min(w.max, w.hp + w.max * v.heal);
    for (let i = 0; i < strikes && q.hp > 0; i++)
      byWick(() => {
        dealDamage(q, progress.stats.ap * v.power, {
          fromX: w.x,
          kx: w.face * 30,
          stun: v.stun || undefined,
          sureCrit: !!v.crit,
        });
      });
    for (let i = 0; i < 4; i++)
      particles.spawn(PK.SPARK, w.x, w.y - 10, (cx - w.x) * rng.range(2, 4), rng.range(-60, -10), 0.3, {
        col: PAL.wick[4],
      });
    if (q.hp <= 0) killed = true;
  }
  hitStop(0.06);
  shake(0.15, 2);
  if (killed && v.frenzy) for (const w of cappedWicks()) relight(w);
}
