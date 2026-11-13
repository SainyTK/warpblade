import { ENEMIES } from "../../../constants/enemies";
import { PAL, WAX } from "../../../constants/palette";
import { KINDLE } from "../../../constants/wenna/abilities";
import { LIGHT } from "../../../constants/wenna/wax";
import { disc, glow, place } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { Wick } from "../../../types/wenna";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { launchEnemy } from "../../enemies/airborne";
import { enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { hitStop, shake } from "../../world";
import { setState } from "../actions";
import { wenna } from "./memory";
import { startCasting } from "./startCasting";
import { gainWax } from "./wax";
import { byWick } from "./wickKills";
import { endWick, wicksNear } from "./wicks";

const CHAIN = "w_kindle";

/** the Wick Kindle bursts: her nearest within reach */
export const kindleTarget = (): Wick | null => wicksNear(hero.x, hero.y - 4, KINDLE.reach)[0] ?? null;

/** the burst: violet and gold, wax droplets flying, a scorch ring on the floor; it throws every foe near it up */
export function burstWick(w: Wick, share: number): Enemy[] {
  const v = skillValues(CHAIN);
  const radius = withCharms("area", KINDLE.radius + (v.radius ?? 0));
  const power = KINDLE.power * (1 + (v.power ?? 0)) * share;
  const x = w.x;
  const y = w.y - 6;
  const hit: Enemy[] = [];
  byWick(() => {
    for (const e of game.enemies) {
      if (e.hp <= 0) continue;
      const [cx, cy] = enemyCenter(e);
      if (Math.hypot(cx - x, (cy - y) * 1.2) > radius) continue;
      dealDamage(e, progress.stats.ap * power, {
        fromX: x,
        kx: Math.sign(cx - x || 1) * KINDLE.kx,
        source: "abilities",
        stun: v.stun || undefined,
        heavy: true,
      });
      if (ENEMIES[e.type].launchable && e.hp > 0) launchEnemy(e, KINDLE.ky * 2.2);
      hit.push(e);
    }
  });
  endWick(w, "kindle");
  game.fx.push(createFloorRing(x, w.y, radius, [WAX[0], PAL.wick[2], PAL.wick[3], PAL.wick[4], WAX[3]], 0.45));
  for (let i = 0; i < 18; i++) {
    const a = rng.range(0, Math.PI * 2);
    const sp = rng.range(60, 180);
    particles.spawn(PK.SPARK, x, y, Math.cos(a) * sp, Math.sin(a) * sp - 40, rng.range(0.3, 0.6), {
      col: rng.pick([PAL.wick[4], PAL.wick[5], WAX[3], 0xffd86a]),
    });
  }
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.SHARD, x, y, rng.range(-90, 90), -rng.range(60, 160), rng.range(0.5, 0.9), {
      col: rng.chance(0.5) ? WAX[2] : WAX[1],
      size: rng.range(1, 2),
    });
  lights.add(x, y, radius * 1.6, PAL.wick[4], 1, 0.35);
  lights.add(x, y, 16, 0xffd86a, 0.9, 0.12);
  shake(0.18, 3);
  hitStop(0.05);
  sfx.boom();
  emitSkillEvent({ type: "kindle", x, y: w.y, foes: hit });
  return hit;
}

/** the flame swells over a moment before the body cracks: the burst comes on the swell's end, at `share` of its power */
function swell(w: Wick, share: number): void {
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      if (w.melt >= 0) return false;
      if (t < KINDLE.swell) return true;
      const v = skillValues(CHAIN);
      burstWick(w, share);
      gainWax(v.refund ? LIGHT.cost : KINDLE.refund);
      if (v.free) wenna.freeWick = true;
      if (v.chain) {
        const next = wicksNear(w.x, w.y, 40).find((o) => o !== w);
        if (next) burstWick(next, v.chain);
      }
      return false;
    },
    draw() {
      place();
      const k = t / KINDLE.swell;
      glow(w.x, w.y - 12, 8 + k * 10, PAL.wick[4], 0.4 + k * 0.4);
      disc(w.x, w.y - 12, 2 + k * 3, PAL.wick[5], 0.6 + k * 0.4);
    },
  });
}

/** MP Kindle costs, more for its wide form */
export const kindleMp = (wide: boolean): number => KINDLE.mp * (wide ? KINDLE.wideMp : 1);

/** I with Kindle: the Wick nearest her bursts; held, with MP for it, every Wick in reach bursts at a share */
export function castKindle(wide: boolean): boolean {
  const near = kindleTarget();
  if (!near || !startCasting()) return false;
  const all = wide && hero.mp >= kindleMp(true);
  hero.mp -= kindleMp(all);
  wenna.kindleCd = KINDLE.cooldown;
  wenna.casting = "kindle";
  hero.vx = hero.ground ? 0 : hero.vx;
  setState("kindleCast");
  emitSkillEvent({ type: "cast", ability: "kindle" });
  sfx.cast();
  if (!all) {
    swell(near, 1);
    return true;
  }
  for (const w of wicksNear(hero.x, hero.y - 4, KINDLE.reach)) swell(w, KINDLE.wideShare);
  return true;
}
