import { GROUND, W } from "../../../constants/stage";
import { circle, fleck, glow, hairline, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { eachStanding } from "../../coopHooks";
import { createFloorRing } from "../../effects/floorRing";
import { hurtHero } from "../../hurtHero";
import { shotWarded } from "../../shotWards";
import { game, particles, rng } from "../../state";
import { fieldPace } from "../../timeFields";
import { boxHit, heroBox } from "../../world";
import { VOID, VOID_SPARKS } from "./colors";

export const ORB_GRAVITY = 240;
/** the tail behind a glob: how many fading blobs, their spacing and how far the last thread of light trails, in art pixels */
const TAIL = { blobs: 3, gap: 2.1, thread: 11 };
/** the thread of light fades along its length, u from 0 at the glob to 1 at its end */
const threadFade = (u: number): number => 0.9 * (1 - u);

/** a glob of void spat by the Abyss Maw: it arcs down and bursts on Kael, the floor or the edge of the stage */
export function createVoidOrb(x: number, y: number, vx: number, vy: number, damage: number): Effect {
  const o = { x, y, vy, t: 0 };
  const burst = () => {
    game.fx.push(createFloorRing(o.x, GROUND, 12, VOID, 0.3));
    for (let i = 0; i < 6; i++)
      particles.spawn(PK.SPARK, o.x, Math.min(o.y, GROUND - 1), rng.range(-70, 70), rng.range(-120, -20), 0.25, {
        sparks: VOID_SPARKS,
      });
  };
  return {
    update(step) {
      // a Stillfield slows the shot where it flies
      const dt = step * fieldPace(o.x, o.y);
      o.t += dt;
      o.vy += ORB_GRAVITY * dt;
      o.x += vx * dt;
      o.y += o.vy * dt;
      // a ward (Whirlwall) breaks the shot
      if (shotWarded(o.x, o.y)) return false;
      if (rng.chance(0.5))
        particles.spawn(PK.EMBER, o.x, o.y, -vx * 0.1, -o.vy * 0.1, rng.range(0.2, 0.4), { sparks: VOID_SPARKS });
      let struck = false;
      eachStanding(() => {
        if (struck || !boxHit([o.x - 3, o.y - 3, o.x + 3, o.y + 3], heroBox())) return;
        struck = true;
        hurtHero(damage, o.x);
      });
      if (struck) {
        burst();
        return false;
      }
      if (o.y >= GROUND - 2) {
        burst();
        return false;
      }
      return o.x > -6 && o.x < W + 6 && o.t < 4;
    },
    draw() {
      place();
      const wob = Math.sin(o.t * 30) * 0.3;
      const speed = Math.hypot(vx, o.vy) || 1;
      const bx = -vx / speed;
      const by = -o.vy / speed;
      // a tail of dying light streams behind it, thinning to a thread
      for (let j = TAIL.blobs; j >= 1; j--)
        circle(o.x + bx * j * TAIL.gap, o.y + by * j * TAIL.gap, 2.9 - j * 0.65, VOID[j === 1 ? 2 : 1], 1 - j * 0.2);
      hairline(o.x + bx * 4, o.y + by * 4, o.x + bx * TAIL.thread, o.y + by * TAIL.thread, VOID[3], threadFade);
      circle(o.x, o.y, 3.4 + wob, VOID[1]);
      circle(o.x, o.y, 2.7, VOID[3]);
      circle(o.x - 0.5, o.y - 0.6, 1.6, VOID[4]);
      circle(o.x - 0.8, o.y - 0.9, 0.7, VOID[5]);
      // two motes circle it on a tilted ring
      for (let i = 0; i < 2; i++) {
        const g = o.t * 14 + i * Math.PI;
        fleck(o.x + Math.cos(g) * 4.6, o.y + Math.sin(g) * 2.2, VOID[4]);
      }
      glow(o.x, o.y, 14, VOID[3], 0.5);
    },
  };
}
