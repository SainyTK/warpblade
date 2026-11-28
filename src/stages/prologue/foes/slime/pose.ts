import { GROUND } from "../../../../constants/stage";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { SLIME } from "./constants";
import { slimeTell } from "./moves";

export interface SlimePose {
  half: number;
  tall: number;
  lean: number;
  quiver: number;
  hurt: boolean;
}

const pose: SlimePose = { half: 6.5, tall: 7, lean: 0, quiver: 0, hurt: false };

export function slimePose(e: Enemy, t: number): SlimePose {
  const time = t + e.seed;
  const airborne = e.y < GROUND;
  pose.hurt = e.stagger > 0 || e.stun > 0 || e.air;
  pose.quiver = 0;
  pose.lean = 0;
  if (pose.hurt) {
    pose.half = 7;
    pose.tall = 5.5;
    return pose;
  }
  if (e.state === "wind") {
    const k = clamp(e.st / slimeTell());
    pose.half = 6.5 + k * 1.8;
    pose.tall = 7 - k * 2.6;
    pose.quiver = Math.sin(time * 60) * (0.3 + k * 0.5);
    pose.lean = -k;
    return pose;
  }
  if (airborne) {
    const rising = e.vy < 0;
    pose.half = rising ? 5 : 5.8;
    pose.tall = rising ? 9.5 : 8.2;
    pose.lean = e.state === "lunge" ? 2 : rising ? 0.8 : 0;
    return pose;
  }
  const squash = e.state === "walk" ? clamp((e.ay - (SLIME.hopEvery - SLIME.land)) / SLIME.land) : 0;
  const ready = e.state === "walk" && e.ay < 0.12 ? clamp(1 - e.ay / 0.12) : 0;
  const breathe = Math.sin(time * 4) * 0.3;
  pose.half = 6.5 + squash * 1.6 + ready * 0.8 - breathe * 0.5;
  pose.tall = 7 - squash * 2.2 - ready * 1.4 + breathe;
  return pose;
}
