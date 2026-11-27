import { WORLD_COLORS } from "../../constants/palette";
import { glow, hairline, line, place } from "../../engine/frame";
import { PK } from "../../types/particle";
import type { ElementKit, FxAt, FxCast, FxShape } from "../../types/skillFx";
import { scale } from "../../utils/color";
import { smooth } from "../../utils/math";
import { fxRng, particles } from "../state";
import { surfaceBelow } from "../world";
import { particleAllowance } from "./budget";

const NEAR_FLOOR = 36;

const SPRAY: Readonly<Record<FxShape, readonly [angle: number, spread: number]>> = {
  burst: [0, Math.PI],
  slash: [0, 0.8],
  pillar: [-Math.PI / 2, 0.5],
  wave: [-Math.PI / 4, 0.6],
  trail: [Math.PI, 0.4],
  bolt: [-Math.PI / 2, 1.2],
  nova: [-Math.PI / 2, 1.3],
  spikes: [-Math.PI / 2 + 0.3, 0.6],
  mark: [-Math.PI / 2, Math.PI],
};

export interface Crack {
  points: readonly (readonly [number, number])[];
}

export function floorNear(at: FxAt): number | null {
  const floor = surfaceBelow(at.x, at.y);
  return floor - at.y <= NEAR_FLOOR ? floor : null;
}

export function spawnAftermath(shape: FxShape, cast: FxCast, at: FxAt, kit: ElementKit, budgetScale: number): void {
  const { feel } = cast;
  const face = at.face ?? 1;
  const [angle, spread] = SPRAY[shape];
  const aimed = face < 0 ? Math.PI - angle : angle;
  const spray = particleAllowance(Math.round(feel.particles * budgetScale));
  kit.spray(at.x, at.y, spray, 90 + feel.rank * 50, aimed, spread);
  const embers = particleAllowance(Math.round(feel.embers * budgetScale));
  kit.linger(at.x, at.y, embers, 6 * cast.size);
  const floor = floorNear(at);
  if (floor === null) return;
  const debris = particleAllowance(Math.round(feel.debris * budgetScale));
  for (let i = 0; i < debris; i++) {
    const s = fxRng.range(60, 140 + feel.rank * 40);
    const a = -Math.PI / 2 + fxRng.range(-0.9, 0.9);
    particles.spawn(
      PK.SHARD,
      at.x + fxRng.range(-6, 6),
      floor - 1,
      Math.cos(a) * s,
      Math.sin(a) * s,
      fxRng.range(0.5, 0.9),
      {
        col: i % 3 ? WORLD_COLORS.dust : kit.look.ramp[1],
        size: fxRng.range(1.5, 3),
      },
    );
  }
}

export function makeCracks(cast: FxCast, at: FxAt): Crack[] {
  const floor = floorNear(at);
  if (floor === null || cast.feel.cracks === 0) return [];
  return Array.from({ length: cast.feel.cracks }, (_, i) => {
    const side = i % 2 ? 1 : -1;
    let x = at.x + side * fxRng.range(1, 5);
    let y = floor;
    const points: [number, number][] = [[x, y]];
    const steps = 2 + cast.feel.rank;
    for (let j = 0; j < steps; j++) {
      x += side * fxRng.range(2, 4) * cast.size * 0.5;
      y += fxRng.range(0.3, 2.2);
      points.push([x, y]);
    }
    return { points };
  });
}

export function drawCracks(cracks: readonly Crack[], kit: ElementKit, age: number, life: number): void {
  if (cracks.length === 0) return;
  const glowing = 1 - smooth(0.2, 1, age / life);
  if (glowing <= 0) return;
  const R = kit.look.ramp;
  const dark = scale(kit.look.dark, 0.6);
  place();
  for (const { points } of cracks) {
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      const reach = 1 - i / points.length;
      line(x0, y0, x1, y1, dark, Math.min(1, glowing * 2));
      hairline(x0, y0 - 0.5, x1, y1 - 0.5, i === 1 ? R[5] : R[3], glowing * (0.5 + reach));
    }
    const [hx, hy] = points[1];
    glow(hx, hy, 6, R[3], 0.3 * glowing);
  }
}
