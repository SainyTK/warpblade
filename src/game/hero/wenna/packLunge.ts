import { PAL } from "../../../constants/palette";
import { WICK } from "../../../constants/wenna/wick";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { Wick } from "../../../types/wenna";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { skillValues } from "../../skills/query";
import { particles, progress, rng } from "../../state";
import { hitStop, shake } from "../../world";
import { byWick } from "./wickKills";
import { loadOf, plan } from "./wickMoves";
import { cappedWicks, relight, wicksNear } from "./wicks";

/** Wicks this near a Quarry lunge with Pack Lunge */
const NEAR = 40;

/**
 * Pack Lunge: a blow on her Quarry while enough Wicks stand near it sends every one of them lunging at it. Each Wick
 * sinks for its wind-up, leaps part of the way in and strikes as it lands (`packStrike`). The payoff lands on the
 * Quarry only.
 */
export function packLunge(q: Enemy): void {
  const v = skillValues("w_packLunge");
  if (!v.power) return;
  const [cx, cy] = enemyCenter(q);
  const pack = wicksNear(cx, cy, NEAR);
  if (pack.length < (v.need ?? 3)) return;
  for (const w of pack) {
    w.face = Math.sign(cx - w.x) || w.face;
    plan(w, { kind: "pack", foe: q, left: loadOf("pack"), leaping: false });
  }
}

/** a Wick's lunge lands on the Quarry: Feeding Frenzy strikes three times, and a kill by a lunge relights every Wick */
export function packStrike(w: Wick, q: Enemy): void {
  const v = skillValues("w_packLunge");
  if (q.hp <= 0) return;
  const [cx] = enemyCenter(q);
  w.lunge = WICK.lunge * 2;
  if (v.heal) w.hp = Math.min(w.max, w.hp + w.max * v.heal);
  const strikes = v.frenzy ? 3 : 1;
  for (let i = 0; i < strikes && q.hp > 0; i++)
    byWick(() => {
      dealDamage(q, progress.stats.ap * (v.power ?? 0), {
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
  hitStop(0.06);
  shake(0.15, 2);
  if (q.hp <= 0 && v.frenzy) for (const o of cappedWicks()) relight(o);
}
