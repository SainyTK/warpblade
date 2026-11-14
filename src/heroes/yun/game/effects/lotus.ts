import { ellipseRing, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { touches } from "../../../../game/skills/targets";
import { game, hero } from "../../../../game/state";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import { TAU } from "../../../../utils/math";
import { LOTUS } from "../../constants/abilities";
import { JADE, JADE_SPARKS } from "../../look";
import { drawSpiritSword, drawSwordMotes } from "../art/spiritSword";

/** a lotus of spinning swords: how many, how wide, how long, what each cut deals, and whether it follows Yun */
export interface LotusShape {
  swords: number;
  radius: number;
  life: number;
  damage: number;
  follow: boolean;
  source: SourceId;
  /** seconds between one sword's cuts */
  every?: number;
}

/** seconds the swords take to fly from his back into the ring, and to fade out of it */
const GATHER = 0.15;
const FADE = 0.25;

/**
 * Sword Lotus: the spirit swords fly to a point ahead and spin there round it in a ring, points outward, each cutting
 * every foe it passes every `LOTUS.every` seconds; held, the ring spins round Yun himself and follows him. When it ends
 * the swords are spent in motes.
 */
export function createLotus(o: LotusShape): Effect {
  const face = hero.face;
  const fixed = { x: hero.x + face * LOTUS.ahead, y: hero.y + LOTUS.height };
  const centre = (): [number, number] => (o.follow ? [hero.x, hero.y + LOTUS.height] : [fixed.x, fixed.y]);
  const every = o.every ?? LOTUS.every;
  const next = Array.from({ length: o.swords }, (_, i) => GATHER + (every * i) / o.swords);
  let t = 0;
  const swordAt = (i: number): [number, number, number] => {
    const [cx, cy] = centre();
    const a = t * LOTUS.spin * face + (i * TAU) / o.swords;
    const grow = Math.min(1, t / GATHER);
    const r = o.radius * grow;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.55, a];
  };
  return {
    update(dt) {
      t += dt;
      if (t > o.life) return t < o.life + FADE;
      for (let i = 0; i < o.swords; i++) {
        if (t < next[i]) continue;
        next[i] += every;
        const [sx, sy] = swordAt(i);
        for (const e of game.enemies) {
          if (e.hp <= 0 || !touches(e, sx, sy, LOTUS.touch)) continue;
          dealDamage(e, o.damage, { fromX: sx, kx: 0, ky: -10, source: o.source });
          game.fx.push(createImpact(...enemyCenter(e), Math.sign(e.x - sx) || face, false, JADE_SPARKS));
        }
      }
      return true;
    },
    draw() {
      place();
      const [cx, cy] = centre();
      const k = t > o.life ? 1 - (t - o.life) / FADE : 1;
      ellipseRing(cx, cy, o.radius + 2, (o.radius + 2) * 0.55, JADE[2], 0.35 * k);
      glow(cx, cy, o.radius, JADE[3], 0.12 * k);
      for (let i = 0; i < o.swords; i++) {
        const [sx, sy, a] = swordAt(i);
        if (t > o.life) drawSwordMotes(sx, sy, 1 - k);
        else drawSpiritSword(sx + Math.cos(a) * 6, sy + Math.sin(a) * 3.3, a + face * 0.9);
      }
    },
  };
}
