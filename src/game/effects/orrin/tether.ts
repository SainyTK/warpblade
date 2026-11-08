import { PAL, SPARKS } from "../../../constants/palette";
import { glow, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { foesOnScreen } from "../../skills/targets";
import { particles, progress, rng } from "../../state";
import { drawLinks } from "./chainLinks";

/** what a tether does, read from Tether's row when it is cast */
export interface TetherSpec {
  share: number;
  life: number;
  yank: number;
  burst: number;
  /** Chain Gang: every foe on screen joins */
  gang: boolean;
}

const YANK_GAP = 70;
const YANK_EVERY = 1;

/**
 * Tether: a chain through several foes. Damage one of them takes from anything else passes a share on to the others;
 * foes pulled far apart are yanked back together and collide; a chained foe that dies hurts the rest.
 */
export function createTether(foes: readonly Enemy[], spec: TetherSpec): Effect {
  let chained = [...foes];
  const lastHp = new Map<Enemy, number>(chained.map((e) => [e, e.hp]));
  let t = 0;
  let yankCd = 0;
  const pass = (from: Enemy, amount: number, received: Map<Enemy, number>) => {
    for (const o of chained) {
      if (o === from || o.hp <= 0) continue;
      const before = o.hp;
      dealDamage(o, amount, { source: "o_tether", dot: true });
      received.set(o, (received.get(o) ?? 0) + (before - o.hp));
    }
  };
  return {
    update(dt) {
      t += dt;
      yankCd -= dt;
      if (spec.gang)
        for (const e of foesOnScreen())
          if (!chained.includes(e)) {
            chained.push(e);
            lastHp.set(e, e.hp);
          }
      const received = new Map<Enemy, number>();
      for (const e of chained) {
        const lost = (lastHp.get(e) ?? e.hp) - e.hp;
        if (lost > 0.5 && spec.share > 0) pass(e, lost * spec.share, received);
      }
      for (const e of chained) {
        if (e.hp > 0 || !spec.burst) continue;
        const [cx, cy] = enemyCenter(e);
        particles.spawn(PK.SPARK, cx, cy, 0, -60, 0.3, { sparks: SPARKS.brass });
        pass(e, progress.stats.ap * spec.burst, received);
      }
      if (spec.yank && yankCd <= 0) {
        for (let i = 1; i < chained.length; i++) {
          const a = chained[i - 1];
          const b = chained[i];
          if (a.hp <= 0 || b.hp <= 0 || Math.abs(a.x - b.x) < YANK_GAP) continue;
          const mid = (a.x + b.x) / 2;
          a.x += (mid - a.x) * 0.6;
          b.x += (mid - b.x) * 0.6;
          dealDamage(a, progress.stats.ap * spec.yank, { fromX: b.x, source: "o_tether" });
          dealDamage(b, progress.stats.ap * spec.yank, { fromX: a.x, source: "o_tether" });
          yankCd = YANK_EVERY;
        }
      }
      chained = chained.filter((e) => e.hp > 0);
      for (const e of chained) lastHp.set(e, e.hp);
      return t < spec.life && chained.length > 1;
    },
    draw() {
      place();
      const fade = Math.min(1, (spec.life - t) / 0.3, t / 0.1);
      for (let i = 1; i < chained.length; i++) {
        const [ax, ay] = enemyCenter(chained[i - 1]);
        const [bx, by] = enemyCenter(chained[i]);
        drawLinks(ax, ay, bx, by, PAL.brass[4], fade);
        if (rng.chance(0.05))
          particles.spawn(PK.MOTE, (ax + bx) / 2, (ay + by) / 2, 0, -10, 0.4, { col: PAL.brass[4] });
      }
      for (const e of chained) {
        const [cx, cy] = enemyCenter(e);
        glow(cx, cy, 8, PAL.brass[3], 0.3 * fade);
      }
    },
  };
}
