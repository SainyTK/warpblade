import { GROUND, H } from "../../../constants/stage";
import { fleck, glow, hairline, px } from "../../../engine/frame";
import { stagePits } from "../../../game/adventure";
import { fxRng, particles } from "../../../game/state";
import { PK } from "../../../types/particle";
import type { Platform } from "../../../types/world";
import { grain } from "../../../utils/grain";
import { FORGE, FORGE_SPARKS } from "../colors";

const M = FORGE.molten;
const SURFACE = H - 9;
const EMBERS_PER_SECOND = 1.6;

function pool(gap: Platform, t: number): void {
  for (let x = gap.x0 + 1; x < gap.x1 - 1; x += 0.5) {
    const top = SURFACE + Math.sin(x * 0.5 + t * 2.2) * 0.7 + Math.sin(x * 0.17 - t * 1.3) * 0.5;
    const drift = (x + t * 4) * 0.12;
    const crust = grain(Math.floor(drift), 7) < 0.3;
    hairline(x, top, x, H, crust ? FORGE.crust[1] : M[1]);
    hairline(x, top + 1.5, x, H, M[0]);
    fleck(x, top, crust ? FORGE.crust[3] : M[4]);
    if (!crust) fleck(x, top + 0.5, M[3]);
  }
  for (let i = 0; i < 2; i++) {
    const life = (t * 0.7 + grain(i, gap.x0)) % 1;
    const bx = gap.x0 + 3 + grain(i + Math.floor(t * 0.7 + grain(i, gap.x0)), gap.x0) * (gap.x1 - gap.x0 - 6);
    if (life < 0.3) px(bx, SURFACE - life * 4, M[4]);
  }
  const mid = (gap.x0 + gap.x1) / 2;
  const width = gap.x1 - gap.x0;
  glow(mid, SURFACE, width * 0.7, M[2], 0.55);
  glow(mid, GROUND, width * 0.6, M[2], 0.2);
}

export function drawLavaPits(cameraX: number, right: number, t: number): void {
  for (const gap of stagePits()) if (gap.x1 >= cameraX - 12 && gap.x0 <= right) pool(gap, t);
}

export function updateLavaPits(dt: number, cameraX: number, right: number): void {
  for (const gap of stagePits()) {
    if (gap.x1 < cameraX || gap.x0 > right || !fxRng.chance(dt * EMBERS_PER_SECOND)) continue;
    particles.spawn(
      PK.EMBER,
      fxRng.range(gap.x0 + 3, gap.x1 - 3),
      SURFACE,
      fxRng.range(-6, 6),
      -fxRng.range(30, 60),
      fxRng.range(0.8, 1.4),
      {
        sparks: FORGE_SPARKS.ember,
      },
    );
  }
}
