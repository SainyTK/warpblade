import { GROUND } from "../../../../constants/stage";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { QUILLSHRIKE } from "./moves";

export interface QuillshrikePose {
  pitch: number;
  flap: number;
  glare: number;
  shiver: number;
}

const DOWN = Math.PI / 2;

export function quillshrikePose(e: Enemy, time: number): QuillshrikePose {
  if (e.stagger > 0 || e.stun > 0) return { pitch: -0.5, flap: 0.6, glare: 0, shiver: 0 };
  if (e.state === "wind") {
    const k = clamp(e.st / (QUILLSHRIKE.wind * waveScale(game.wave).windup));
    const want = Math.atan2(GROUND - QUILLSHRIKE.tip - e.y, Math.max(4, Math.abs(e.ax - e.x)));
    return {
      pitch: -0.45 * (1 - k) + want * k,
      flap: -0.9,
      glare: k,
      shiver: k > 0.6 ? Math.sin(time * 60) * 0.05 : 0,
    };
  }
  if (e.state === "dive") return { pitch: Math.atan2(e.vy, Math.abs(e.vx)), flap: 1, glare: 1, shiver: 0 };
  if (e.state === "recover") {
    const k = clamp(e.st / QUILLSHRIKE.stuck);
    return { pitch: DOWN, flap: 0.8 - k * 0.4, glare: 0, shiver: Math.sin(time * 30) * 0.08 * (1 - k) };
  }
  if (e.state === "leap") {
    const k = clamp(e.st / QUILLSHRIKE.rise);
    return { pitch: DOWN * (1 - k) + 0.1 * k, flap: Math.sin(time * 18), glare: 0, shiver: 0 };
  }
  return { pitch: 0.12 + Math.sin(time * 2) * 0.05, flap: Math.sin(time * 9), glare: 0, shiver: 0 };
}
