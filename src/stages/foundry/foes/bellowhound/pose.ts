import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { HOUND_TIMES } from "./moves";

export interface HoundPose {
  stride: number;
  gallop: boolean;
  crouch: number;
  jaw: number;
  bellows: number;
  heat: number;
  head: number;
}

export function houndPose(e: Enemy, time: number): HoundPose {
  if (e.stagger > 0) return { stride: 0, gallop: false, crouch: 2, jaw: 0.8, bellows: 0, heat: 0, head: -2.5 };
  if (e.state === "wind") {
    const u = clamp(e.st / HOUND_TIMES.bite);
    return { stride: 0, gallop: false, crouch: u * 1.5, jaw: u * 0.6, bellows: 0.4, heat: u, head: -u * 1.5 };
  }
  if (e.state === "swipe") return { stride: 0, gallop: false, crouch: 0.5, jaw: 0, bellows: 0.2, heat: 1, head: 2 };
  if (e.state === "charge") {
    const u = clamp(e.st / HOUND_TIMES.brace);
    const scrape = Math.sin(time * 24) * 0.6;
    return { stride: scrape, gallop: false, crouch: 1.5 + u, jaw: 0.3, bellows: u, heat: u, head: 1.5 };
  }
  if (e.state === "lunge")
    return { stride: Math.sin(time * 26), gallop: true, crouch: 1, jaw: 0.5, bellows: 0.2, heat: 1, head: 1.5 };
  if (e.state === "recover") {
    const pant = Math.sin(time * 16) * 0.5 + 0.5;
    return { stride: 0, gallop: false, crouch: 0.5, jaw: 0.3 + pant * 0.3, bellows: 0.1 * pant, heat: 0.2, head: 0.5 };
  }
  const step = Math.sin(time * 8);
  return {
    stride: step,
    gallop: false,
    crouch: Math.abs(step) * 0.4,
    jaw: 0,
    bellows: 0.3 + 0.2 * Math.sin(time * 3),
    heat: 0,
    head: 0,
  };
}
