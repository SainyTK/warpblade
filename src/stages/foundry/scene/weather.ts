import { GROUND, H, W } from "../../../constants/stage";
import { fleck, glow, hairline, px } from "../../../engine/frame";
import { stageViews } from "../../../game/adventure";
import { fxRng, particles } from "../../../game/state";
import { PK } from "../../../types/particle";
import { grain } from "../../../utils/grain";
import { inAnyView } from "../../../utils/views";
import { FORGE_SPARKS } from "../colors";
import { SCENE_COLORS as SC } from "./palette";

const EMBERS = 28;
const ASH = 16;
const SHIMMER = 6;
const GRATE = { every: 80, center: 36 } as const;
const GRATE_SPARKS = 0.5;

function embers(t: number, k: number): void {
  for (let i = 0; i < EMBERS; i++) {
    const speed = 12 + (i % 7) * 3 + k * 6;
    const span = H + 20;
    const age = (t * speed + grain(i, 2) * span) % span;
    const y = H - age;
    const x = (((grain(i, 1) * (W + 40) + Math.sin(t * 0.9 + i) * 6 + t * 3) % (W + 40)) + W + 40) % (W + 40);
    const heat = 1 - age / span;
    const c = SC.ember[Math.min(3, Math.floor(heat * 3.5 + (i % 2) * 0.5))];
    if (i % 4 === 0) px(x - 20, y, c, heat);
    else fleck(x - 20, y, c, Math.min(1, heat * 1.4));
    if (i % 6 === 0) glow(x - 20, y, 3, SC.glow, 0.2 * heat);
  }
}

function ash(t: number): void {
  for (let i = 0; i < ASH; i++) {
    const span = H + 10;
    const y = (t * (6 + (i % 4) * 2) + grain(i, 5) * span) % span;
    const x = (((grain(i, 6) * (W + 20) + Math.sin(t * 0.7 + i * 2) * 8 - t * 4) % (W + 20)) + W + 20) % (W + 20);
    fleck(x - 10, y - 5, SC.ash[i % 3], 0.8);
  }
}

function shimmer(t: number): void {
  for (let i = 0; i < SHIMMER; i++) {
    const y = GROUND - 4 - ((t * 8 + i * 9) % 46);
    const x = (grain(i, 8) * W + t * 5 * (i % 2 ? 1 : -1) + W) % W;
    const life = 1 - (GROUND - 4 - y) / 46;
    for (let s = 0; s < 4; s++) {
      const x0 = x + s * 4;
      hairline(
        x0,
        y + Math.sin(t * 6 + s + i) * 0.7,
        x0 + 4,
        y + Math.sin(t * 6 + s + 1 + i) * 0.7,
        SC.heat,
        0.14 * life,
      );
    }
  }
}

export function drawForgeWeather(t: number, k: number): void {
  embers(t, k);
  ash(t);
  shimmer(t);
}

export function updateForge(dt: number): void {
  const views = stageViews();
  const first = Math.floor((Math.min(...views) - GRATE.center) / GRATE.every) + 1;
  const last = Math.max(...views) + W;
  for (let n = first; n * GRATE.every + GRATE.center < last; n++) {
    if (!inAnyView(views, n * GRATE.every + GRATE.center, 0)) continue;
    if (!fxRng.chance(dt * GRATE_SPARKS)) continue;
    const x = n * GRATE.every + GRATE.center + fxRng.range(-6, 6);
    particles.spawn(PK.EMBER, x, GROUND + 4, fxRng.range(-8, 8), -fxRng.range(30, 60), fxRng.range(0.6, 1.2), {
      sparks: FORGE_SPARKS.ember,
    });
  }
}
