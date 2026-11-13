import { WORLD_COLORS as WC } from "../constants/palette";
import { BRAZIERS, GROUND, W } from "../constants/stage";
import { glow, haze, place } from "../engine/frame";
import { game } from "../game/state";
import { paletteAt } from "./eras/sceneDef";
import { scene } from "./scenery";

/** how thick a mist bank is at its middle when the era's mist is full */
const MIST_DENSITY = 0.09;
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

/** faint wide banks of mist drifting along the floor, in front of everything */
export function drawMist(): void {
  const { def, k } = scene();
  if (def.mist <= 0) return;
  const tint = paletteAt(def, k).mist;
  place();
  for (const m of MIST) {
    const x = ((m.x + game.t * m.v) % (W + 60)) - 30;
    haze(x, m.y, m.r * 2, m.r * 0.5, tint, MIST_DENSITY * def.mist);
  }
}
