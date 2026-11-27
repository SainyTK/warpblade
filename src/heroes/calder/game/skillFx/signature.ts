import { progress } from "../../../../game/state";
import type { FxAt, FxSignature } from "../../../../types/skillFx";
import { grain } from "../../../../utils/grain";
import { clamp, ease, lerp, TAU } from "../../../../utils/math";
import { HOT_RAMP } from "../../constants/colors";
import { drawBullet, drawCasing, drawChamber } from "./rounds";

export type RoundPath = "in" | "out" | "along";

const FLIGHT = 0.32;
const CASINGS = [0, 2, 4, 8] as const;
const FAN = 6;
const TWIN_GAP = 0.08;

function path(at: FxAt, kind: RoundPath, size: number): readonly [number, number, number, number] {
  const face = at.face ?? 1;
  const reach = Math.sqrt(size);
  if (kind === "along") {
    return [0, 0, ((at.toX ?? at.x + face * 40) - at.x) * face, (at.toY ?? at.y) - at.y];
  }
  if (kind === "out") {
    return [0, 0, 26 * reach, 0];
  }
  return [-18 * reach, -3, 0, 0];
}

export function calderSignature(kind: RoundPath): FxSignature {
  return (cast, at, kit, progressed, fade) => {
    const rank = cast.feel.rank;
    const mastered = (progress.build.mastery[cast.id] ?? 0) > 0;
    const tracer = kit.look.ramp[4];
    const [sx, sy, tx, ty] = path(at, kind, cast.size);
    const angle = Math.atan2(ty - sy, tx - sx);
    const length = 2 + rank * 0.6;
    const flight = clamp(progressed / FLIGHT);
    if (flight < 1) {
      const f = ease.outQuad(flight);
      drawBullet(lerp(sx, tx, f), lerp(sy, ty, f), angle, length, tracer, fade);
    }
    const twin = clamp((progressed - TWIN_GAP) / FLIGHT);
    if (mastered && twin > 0 && twin < 1) {
      const f = ease.outQuad(twin);
      drawBullet(lerp(sx, tx, f), lerp(sy, ty, f) - 3, angle, length, HOT_RAMP[4], fade);
    }
    const time = progressed * 0.7;
    const casings = CASINGS[rank] + (mastered ? 2 : 0);
    for (let i = 0; i < casings; i++) {
      const vx = -(12 + grain(i, 3) * 34) * (i % 2 ? 1 : -0.6);
      const vy = -(50 + grain(i, 5) * 60);
      drawCasing(sx, sy - 2, vx, vy, 14 + grain(i, 9) * 10, time, fade * (1 - progressed * 0.5));
    }
    if (rank >= 2) {
      const radius = (4 + rank * 2) * Math.sqrt(cast.size);
      const loaded = mastered ? 6 : 6 - Math.floor(progressed * 7);
      drawChamber(tx, ty, radius, progressed * 7, fade * (1 - progressed), loaded);
      if (mastered) {
        drawChamber(tx, ty, radius + 3, -progressed * 5, fade * (1 - progressed) * 0.8, 6);
      }
    }
    if (rank >= 3) {
      const out = ease.outCubic(clamp(progressed * 1.6)) * 30 * Math.sqrt(cast.size);
      for (let i = 0; i < FAN; i++) {
        const a = (i / FAN) * TAU + 0.26;
        const d = 4 + out;
        drawBullet(tx + Math.cos(a) * d, ty + Math.sin(a) * d * 0.7, a, 2.5, tracer, fade * (1 - progressed * 0.6));
      }
    }
  };
}
