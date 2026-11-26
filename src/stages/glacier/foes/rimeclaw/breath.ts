import { GROUND } from "../../../../constants/stage";
import { disc, fleck, glow, hairline, place } from "../../../../engine/frame";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { freezeFloor } from "../../hazard";
import { FOE } from "../colors";
import { CLAW, CLAW_TIMES } from "./constants";

const MOUTH = 34;
const GROW = 0.22;

export function createFrostBreath(e: Enemy, damage: number): Effect {
  let t = 0;
  const face = e.face;
  const from = e.x + face * MOUTH;
  const end = clampStageX(from + face * CLAW.breathReach, 4);
  const struck = new Set<number>();
  freezeFloor(from, end, CLAW.slick + CLAW_TIMES.breath);
  const reach = () => from + (end - from) * clamp(t / GROW);
  return {
    update(dt) {
      t += dt;
      const front = reach();
      const live = t < CLAW_TIMES.breath;
      if (live && fxRng.chance(0.7))
        particles.spawn(
          PK.VAPOUR,
          from + (front - from) * fxRng.next(),
          GROUND - fxRng.range(2, 10),
          face * fxRng.range(20, 60),
          -fxRng.range(4, 14),
          0.6,
          {
            col: FOE.crystal[3],
            size: fxRng.range(2, 3.5),
          },
        );
      eachStanding(() => {
        if (!live || struck.has(heroSlot())) return;
        const box = [Math.min(from, front), GROUND - CLAW.breathHeight, Math.max(from, front), GROUND] as const;
        if (!boxHit(box, heroBox())) return;
        struck.add(heroSlot());
        hurtHero(damage, from);
      });
      return t < CLAW_TIMES.breath + 0.3;
    },
    drawBack() {},
    draw() {
      const fade = 1 - clamp((t - CLAW_TIMES.breath) / 0.3);
      const front = reach();
      const span = front - from;
      place();
      for (let i = 0; i < 9; i++) {
        const u = (i + 0.5) / 9;
        const x = from + span * u;
        const swell = 3 + u * 6 + Math.sin(t * 14 + i * 1.7) * 1.2;
        disc(x, GROUND - swell * 0.8, swell, FOE.crystal[i % 2 ? 2 : 3], 0.32 * fade);
        disc(x, GROUND - swell * 0.5, swell * 0.5, FOE.crystal[4], 0.35 * fade);
      }
      for (let i = 0; i < 5; i++) {
        const y = GROUND - 2 - i * 2.2;
        const wobble = Math.sin(t * 20 + i) * 3;
        hairline(from, GROUND - 8 + i, from + span * (0.6 + i * 0.08) + wobble, y, FOE.crystal[4], 0.7 * fade);
      }
      for (let i = 0; i < 8; i++) fleck(from + span * fxRng.next(), GROUND - fxRng.range(1, 14), FOE.eyeHot, fade);
      glow(from + span / 2, GROUND - 6, Math.abs(span) / 2 + 8, FOE.crystal[2], 0.35 * fade);
    },
  };
}
