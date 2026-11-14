import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { game, hero } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { STREAM } from "../../constants/abilities";
import { JADE_SPARKS } from "../../look";
import { drawSpiritSword, drawSwordMotes } from "../art/spiritSword";
import type { SwordPlace } from "../hover";

/** one sword of a stream: where it leaves from, its delay, how far it flies, how much it climbs a pixel flown */
export interface StreamSword {
  from: SwordPlace;
  delay: number;
  reach: number;
  rise: number;
  damage: number;
  source: SourceId;
  /** it flies back to Yun cutting again; false, it fades at its reach */
  returns: boolean;
  /** seconds foes it cuts are knocked down */
  stun?: number;
  /** a foe it cut, for the skills that answer it */
  struck?: (e: Enemy) => void;
  /** the way it flies; left out, the way Yun faces */
  face?: number;
}

/** the height the line runs at, from Yun's feet, and how close to him a returning sword must come to be spent */
const LINE = -22;
const HOME = 6;
/** seconds the motes of a spent sword last */
const MOTES = 0.3;

/**
 * Sword Stream: one spirit sword flies from its place behind Yun along the line ahead, cuts each foe it passes once on
 * the way out, turns at its reach and flies back to him, cutting each foe once more, then is spent in a puff of motes.
 */
export function createStreamSword(o: StreamSword): Effect {
  const face = o.face ?? hero.face;
  const startX = hero.x + face * 8;
  const startY = hero.y + LINE;
  const p = { x: o.from.x, y: o.from.y, angle: o.from.angle };
  const out = new Set<Enemy>();
  const back = new Set<Enemy>();
  let t = 0;
  let flown = 0;
  let returning = false;
  let spent = -1;
  const cut = (struck: Set<Enemy>, dir: number): void => {
    for (const e of game.enemies) {
      if (struck.has(e) || e.hp <= 0) continue;
      if (!boxHit([p.x - 4, p.y - STREAM.half, p.x + 4, p.y + STREAM.half], enemyBox(e))) continue;
      struck.add(e);
      dealDamage(e, o.damage, { fromX: p.x - dir * 6, kx: dir * 40, source: o.source, stun: o.stun });
      o.struck?.(e);
      game.fx.push(createImpact(...enemyCenter(e), dir, false, JADE_SPARKS));
    }
  };
  return {
    update(dt) {
      t += dt;
      if (spent >= 0) {
        spent += dt;
        return spent < MOTES;
      }
      if (t < o.delay) return true;
      const step = STREAM.speed * dt;
      if (!returning) {
        flown = Math.min(o.reach, flown + step);
        const tx = startX + face * flown;
        const ty = startY + o.rise * flown;
        const ease = Math.min(1, (t - o.delay) * 10);
        p.x += (tx - p.x) * ease;
        p.y += (ty - p.y) * ease;
        p.angle = face > 0 ? Math.atan2(o.rise, 1) : Math.PI - Math.atan2(o.rise, 1);
        cut(out, face);
        if (flown < o.reach) return true;
        if (o.returns) returning = true;
        else spent = 0;
        return true;
      }
      const hx = hero.x;
      const hy = hero.y + LINE - 6;
      const dx = hx - p.x;
      const dy = hy - p.y;
      const d = Math.hypot(dx, dy) || 1;
      p.angle = Math.atan2(dy, dx);
      p.x += (dx / d) * Math.min(d, step);
      p.y += (dy / d) * Math.min(d, step);
      cut(back, Math.sign(dx) || -face);
      if (d <= HOME + step) spent = 0;
      return true;
    },
    draw() {
      if (t < o.delay) return;
      if (spent >= 0) {
        drawSwordMotes(p.x, p.y, spent / MOTES);
        return;
      }
      drawSpiritSword(p.x, p.y, p.angle);
    },
  };
}
