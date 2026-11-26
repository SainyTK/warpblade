import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, place, polygon } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { shotWarded } from "../../../../game/shotWards";
import { fxRng, particles } from "../../../../game/state";
import { fieldPace } from "../../../../game/timeFields";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { FOE, FOE_SPARKS } from "../colors";

const LIFE = 2.6;
const HALF = 3;
const TRAIL = 5;

function tatter(x: number, y: number, n: number): void {
  for (let i = 0; i < n; i++)
    particles.spawn(PK.FLAKE, x, y, fxRng.range(-40, 40), fxRng.range(-50, 10), fxRng.range(0.4, 0.8), {
      col: FOE.paper[3],
      size: 1.1,
    });
}

export function createPaperBlade(x: number, y: number, vx: number, vy: number, damage: number): Effect {
  const o = { x, y, t: 0 };
  return {
    update(step) {
      const dt = step * fieldPace(o.x, o.y);
      o.t += dt;
      o.x += vx * dt;
      o.y += vy * dt;
      if (shotWarded(o.x, o.y)) {
        tatter(o.x, o.y, 4);
        return false;
      }
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - HALF, o.y - HALF, o.x + HALF, o.y + HALF], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x - Math.sign(vx) * 4);
      });
      if (struck) {
        for (let i = 0; i < 6; i++)
          particles.spawn(PK.SPARK, o.x, o.y, fxRng.range(-60, 60), fxRng.range(-60, 60), fxRng.range(0.15, 0.3), {
            sparks: FOE_SPARKS.paper,
          });
        tatter(o.x, o.y, 3);
        return false;
      }
      if (o.y >= GROUND - 1) {
        tatter(o.x, GROUND - 2, 2);
        return false;
      }
      return o.t < LIFE && o.x > stageLeft() - 10 && o.x < stageRight() + 10;
    },
    draw() {
      place();
      const speed = Math.hypot(vx, vy) || 1;
      const dx = vx / speed;
      const dy = vy / speed;
      const spin = o.t * 26;
      const c = Math.cos(spin);
      const s = Math.sin(spin);
      const arm = 3.2;
      hairline(o.x - dx * TRAIL, o.y - dy * TRAIL, o.x - dx * 1.5, o.y - dy * 1.5, FOE.paper[2], 0.55);
      polygon(
        [
          [o.x + c * arm, o.y + s * arm * 0.7],
          [o.x - s * 1.2, o.y + c * 1.2],
          [o.x - c * arm, o.y - s * arm * 0.7],
          [o.x + s * 1.2, o.y - c * 1.2],
        ],
        c > 0 ? FOE.paper[3] : FOE.paper[2],
      );
      hairline(o.x - c * 2, o.y - s * 1.4, o.x + c * 2, o.y + s * 1.4, FOE.text, 0.7);
      fleck(o.x + c * arm, o.y + s * arm * 0.7, FOE.paperGlint);
      fleck(o.x - c * arm, o.y - s * arm * 0.7, FOE.paperGlint);
      glow(o.x, o.y, 6, FOE.paper[3], 0.18);
    },
  };
}
