import { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { PRISM, TWILIGHT_COLORS as TC } from "./colors";
import { BLINK } from "./sprite";

const canvas = new SpriteCanvas(36, 36, 18, 18);
type Pt = readonly [number, number];

/** how much of the sprite is there: it shrinks to a glint as it blinks out and grows back where it lands */
function presence(e: Enemy): number {
  if (e.state !== "blink") return 1;
  return e.n === 0 ? 1 - clamp(e.st / BLINK.out) : clamp((e.st - BLINK.out) / (BLINK.back - BLINK.out));
}

/** a small crystal fairy: a faceted body, a bead head and two pairs of wings that split the light into colors */
export function drawSprite(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const k = presence(e);
  s.clear();
  if (k < 0.45) {
    // a glint where it vanished or is about to appear
    s.begin();
    const L = Math.round(2 + k * 8);
    for (let d = -L; d <= L; d++) {
      const c = Math.abs(d) < 2 ? WHITE : PRISM[(Math.abs(d) + Math.floor(time * 12)) % PRISM.length];
      s.set(d, 0, c);
      s.set(0, d, c);
    }
    s.commit(false);
    return s;
  }
  const bob = Math.round(Math.sin(time * 3) * 1);
  const flap = Math.sin(time * 22);
  const up = Math.round(flap * 3);
  const P = (x: number, y: number): Pt => [x * k, (y + bob) * k];
  const poly = (pts: readonly Pt[], c: number) =>
    s.poly(
      pts.map(([x, y]) => P(x, y)),
      c,
    );
  const set = (x: number, y: number, c: number) => {
    const [a, b] = P(x, y);
    s.set(a, b, c);
  };
  const hue = Math.floor(time * 5);
  const wing = (tip: Pt, tail: Pt, i: number) => {
    poly([[-1, -2], tip, tail], mix(PRISM[(hue + i) % 4], TC.crystalHot, 0.15));
    poly(
      [
        [-1, -2],
        [(tip[0] * 2) / 3, (tip[1] * 2) / 3 - 1],
        [(tail[0] * 2) / 3, (tail[1] * 2) / 3 - 1],
      ],
      mix(PRISM[(hue + i + 1) % 4], WHITE, 0.35),
    );
    set(tip[0], tip[1], WHITE);
  };
  // the far pair of wings, then the near pair
  s.begin();
  wing([-6, -11 + up], [-1, -8 + up], 1);
  wing([-7, 3 - up], [-3, 5 - up], 3);
  s.commit(false);
  s.begin();
  wing([-10, -9 + up], [-4, -3 + up], 0);
  wing([-9, 4 - up], [-5, 1 - up], 2);
  s.commit();
  // the crystal body, lit on its upper left facet, its core blazing as it gathers light
  s.begin();
  const core = e.state === "wind" || e.state === "shoot" ? WHITE : TC.crystalLight;
  poly(
    [
      [1, -4],
      [4, 1],
      [1, 7],
      [-2, 1],
    ],
    TC.crystal,
  );
  poly(
    [
      [1, -4],
      [1, 7],
      [-2, 1],
    ],
    TC.crystalLight,
  );
  set(1, 1, core);
  set(1, 2, core);
  set(2, 0, TC.crystalDark);
  set(3, 1, TC.crystalDark);
  set(1, 8, TC.crystal);
  s.commit();
  // the bead head with its little crest
  s.begin();
  const [hx, hy] = P(2, -6);
  s.dot(hx, hy, 2.4 * k, TC.crystalLight);
  set(1, -8, TC.crystalHot);
  set(0, -9, PRISM[0]);
  set(-1, -10, PRISM[1]);
  set(3, -6, e.state === "wind" ? WHITE : TC.eye);
  s.commit();
  s.outline(TC.outline);
  return s;
}
