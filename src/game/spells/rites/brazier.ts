import { BRAZIER_COLORS as C, RITE_RAMP } from "../../../constants/ysra/emberLook";
import { BRAZIER } from "../../../constants/ysra/rites";
import { glow, line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PF, PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { enemyCenter } from "../../enemies/enemy";
import { game, particles, rng } from "../../state";
import { dust } from "../../world";
import { createEmberShot } from "./emberShot";
import { crackle, riteSound } from "./riteSound";

/** seconds the flame takes to die down at the end */
const FADE = 0.5;
/** seconds the bowl flares after it spits */
const KICK = 0.14;

interface Brazier {
  x: number;
  y: number;
  t: number;
  cd: number;
  kick: number;
}
/** the brazier standing now; a new one puts the old one out */
let standing: Brazier | null = null;

function nearestFoe(b: Brazier): Enemy | null {
  let best: Enemy | null = null;
  let bestD: number = BRAZIER.seek;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    const d = Math.hypot(ex - b.x, ey - b.y);
    if (d < bestD) {
      best = e;
      bestD = d;
    }
  }
  return best;
}

function spit(b: Brazier, e: Enemy): void {
  const [ex, ey] = enemyCenter(e);
  game.fx.push(createEmberShot(b.x, b.y - 13, ex, ey));
  b.kick = KICK;
  crackle(0.9);
}

/** iron legs and bowl, coals, and flame that leaps when it spits */
function drawBrazier(b: Brazier, flame: number): void {
  place();
  const { x, y } = b;
  line(x - 1, y - 8, x - 4, y - 1, C.iron);
  line(x + 1, y - 8, x + 4, y - 1, C.iron);
  line(x, y - 8, x, y - 4, C.iron);
  px(x - 4, y - 1, C.outline);
  px(x + 4, y - 1, C.outline);
  line(x - 3, y - 8, x + 3, y - 8, C.iron);
  line(x - 4, y - 9, x + 4, y - 9, C.ironLight);
  line(x - 5, y - 10, x + 5, y - 10, C.bronze);
  px(x - 5, y - 9, C.outline);
  px(x + 5, y - 9, C.outline);
  for (let dx = -4; dx <= 4; dx++) px(x + dx, y - 11, RITE_RAMP[(dx + Math.floor(b.t * 8)) % 2 ? 3 : 4]);
  const leap = 1 + (b.kick / KICK) * 0.8;
  for (let i = -1; i <= 1; i++) {
    const h = (4 + 3 * Math.abs(Math.sin(b.t * 11 + i * 1.9))) * flame * leap * (i === 0 ? 1.3 : 1);
    for (let d = 0; d < h; d++)
      px(x + i * 2 + Math.sin(b.t * 17 + d * 0.7) * 0.6, y - 12 - d, d < h * 0.45 ? RITE_RAMP[4] : RITE_RAMP[5]);
    if (b.kick > 0) px(x + i * 2, y - 12 - h, WHITE);
  }
  glow(x, y - 14, 22, RITE_RAMP[4], 0.45 * flame * leap);
}

/** Brazier: an iron bowl of fire planted on the floor that spits embers at the nearest foe, one brazier at a time */
export function plantBrazier(x: number, floor: number): Effect {
  if (standing) standing.t = Math.max(standing.t, BRAZIER.life);
  const b: Brazier = { x, y: floor, t: 0, cd: 0.3, kick: 0 };
  standing = b;
  dust(x, floor, 6);
  riteSound(BRAZIER.pitch);
  return {
    update(dt) {
      b.t += dt;
      b.kick = Math.max(0, b.kick - dt);
      b.cd -= dt;
      const lit = b.t < BRAZIER.life;
      if (lit && b.cd <= 0) {
        const foe = nearestFoe(b);
        if (foe) spit(b, foe);
        b.cd = foe ? BRAZIER.every : 0.1;
      }
      if (rng.chance(lit ? 0.35 : 0.15))
        particles.spawn(PK.FIRE, b.x + rng.range(-2, 2), b.y - 14, rng.range(-4, 4), -rng.range(10, 24), 0.3, {
          col: 0,
          size: rng.range(0.8, 1.4),
          flag: lit ? 0 : PF.SMOKES,
        });
      const over = b.t >= BRAZIER.life + FADE;
      if (over && standing === b) standing = null;
      return !over;
    },
    draw: () => drawBrazier(b, clamp((BRAZIER.life + FADE - b.t) / FADE)),
  };
}

/** a fresh run: no brazier stands */
export function clearBrazier(): void {
  standing = null;
}
