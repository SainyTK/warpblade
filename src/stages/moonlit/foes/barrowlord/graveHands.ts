import { GROUND } from "../../../../constants/stage";
import { fleck, glow, line, place, polygon } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { clamp } from "../../../../utils/math";
import { GRAVE } from "../graveColors";

const HANDS = { speed: 120, every: 9, reach: 100, rise: 0.12, hold: 0.22, sink: 0.25, tall: 12, half: 4 } as const;
const B = GRAVE.bone;
const FINGERS = [-2, -0.6, 0.8, 2] as const;

function hand(x: number, h: number, lean: number): void {
  const top = GROUND - h;
  polygon(
    [
      [x - 1.8, GROUND],
      [x + 1.8, GROUND],
      [x + 2.2 + lean, top + 3],
      [x - 2.2 + lean, top + 3],
    ],
    B[2],
  );
  line(x - 1.8, GROUND, x - 2.2 + lean, top + 3, B[3]);
  line(x + 1.8, GROUND, x + 2.2 + lean, top + 3, B[1]);
  for (const f of FINGERS) {
    const fx = x + lean + f;
    line(fx, top + 3, fx + lean * 0.5, top + Math.abs(f) * 0.5, B[3]);
    fleck(fx + lean * 0.5, top + Math.abs(f) * 0.5, B[4]);
  }
}

export function createGraveHands(x: number, dir: number, damage: number): Effect {
  let t = 0;
  const struck = new Set<number>();
  const height = (age: number): number => {
    if (age < 0) return 0;
    if (age < HANDS.rise) return HANDS.tall * (age / HANDS.rise);
    if (age < HANDS.rise + HANDS.hold) return HANDS.tall;
    return HANDS.tall * clamp(1 - (age - HANDS.rise - HANDS.hold) / HANDS.sink);
  };
  const count = Math.floor(HANDS.reach / HANDS.every);
  const spots = Array.from({ length: count }, (_, i) => ({
    x: x + dir * i * HANDS.every,
    at: (i * HANDS.every) / HANDS.speed,
  }));
  const live = spots.filter((s) => s.x > stageLeft() + 4 && s.x < stageRight() - 4);
  return {
    update(dt) {
      t += dt;
      for (const s of live) {
        const h = height(t - s.at);
        if (h < 4 || t - s.at > HANDS.rise + HANDS.hold) continue;
        eachStanding(() => {
          if (struck.has(heroSlot()) || !boxHit([s.x - HANDS.half, GROUND - h, s.x + HANDS.half, GROUND], heroBox()))
            return;
          struck.add(heroSlot());
          hurtHero(damage, s.x - dir * 6);
        });
      }
      const last = live.length ? live[live.length - 1].at : 0;
      return t < last + HANDS.rise + HANDS.hold + HANDS.sink;
    },
    draw() {
      place();
      for (const [i, s] of live.entries()) {
        const h = height(t - s.at);
        if (h < 0.5) continue;
        const lean = (i % 2 ? 0.6 : -0.6) * dir;
        hand(s.x, h, lean);
        glow(s.x, GROUND - h * 0.5, 8, GRAVE.fire[2], 0.25 * (h / HANDS.tall));
      }
    },
  };
}
