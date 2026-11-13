import { HEAVY_BOLT } from "../../../constants/sable/bolt";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle, WarpTune } from "../../../types/moveset";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { createCrossbowBolt } from "../../effects/crossbowBolt";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, particles, progress, rng } from "../../state";
import { foesOnSegment } from "../../ultimates/segmentHits";
import { hitStop, shake } from "../../world";
import { skin } from "../skin";
import { muzzle } from "./aim";
import { createBoltWake } from "./effects/boltWake";
import { drawGrappleBolt } from "./effects/grapple";
import { jadeLight } from "./effects/jadeLight";
import { loadBolts } from "./quiver";

/** Longshot also reaches the warp: long zips hit harder, and two warps in a row at its seventh level */
function tune(): WarpTune {
  const v = skillValues("s_longshot");
  return { strike: v.strike, perPx: v.perPx, cap: v.cap, charges: v.charges };
}

/** the heavy bolt strikes a foe in its line: the warp's power, a long push and a stagger */
function heavyHit(e: Enemy, damage: number, dir: number, sureCrit: boolean): void {
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, damage, {
    fromX: cx - dir * 10,
    kx: dir * HEAVY_BOLT.kx,
    ky: HEAVY_BOLT.ky,
    heavy: true,
    stagger: HEAVY_BOLT.stagger,
    sureCrit,
  });
  hero.lastHit = e;
  game.fx.push(createImpact(cx - dir * 3, cy, dir, true));
  jadeLight(cx, cy, "primedHit");
  hitStop(0.06);
  shake(0.14, 2);
  sfx.hit(true, 0.85);
  emitSkillEvent({ type: "warpBolt", foe: e });
}

/** smoke and a flash at the muzzle, and the recoil slides her back */
function recoil(x: number, y: number, angle: number): void {
  jadeLight(x, y, "primedMuzzle");
  for (let i = 0; i < 5; i++)
    particles.spawn(PK.SMOKE, x, y, Math.cos(angle) * rng.range(10, 40), -rng.range(4, 16), rng.range(0.3, 0.5), {
      size: rng.range(1, 1.5),
    });
  hero.vx = -hero.face * HEAVY_BOLT.recoil;
  sfx.swing(0.9);
}

/**
 * The arrival: a heavy bolt at the foe she zipped away from, through every foe in its line, each taking the warp's
 * power. A foe pressed up against her is struck between her chest and the muzzle.
 */
function strike(power: number, foe: Enemy | null, sureCrit: boolean): void {
  const m = muzzle("level");
  const [tx, ty] = foe ? enemyCenter(foe) : [m.x + hero.face * 10, m.y];
  const angle = Math.atan2(ty - m.y, tx - m.x);
  const dir = Math.cos(angle) >= 0 ? 1 : -1;
  const damage = power * progress.stats.ad;
  const struck = new Set<Enemy>();
  const pass = (ax: number, ay: number, bx: number, by: number): boolean => {
    for (const e of foesOnSegment(ax, ay, bx, by, struck)) {
      struck.add(e);
      heavyHit(e, damage, dir, sureCrit);
    }
    return false;
  };
  pass(hero.x, m.y, m.x, m.y);
  const flight = { x: m.x, y: m.y, angle, speed: HEAVY_BOLT.speed, range: HEAVY_BOLT.range, ramp: skin.ramp };
  game.fx.push(createBoltWake(flight));
  game.fx.push(createCrossbowBolt({ ...flight, primed: true, heavy: true, bounces: 0, pass }));
  recoil(m.x, m.y, angle);
}

/** her extra: the zip cranks one bolt into the quiver */
function arrived(): void {
  loadBolts(1);
}

/** Sable's warp: a grapple bolt fired away from the nearest foe, a zip along its cord, and a heavy bolt back at the foe */
export const SABLE_WARP: WarpStyle = {
  ranged: true,
  drawThrown: drawGrappleBolt,
  strike,
  arrived,
  tune,
};
