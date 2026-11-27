import { GROUND } from "../../../../constants/stage";
import { glow, glowLine, hairline, line, place } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { VEIL } from "../colors";
import { beamEnd, eyeAt } from "./aim";
import { SEER } from "./constants";

const P = VEIL.prism;

function floorStop(x0: number, y0: number, x1: number, y1: number): [number, number] {
  if (y1 <= GROUND) return [x1, y1];
  const k = (GROUND - y0) / (y1 - y0);
  return [x0 + (x1 - x0) * k, GROUND];
}

function strikes(x0: number, y0: number, x1: number, y1: number): boolean {
  const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 4);
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const y = y0 + ((y1 - y0) * i) / n;
    if (boxHit([x - SEER.half, y - SEER.half, x + SEER.half, y + SEER.half], heroBox())) return true;
  }
  return false;
}

export function createPrismBeam(e: Enemy, damage: number): Effect {
  const struck = new Set<number>();
  return {
    update() {
      if (e.hp <= 0 || (e.state !== "wind" && e.state !== "shoot")) return false;
      if (e.state !== "shoot" || e.st > SEER.beam * 0.7) return true;
      const [x0, y0] = eyeAt(e);
      const [x1, y1] = floorStop(x0, y0, ...beamEnd(e));
      eachStanding(() => {
        if (struck.has(heroSlot()) || !strikes(x0, y0, x1, y1)) return;
        struck.add(heroSlot());
        hurtHero(damage, x0);
      });
      return true;
    },
    draw() {
      place();
      const [x0, y0] = eyeAt(e);
      const [x1, y1] = floorStop(x0, y0, ...beamEnd(e));
      if (e.state === "wind") {
        const k = clamp(e.st / SEER.aim);
        const locked = e.st >= SEER.aim - SEER.lock;
        const blink = locked && Math.floor(e.st * 24) % 2 === 0;
        hairline(x0, y0, x1, y1, blink ? WHITE : P[1], 0.25 + 0.5 * k);
        if (locked) glowLine(x0, y0, x1, y1, 3, P[1], 0.3);
        glow(x1, y1, 4 + k * 4, P[1], 0.4 * k);
        return;
      }
      const u = clamp(e.st / SEER.beam);
      const fade = 1 - u * u;
      const ox = -Math.sin(e.ax);
      const oy = Math.cos(e.ax);
      for (let i = -2; i <= 2; i++) {
        const c = i === 0 ? WHITE : P[(i + 4) % P.length];
        line(x0 + ox * i, y0 + oy * i, x1 + ox * i, y1 + oy * i, c, fade * (i === 0 ? 1 : 0.7));
      }
      glowLine(x0, y0, x1, y1, 12, P[3], 0.6 * fade);
      glow(x1, y1, 16, P[0], 0.6 * fade);
      glow(x0, y0, 10, WHITE, 0.5 * fade);
    },
  };
}
