import { BRAZIER_COLORS as C, RITE_RAMP } from "../../../constants/ysra/emberLook";
import { BRAZIER } from "../../../constants/ysra/rites";
import { glow, line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PF, PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { emitSkillEvent } from "../../skills/events";
import { game, particles, progress, rng } from "../../state";
import { dust } from "../../world";
import { burstEmbers } from "./emberBurst";
import { createEmberShot, type EmberSpec } from "./emberShot";
import { crackle, riteSound } from "./riteSound";

/** seconds the flame takes to die down at the end */
const FADE = 0.5;
/** seconds the bowl flares after it spits */
const KICK = 0.14;

/** a brazier's level: seconds it stands, seconds between shots, embers a shot, each ember's strength, its aura's power
 *  (0 none), its burst when it burns out (0 none), and Forge Altar's seconds between salamanders (0 none) */
export interface BrazierSpec {
  life: number;
  every: number;
  shots: number;
  ember: EmberSpec;
  aura: number;
  burst: number;
  altar: number;
}

interface Brazier {
  x: number;
  y: number;
  t: number;
  cd: number;
  kick: number;
  aura: number;
  altar: number;
  spec: BrazierSpec;
}
/** the brazier standing now; a new one puts the old one out */
const placed: { standing: Brazier | null } = { standing: null };
rememberPerSeat(objectMemory(placed));

/** the foes within reach of the bowl, nearest first */
function foesNear(b: Brazier): Enemy[] {
  const near = (e: Enemy) => {
    const [ex, ey] = enemyCenter(e);
    return Math.hypot(ex - b.x, ey - b.y);
  };
  return game.enemies.filter((e) => e.hp > 0 && near(e) < BRAZIER.seek).sort((a, c) => near(a) - near(c));
}

/** one shot: an ember at each of the nearest foes, as many as the level spits at once */
function spit(b: Brazier): boolean {
  const foes = foesNear(b);
  if (!foes.length) return false;
  for (let i = 0; i < b.spec.shots; i++) {
    const [ex, ey] = enemyCenter(foes[i % foes.length]);
    game.fx.push(createEmberShot(b.x + (i - (b.spec.shots - 1) / 2) * 2, b.y - 13, ex, ey, b.spec.ember));
  }
  b.kick = KICK;
  crackle(0.9);
  return true;
}

/** the bowl burns the foes standing at it */
function scorchNear(b: Brazier): void {
  for (const e of game.enemies)
    if (e.hp > 0 && Math.abs(e.x - b.x) < BRAZIER.aura && Math.abs(enemyCenter(e)[1] - b.y) < 20)
      dealDamage(e, progress.stats.ap * b.spec.aura, { dot: true, source: b.spec.ember.source });
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

/** it burns out: Brazier's burst throws fire around the bowl */
function burnOut(b: Brazier): void {
  if (b.spec.burst)
    burstEmbers(b.x, b.y - 10, progress.stats.ap * b.spec.burst, BRAZIER.burstRadius, 2, b.spec.ember.source);
}

/**
 * Brazier: an iron bowl of fire planted on the floor that spits embers at the nearest foes, one brazier at a time; as
 * Forge Altar it lets out a salamander every few seconds through the `altar` skill event.
 */
export function plantBrazier(x: number, floor: number, spec: BrazierSpec): Effect {
  if (placed.standing) placed.standing.t = Math.max(placed.standing.t, placed.standing.spec.life);
  const b: Brazier = { x, y: floor, t: 0, cd: 0.3, kick: 0, aura: 0, altar: spec.altar, spec };
  placed.standing = b;
  dust(x, floor, 6);
  riteSound(BRAZIER.pitch);
  return {
    update(dt) {
      b.t += dt;
      b.kick = Math.max(0, b.kick - dt);
      b.cd -= dt;
      const life = spec.life;
      const lit = b.t < life;
      if (lit && b.cd <= 0) b.cd = spit(b) ? spec.every : 0.1;
      b.aura -= dt;
      if (lit && spec.aura && b.aura <= 0) {
        b.aura = BRAZIER.auraTick;
        scorchNear(b);
      }
      b.altar -= dt;
      if (lit && spec.altar && b.altar <= 0) {
        b.altar = spec.altar;
        emitSkillEvent({ type: "altar", x: b.x, y: b.y });
      }
      if (!lit && b.t - dt < life) burnOut(b);
      if (rng.chance(lit ? 0.35 : 0.15))
        particles.spawn(PK.FIRE, b.x + rng.range(-2, 2), b.y - 14, rng.range(-4, 4), -rng.range(10, 24), 0.3, {
          col: 0,
          size: rng.range(0.8, 1.4),
          flag: lit ? 0 : PF.SMOKES,
        });
      const over = b.t >= life + FADE;
      if (over && placed.standing === b) placed.standing = null;
      return !over;
    },
    draw: () => drawBrazier(b, clamp((spec.life + FADE - b.t) / FADE)),
  };
}

/** a fresh run: no brazier stands */
export function clearBrazier(): void {
  placed.standing = null;
}
