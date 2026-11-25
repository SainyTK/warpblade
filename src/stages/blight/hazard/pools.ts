import { GROUND, W } from "../../../constants/stage";
import { disc, fleck, glow, place } from "../../../engine/frame";
import { fxRng, game, hero, particles } from "../../../game/state";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { BLIGHT } from "../colors";
import { drawPoolSurface, type Exposure, exposure, linger, strikeOnce } from "../spores";
import { POOL_SITES } from "./sites";

export const POOL = { cycle: 3.4, heave: 0.8, plume: 0.55, height: 34, tick: 3, plumeHit: 7, grace: 0.3 } as const;
const FEET = 3;

interface PoolState {
  touch: Exposure;
  struck: Set<number>;
  lastCycle: number;
}

const states: PoolState[] = POOL_SITES.map(() => ({ touch: exposure(POOL.grace), struck: new Set(), lastCycle: -1 }));
let clock = 0;

const cycleAt = (offset: number): number => clock / POOL.cycle + offset;

function phaseOf(offset: number): { heave: number; plume: number } {
  const u = (cycleAt(offset) % 1) * POOL.cycle;
  const start = POOL.cycle - POOL.heave - POOL.plume;
  if (u < start) return { heave: 0, plume: 0 };
  if (u < start + POOL.heave) return { heave: (u - start) / POOL.heave, plume: 0 };
  return { heave: 1, plume: (u - start - POOL.heave) / POOL.plume };
}

export function resetPools(): void {
  clock = 0;
  for (const s of states) {
    s.touch.inside.clear();
    s.struck.clear();
    s.lastCycle = -1;
  }
}

export function updatePools(dt: number): void {
  clock += dt;
  const scale = waveScale(game.wave).damage;
  POOL_SITES.forEach((p, i) => {
    const s = states[i];
    if (hero.x < p.x0 - W || hero.x > p.x1 + W) return;
    const mid = (p.x0 + p.x1) / 2;
    const standing = (): boolean =>
      hero.x + FEET > p.x0 && hero.x - FEET < p.x1 && hero.y >= GROUND - 1.5 && hero.y <= GROUND + 2;
    linger(s.touch, dt, standing, POOL.tick * scale, mid);
    const cycle = Math.floor(cycleAt(p.offset));
    if (cycle !== s.lastCycle) {
      s.lastCycle = cycle;
      s.struck.clear();
    }
    const { heave, plume } = phaseOf(p.offset);
    if (plume > 0 && plume < 0.7) {
      const top = GROUND - POOL.height * Math.min(1, plume * 2.5);
      strikeOnce(s.struck, [p.x0 + 2, top, p.x1 - 2, GROUND], POOL.plumeHit * scale, mid);
    }
    if (heave > 0 && plume === 0 && fxRng.chance(0.5))
      particles.spawn(PK.MOTE, fxRng.range(p.x0, p.x1), GROUND - 1, 0, -fxRng.range(10, 24), 0.4, {
        col: BLIGHT.poison[4],
        size: 0.5,
      });
    if (plume > 0 && plume < 0.5 && fxRng.chance(0.8))
      particles.spawn(
        PK.SMOKE,
        fxRng.range(p.x0 + 2, p.x1 - 2),
        GROUND - 4,
        fxRng.range(-6, 6),
        -fxRng.range(50, 80),
        0.6,
        {
          col: BLIGHT.poison[2],
          size: fxRng.range(2, 3.5),
        },
      );
    if (fxRng.chance(0.05))
      particles.spawn(PK.MOTE, fxRng.range(p.x0, p.x1), GROUND - 2, 0, -8, 0.8, { col: BLIGHT.poison[3], size: 0.5 });
  });
}

const visible = (x0: number, x1: number, cameraX: number): boolean => x1 >= cameraX - 20 && x0 <= cameraX + W + 20;

export function drawPools(cameraX: number, t: number): void {
  place();
  for (const p of POOL_SITES) {
    if (!visible(p.x0, p.x1, cameraX)) continue;
    const { heave } = phaseOf(p.offset);
    drawPoolSurface(p.x0, p.x1, GROUND, t + p.offset * 7, 1, heave);
    if (heave > 0.4) {
      const blink = heave > 0.75 && Math.sin(t * 30) > 0;
      for (let x = p.x0 + 3; x < p.x1 - 2; x += 4)
        fleck(x, GROUND - 2 - heave * 2 - ((x * 3) % 4), blink ? BLIGHT.markHot : BLIGHT.poison[4], heave);
    }
  }
}

export function drawPlumes(cameraX: number): void {
  place();
  for (const p of POOL_SITES) {
    if (!visible(p.x0, p.x1, cameraX)) continue;
    const { plume } = phaseOf(p.offset);
    if (plume <= 0) continue;
    const mid = (p.x0 + p.x1) / 2;
    const half = (p.x1 - p.x0) / 2;
    const rise = Math.min(1, plume * 2.5);
    const fade = 1 - clamp((plume - 0.5) / 0.5);
    for (let i = 0; i < 5; i++) {
      const u = i / 4;
      const y = GROUND - POOL.height * rise * u - 2;
      const r = half * (0.55 + u * 0.35);
      disc(mid + Math.sin(i * 2 + plume * 6) * 2, y, r, BLIGHT.poison[2], 0.4 * fade);
      disc(mid - 1 + Math.sin(i * 2 + plume * 6) * 2, y - r * 0.3, r * 0.55, BLIGHT.poison[3], 0.3 * fade);
    }
    glow(mid, GROUND - POOL.height * rise * 0.5, half + 12, BLIGHT.poison[3], 0.35 * fade);
  }
}
