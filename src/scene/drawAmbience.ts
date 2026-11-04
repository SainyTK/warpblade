import { PAL, WORLD_COLORS as WC } from "../constants/palette";
import { ANCHORS, BRAZIERS, GROUND, H, W } from "../constants/stage";
import {
  color,
  ellipseRing,
  glow,
  line,
  place,
  polygon,
  px,
  shade,
  sparkle,
  toScreenX,
  toScreenY,
} from "../engine/frame";
import { findWarpTarget } from "../game/hero/warp";
import { isHeld } from "../game/input";
import { hasPerk } from "../game/progress";
import { game, hero } from "../game/state";
import { mix, WHITE } from "../utils/color";
import { TAU } from "../utils/math";
import { paletteAt } from "./eras/sceneDef";
import { scene } from "./scenery";

const MIST = Array.from({ length: 7 }, (_, i) => ({
  x: i * 52,
  y: GROUND - 2 + (i % 3) * 3,
  r: 14 + (i % 3) * 5,
  v: 4 + (i % 4),
}));

/** the era's own light (sun, moon, fireflies, aurora) and the flickering braziers */
export function drawAmbientLight(): void {
  const t = game.t;
  const { def, k } = scene();
  place();
  if (def.braziers > 0)
    for (const b of BRAZIERS)
      glow(
        b.x,
        b.y - 8,
        40 + Math.sin(t * 13 + b.x) * 2,
        WC.brazierGlow,
        (0.32 + Math.sin(t * 9 + b.x) * 0.04) * def.braziers,
      );
  def.ambient?.(t, k);
}

/** the era's weather in front of the fight: rain, petals, motes, ash */
export function drawWeather(): void {
  const { def, k } = scene();
  if (!def.weather) return;
  place();
  def.weather(game.t, k);
}

/** the era's lightning, as a whole-screen flash from 0 to 1 */
export function sceneFlash(): number {
  const { def, k } = scene();
  return def.flash?.(game.t, k) ?? 0;
}

/** the warp crystals bob and glow; with Crystal Hang, the one Kael would warp to gets a ring */
export function drawAnchors(): void {
  const I = PAL.crystal;
  const aiming =
    hasPerk("hang") && isHeld("up") && ["idle", "walk", "run", "jump", "fall", "hang"].includes(hero.state);
  const target = aiming ? findWarpTarget().anchor : undefined;
  place();
  for (const a of ANCHORS) {
    const y = a.y + Math.sin(game.t * 1.6 + a.x) * 1.5;
    const cx = toScreenX(a.x);
    polygon(
      [
        [a.x, y - 7],
        [a.x + 4, y],
        [a.x, y + 6],
        [a.x - 4, y],
      ],
      (sx) => (sx < cx ? I[4] : I[2]),
    );
    line(a.x, y - 7, a.x, y + 6, I[5]);
    px(a.x - 1, y - 3, WHITE);
    glow(a.x, y, 22, I[3], 0.35 + Math.sin(game.t * 2 + a.x) * 0.05);
    const o = game.t * 1.4 + a.x;
    for (let k = 0; k < 3; k++) {
      const g = o + (k * TAU) / 3;
      px(a.x + Math.cos(g) * 9, y + Math.sin(g) * 3, I[4], Math.sin(g) > 0 ? 1 : 0.4);
    }
    if (target === a) {
      ellipseRing(a.x, y, 10, 10, I[5], 0.7);
      sparkle(a.x, y - 11, 3, WHITE, I[4], 0.3);
    }
  }
}

/** faint wide banks of mist drifting along the floor, in front of everything */
export function drawMist(): void {
  const { def, k } = scene();
  if (def.mist <= 0) return;
  const tint = paletteAt(def, k).mist;
  place();
  for (const m of MIST) {
    const x = ((m.x + game.t * m.v) % (W + 60)) - 30;
    shade(x - m.r * 2, m.y - m.r * 0.5, x + m.r * 2, m.y + m.r * 0.5, (lx, ly) => {
      const d = Math.hypot((lx - x) / (m.r * 2), (ly - m.y) / (m.r * 0.5));
      if (d >= 1) return;
      const sx = Math.floor(toScreenX(lx));
      const sy = Math.floor(toScreenY(ly));
      if (sx < 0 || sy < 0 || sx >= W || sy >= H) return;
      const i = sy * W + sx;
      color[i] = mix(color[i], tint, 0.09 * def.mist * (1 - d) * (1 - d));
    });
  }
}
