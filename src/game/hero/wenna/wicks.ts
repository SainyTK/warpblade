import { PAL, WAX } from "../../../constants/palette";
import { BECKON } from "../../../constants/wenna/abilities";
import { WICK } from "../../../constants/wenna/wick";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import type { Wick, WickCause } from "../../../types/wenna";
import { heroSlot } from "../../coopHooks";
import { createFloorRing } from "../../effects/floorRing";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { surfaceBelow } from "../../world";
import { addWick, newWickId, ownWicks, standing } from "./wickWorld";

/** how many Wicks she keeps lit at once: Procession and Deep Tallow raise it */
export const wickCap = (): number =>
  WICK.cap + (skillValues("w_procession").cap ?? 0) + (skillValues("w_tallow").cap ?? 0);

/** a Wick's HP: a share of her max HP, so Vitality raises it; Deep Tallow adds more */
export const wickMaxHp = (): number =>
  Math.max(1, Math.round(progress.stats.hp * WICK.hpShare * (1 + (skillValues("w_tallow").hp ?? 0))));

/** a Wick of hers that stands now: risen and not melting */
export const isUp = (w: Wick): boolean => standing(w, WICK.rise);

/** her Wicks that have not begun to melt, risen or rising */
export const liveWicks = (): Wick[] => ownWicks().filter((w) => w.melt < 0);

/** her Wicks that count toward the cap */
export const cappedWicks = (): Wick[] => liveWicks().filter((w) => !w.extra);

/** her standing Wicks, nearest a point first */
export function wicksNear(x: number, y: number, reach: number): Wick[] {
  return liveWicks()
    .filter((w) => isUp(w) && Math.hypot(w.x - x, w.y - y) <= reach)
    .sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
}

export interface LightOptions {
  /** lit past the cap (a twin, Great Wick's melt), not counting toward it */
  extra?: boolean;
  /** seconds it lives, when not a Wick's usual life */
  life?: number;
}

/** wax pools on the floor and a violet flame rises out of it */
function pool(x: number, y: number): void {
  game.fx.push(createFloorRing(x, y, 10, [WAX[0], WAX[1], WAX[2], WAX[3], PAL.wick[4]], 0.35, 0.3));
  for (let i = 0; i < 6; i++)
    particles.spawn(PK.EMBER, x + rng.range(-4, 4), y - rng.range(1, 6), rng.range(-12, 12), -rng.range(20, 50), 0.5, {
      sparks: [PAL.wick[5], PAL.wick[4], PAL.wick[3], PAL.wick[2]],
    });
  lights.add(x, y - 8, 22, PAL.wick[4], 0.6, 0.3);
  sfx.chime(2);
}

/** light a Wick of hers on the floor under a point: it rises out of a pool of wax */
export function spawnWick(x: number, y: number, cause: WickCause, o: LightOptions = {}): Wick {
  const floor = surfaceBelow(x, y - 1);
  const max = wickMaxHp();
  const life = o.life ?? WICK.life;
  const w: Wick = {
    id: newWickId(),
    owner: heroSlot(),
    x,
    y: floor,
    vx: 0,
    vy: 0,
    ground: true,
    face: hero.face,
    hp: max,
    max,
    life,
    full: life,
    t: 0,
    bite: WICK.rise,
    lunge: 0,
    hurt: 0,
    guard: 0,
    held: 0,
    shoved: 0,
    dropping: false,
    ring: 0,
    slot: 0,
    great: 0,
    bites: 0,
    extra: !!o.extra,
    tended: game.t,
    melt: -1,
    target: null,
  };
  addWick(w);
  pool(x, floor);
  emitSkillEvent({ type: "wick", x, y: floor, lit: true, cause, wick: w });
  return w;
}

/** bring a Wick back to full HP and full life with a burst of flame */
export function relight(w: Wick): void {
  w.hp = w.max = wickMaxHp();
  w.life = w.full = Math.max(w.full, WICK.life);
  lights.add(w.x, w.y - 10, 26, PAL.wick[4], 0.8, 0.3);
  for (let i = 0; i < 10; i++)
    particles.spawn(PK.SPARK, w.x, w.y - 12, rng.range(-50, 50), -rng.range(30, 90), rng.range(0.25, 0.45), {
      col: rng.chance(0.5) ? PAL.wick[4] : PAL.wick[5],
    });
  sfx.chime(3);
  emitSkillEvent({ type: "wick", x: w.x, y: w.y, lit: true, cause: "relight", wick: w });
}

/** her Wick with the least HP and life left, which a press at the cap relights */
export function weakestWick(): Wick | null {
  const list = cappedWicks().filter(isUp);
  if (!list.length) return null;
  return list.reduce((a, b) => (b.hp / b.max + b.life / b.full < a.hp / a.max + a.life / a.full ? b : a));
}

/** a Wick of hers ends: it melts into a puddle with a curl of smoke, and her skills hear of it */
export function endWick(w: Wick, cause: WickCause): void {
  if (w.melt >= 0) return;
  w.melt = 0;
  w.hp = Math.max(0, w.hp);
  for (let i = 0; i < 5; i++)
    particles.spawn(
      PK.SMOKE,
      w.x + rng.range(-2, 2),
      w.y - rng.range(6, 12),
      rng.range(-6, 6),
      -rng.range(10, 24),
      0.8,
      {
        col: WAX[1],
        size: rng.range(1.5, 3),
      },
    );
  emitSkillEvent({ type: "wick", x: w.x, y: w.y, lit: false, cause, wick: w });
}

/** a blow or a held foe's burn lands on a Wick; its owner sees it end on her next step */
export function hurtWick(w: Wick, damage: number): void {
  if (!isUp(w)) return;
  const ringed = w.ring > 0 ? 1 - BECKON.hurt : 1;
  w.hp -= damage * ringed;
  w.hurt = WICK.hurt * 3;
  for (let i = 0; i < 3; i++)
    particles.spawn(PK.SPARK, w.x, w.y - 10, rng.range(-40, 40), -rng.range(20, 60), 0.25, { col: PAL.wick[3] });
}

/** seconds a Wick lit now lives, with Twin Wick's or Great Wick's shorter life where they say */
export const charmedLife = (seconds: number): number => withCharms("duration", seconds);
