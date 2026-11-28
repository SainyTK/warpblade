import { fleck, glow, glowLine, hairline, line, place } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { type GazeLine, gazeLine } from "./aim";
import { BASILISK_SPARKS, BASILISK_COLORS as C } from "./colors";
import { BASILISK, BASILISK_MOVE } from "./constants";
import { gazeTime } from "./timing";

const STEP = 3;
const SUN = C.sun;

const charging = (e: Enemy): boolean => e.state === "wind" && e.n === BASILISK_MOVE.gaze;
const firing = (e: Enemy): boolean => e.state === "beam";

function crosses(g: GazeLine): boolean {
  const len = Math.hypot(g.x1 - g.x0, g.y1 - g.y0);
  const n = Math.max(1, Math.ceil(len / STEP));
  const box = heroBox();
  const h = BASILISK.beamHalf;
  for (let i = 0; i <= n; i++) {
    const x = g.x0 + ((g.x1 - g.x0) * i) / n;
    const y = g.y0 + ((g.y1 - g.y0) * i) / n;
    if (boxHit([x - h, y - h, x + h, y + h], box)) return true;
  }
  return false;
}

function drawAim(g: GazeLine, k: number, locked: boolean, t: number): void {
  const dash = locked ? 1 : 0.5 + 0.5 * Math.sin(t * 30);
  const n = Math.ceil(Math.hypot(g.x1 - g.x0, g.y1 - g.y0) / 4);
  for (let i = 0; i < n; i++) {
    if (!locked && (i + Math.floor(t * 20)) % 2) continue;
    const a = i / n;
    const b = (i + 0.6) / n;
    hairline(
      g.x0 + (g.x1 - g.x0) * a,
      g.y0 + (g.y1 - g.y0) * a,
      g.x0 + (g.x1 - g.x0) * b,
      g.y0 + (g.y1 - g.y0) * b,
      locked ? SUN[2] : C.crack,
      (0.35 + 0.55 * k) * dash,
    );
  }
  if (locked) glowLine(g.x0, g.y0, g.x1, g.y1, 3, SUN[1], 0.18);
  glow(g.x0, g.y0, 6 + k * 10, SUN[1], 0.3 + 0.5 * k);
}

function drawBeam(g: GazeLine, k: number): void {
  const len = Math.hypot(g.x1 - g.x0, g.y1 - g.y0) || 1;
  const nx = -(g.y1 - g.y0) / len;
  const ny = (g.x1 - g.x0) / len;
  const half = BASILISK.beamHalf * (k < 0.15 ? k / 0.15 : 1 - Math.max(0, k - 0.7) / 0.3);
  glowLine(g.x0, g.y0, g.x1, g.y1, half * 4 + 4, SUN[1], 0.55);
  for (let o = -half; o <= half; o += 0.5) {
    const edge = Math.abs(o) / Math.max(0.5, half);
    const c = edge > 0.75 ? SUN[0] : edge > 0.45 ? SUN[1] : edge > 0.2 ? SUN[2] : WHITE;
    line(g.x0 + nx * o, g.y0 + ny * o, g.x1 + nx * o, g.y1 + ny * o, c, edge > 0.75 ? 0.7 : 1);
  }
  for (let i = 0; i < 6; i++) {
    const u = fxRng.next();
    fleck(g.x0 + (g.x1 - g.x0) * u + nx * fxRng.range(-half, half) * 1.4, g.y0 + (g.y1 - g.y0) * u, SUN[3]);
  }
  glow(g.x1, g.y1, 12, SUN[1], 0.6);
}

export function createSunGaze(e: Enemy, damage: number): Effect {
  let t = 0;
  let beamAt = -1;
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      if (e.hp <= 0) return false;
      if (firing(e) && beamAt < 0) beamAt = t;
      if (!charging(e) && !firing(e)) return false;
      if (!firing(e)) return true;
      const g = gazeLine(e);
      const live = t - beamAt < BASILISK.beamLive;
      if (fxRng.chance(0.8))
        particles.spawn(PK.EMBER, g.x1, g.y1, fxRng.range(-30, 30), -fxRng.range(20, 60), 0.4, {
          sparks: BASILISK_SPARKS.sun,
        });
      eachStanding(() => {
        if (!live || struck.has(heroSlot()) || !crosses(g)) return;
        struck.add(heroSlot());
        hurtHero(damage, g.x0);
      });
      return true;
    },
    draw() {
      if (e.hp <= 0) return;
      const g = gazeLine(e);
      place();
      if (firing(e)) drawBeam(g, clamp((t - beamAt) / BASILISK.beam));
      else if (charging(e)) drawAim(g, clamp(e.st / gazeTime()), e.st >= gazeTime() * BASILISK.lock, t);
    },
  };
}
