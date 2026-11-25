import { GROUND, W } from "../../../constants/stage";
import { drillFighter } from "../../../drill";
import { fleck, glow, place, shade } from "../../../engine/frame";
import { hero } from "../../../game/state";
import { clamp, smooth } from "../../../utils/math";
import { GLACIER as G } from "../colors";
import { SLICK_STRIPS } from "./spots";

const GRIP = 0.1;
const SHEET = 2;
const FORM = 0.35;

interface Patch {
  x0: number;
  x1: number;
  life: number;
  age: number;
}

const patches: Patch[] = [];
let carried: number | null = null;

export function freezeFloor(x0: number, x1: number, life: number): void {
  patches.push({ x0: Math.min(x0, x1), x1: Math.max(x0, x1), life, age: 0 });
}

export function resetSlick(): void {
  patches.length = 0;
  carried = null;
}

function onSlick(x: number): boolean {
  for (const [x0, x1] of SLICK_STRIPS) if (x > x0 && x < x1) return true;
  for (const p of patches) if (p.age >= FORM && x > p.x0 && x < p.x1) return true;
  return false;
}

function slide(): void {
  const fighter = drillFighter();
  const body = fighter ?? hero;
  const grounded = fighter ? fighter.grounded : hero.ground;
  const dashing = fighter
    ? fighter.dashTime > 0 || !!fighter.warp
    : hero.state === "dash" || hero.state === "warpStrike";
  if (!grounded || dashing || hero.state === "dead" || body.y < GROUND - 0.5 || !onSlick(body.x)) {
    carried = null;
    return;
  }
  if (carried !== null) body.vx = carried + (body.vx - carried) * GRIP;
  carried = body.vx;
}

export function updateSlick(dt: number): void {
  for (const p of patches) p.age += dt;
  for (let i = patches.length - 1; i >= 0; i--) if (patches[i].age >= patches[i].life) patches.splice(i, 1);
  slide();
}

function sheet(x0: number, x1: number, t: number, strength: number): void {
  const width = x1 - x0;
  shade(x0, GROUND - 0.5, x1, GROUND + SHEET, (x, y, out) => {
    const u = x - x0;
    const v = y - GROUND;
    const edge = Math.min(u, width - u);
    if (edge < 0 || edge < (1 - strength) * width * 0.5) return;
    const shine = (((x * 0.7 - y * 2 - t * 9) % 14) + 14) % 14;
    if (v < 0) {
      out.c = edge > 2 ? G.ice[7] : G.ice[6];
      return;
    }
    out.c = shine < 1.4 ? G.glint : v < 1 ? G.ice[6] : G.ice[4];
    out.a = edge < 1.5 ? 0.6 : 1;
  });
  for (let i = 0; i < Math.floor(width / 12); i++) {
    const at = (t * 0.6 + i * 0.37) % 1;
    fleck(x0 + ((i * 12 + 5) % width), GROUND - 0.5, G.glint, Math.sin(at * Math.PI) * strength);
  }
  glow(x0 + width / 2, GROUND, width * 0.35, G.ice[6], 0.08 * strength);
}

export function drawSlick(cameraX: number, t: number): void {
  place();
  const near = (x0: number, x1: number): boolean => x1 > cameraX - 10 && x0 < cameraX + W + 10;
  for (const [x0, x1] of SLICK_STRIPS) if (near(x0, x1)) sheet(x0, x1, t, 1);
  for (const p of patches) {
    if (!near(p.x0, p.x1)) continue;
    const strength = clamp(p.age / FORM) * (1 - smooth(p.life - 0.8, p.life, p.age));
    sheet(p.x0, p.x1, t, strength);
  }
}
