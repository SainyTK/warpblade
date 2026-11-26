import { ellipseRing, fleck, glow, hairline, place, px } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { shotWarded } from "../../../../game/shotWards";
import { fxRng, hero, particles } from "../../../../game/state";
import { fieldPace } from "../../../../game/timeFields";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp, TAU } from "../../../../utils/math";
import { FOE, FOE_SPARKS } from "../colors";

export const GLYPH = { speed: 44, turn: 1.7, life: 4.6, radius: 5, fade: 0.6 } as const;
const G = FOE.glyph;

function burst(x: number, y: number): void {
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    particles.spawn(PK.SPARK, x, y, Math.cos(a) * 70, Math.sin(a) * 70, fxRng.range(0.2, 0.4), {
      sparks: FOE_SPARKS.glyph,
    });
  }
}

export function createGlyph(x: number, y: number, face: number, damage: number): Effect {
  const o = { x, y, t: 0, heading: face > 0 ? 0 : Math.PI };
  return {
    update(step) {
      const dt = step * fieldPace(o.x, o.y);
      o.t += dt;
      const want = Math.atan2(hero.y - 16 - o.y, hero.x - o.x);
      let turn = want - o.heading;
      while (turn > Math.PI) turn -= TAU;
      while (turn < -Math.PI) turn += TAU;
      const ease = clamp(o.t / 0.6);
      o.heading += clamp(turn, -GLYPH.turn * dt * ease, GLYPH.turn * dt * ease);
      const speed = GLYPH.speed * (0.4 + 0.6 * ease);
      o.x += Math.cos(o.heading) * speed * dt;
      o.y += Math.sin(o.heading) * speed * dt;
      if (shotWarded(o.x, o.y)) {
        burst(o.x, o.y);
        return false;
      }
      let struck = false;
      const r = GLYPH.radius;
      eachStanding(() => {
        if (struck || !boxHit([o.x - r, o.y - r, o.x + r, o.y + r], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x);
      });
      if (struck) {
        burst(o.x, o.y);
        return false;
      }
      if (o.t >= GLYPH.life || o.x < stageLeft() - 10 || o.x > stageRight() + 10) {
        burst(o.x, o.y);
        return false;
      }
      return true;
    },
    draw() {
      place();
      const left = GLYPH.life - o.t;
      const flicker = left < GLYPH.fade * 2 && Math.floor(o.t * 20) % 2 === 0 ? 0.45 : 1;
      const a = clamp(o.t * 4) * flicker;
      const spin = o.t * 3;
      const r = GLYPH.radius;
      glow(o.x, o.y, 14, G[2], 0.34 * a);
      ellipseRing(o.x, o.y, r, r, G[3], a);
      ellipseRing(o.x, o.y, r - 1.5, r - 1.5, G[1], a * 0.8);
      for (let i = 0; i < 3; i++) {
        const t0 = spin + (i * TAU) / 3;
        const t1 = t0 + TAU / 3;
        hairline(
          o.x + Math.cos(t0) * (r - 1.5),
          o.y + Math.sin(t0) * (r - 1.5),
          o.x + Math.cos(t1) * (r - 1.5),
          o.y + Math.sin(t1) * (r - 1.5),
          G[3],
          a,
        );
      }
      for (let i = 0; i < 6; i++) {
        const t0 = -spin * 0.7 + (i * TAU) / 6;
        fleck(o.x + Math.cos(t0) * (r + 1.5), o.y + Math.sin(t0) * (r + 1.5), G[4], a);
      }
      px(o.x - 0.5, o.y - 0.5, G[4], a);
      const tail = o.heading + Math.PI;
      for (let i = 1; i <= 3; i++)
        fleck(o.x + Math.cos(tail) * (r + i * 2), o.y + Math.sin(tail) * (r + i * 2), G[2], a * (1 - i / 4));
    },
  };
}
