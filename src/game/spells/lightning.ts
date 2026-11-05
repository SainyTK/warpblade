import { PAL, SPARKS } from "../../constants/palette";
import { GROUND } from "../../constants/stage";
import { ellipseRing, glow, glowLine, line, place } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { TAU } from "../../utils/math";
import { dealDamage } from "../damage";
import { createFloorRing } from "../effects/floorRing";
import { enemyCenter } from "../enemies/enemy";
import { game, lights, particles, rng } from "../state";
import { hitStop, shake, surfaceBelow } from "../world";

type Path = [number, number][];
/** seconds from the crackling mark to the strike */
export const STRIKE = 0.18;
const LIFE = 0.34;
export const SKY_FLASH = 0.16;
const ARC_REACH = 90;

export interface LightningOptions {
  damage: number;
  arcDamage: number;
  /** how many more foes it arcs to */
  arcs: number;
  shock: number;
  /** seconds before it strikes */
  delay?: number;
  /** how bright its light is, so a storm of strikes does not wash out the screen */
  glow?: number;
  /** where the bolt starts: above the top of the screen unless a cloud calls it */
  fromY?: number;
  /** false keeps the whole sky from flashing, for follow-up strikes */
  skyFlash?: boolean;
}

/** a jagged line by midpoint displacement */
function boltPath(x0: number, y0: number, x1: number, y1: number, displacement: number, depth: number): Path {
  let pts: Path = [
    [x0, y0],
    [x1, y1],
  ];
  let disp = displacement;
  for (let d = 0; d < depth; d++) {
    const next: Path = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      const L = Math.hypot(bx - ax, by - ay) || 1;
      const off = rng.range(-disp, disp);
      next.push([(ax + bx) / 2 + ((by - ay) / L) * off, (ay + by) / 2 - ((bx - ax) / L) * off], pts[i]);
    }
    pts = next;
    disp *= 0.55;
  }
  return pts;
}

function strokeBolt(pts: Path, thick: boolean, k: number): void {
  const V = PAL.volt;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    if (thick) {
      line(ax - 1, ay, bx - 1, by, V[3], k * 1.3);
      line(ax + 1, ay, bx + 1, by, V[2], k * 1.1);
    }
    line(ax, ay, bx, by, WHITE, Math.min(1, k * 1.6));
  }
  for (let i = 0; i < pts.length - 1; i += 4) {
    const j = Math.min(pts.length - 1, i + 4);
    glowLine(pts[i][0], pts[i][1], pts[j][0], pts[j][1], thick ? 12 : 6, V[2], (thick ? 0.35 : 0.2) * k);
  }
}

/** lightning on a foe or a point on the floor: a crackling mark, the strike, forks, and arcs to more foes */
export function createLightning(target: Enemy | null, point: readonly [number, number], o: LightningOptions): Effect {
  const V = PAL.volt;
  const [tx, ty] = target ? enemyCenter(target) : point;
  const ground = target ? Math.min(GROUND, surfaceBelow(tx, ty)) : ty;
  let t = -(o.delay ?? 0);
  let struck = false;
  let regen = 0;
  let path: Path = [];
  let forks: Path[] = [];
  const arcs: { x: number; y: number; pts: Path }[] = [];
  const build = () => {
    path = boltPath(tx + rng.range(-16, 16), o.fromY ?? -4, tx, ty, 16, 5);
    forks = Array.from({ length: 3 }, () => {
      const [fx, fy] = path[rng.int(6, path.length - 6)];
      return boltPath(fx, fy, fx + rng.range(-24, 24), fy + rng.range(12, 30), 7, 3);
    });
    for (const arc of arcs) arc.pts = boltPath(tx, ty, arc.x, arc.y, 10, 4);
  };
  const strike = () => {
    struck = true;
    if (o.skyFlash ?? true) game.flash = SKY_FLASH;
    const k = o.glow ?? 1;
    lights.add(tx, ty, 80, V[3], 0.55 * k, 0.45);
    lights.add(tx, ty, 18, WHITE, 0.6 * k, 0.1);
    lights.add(tx, ground, 50, V[2], 0.6 * k, 0.6);
    for (let i = 0; i < 26; i++) {
      const a = rng.range(Math.PI, TAU);
      const sp = rng.range(140, 420);
      particles.spawn(PK.SPARK, tx, ty, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.2, 0.55), {
        sparks: SPARKS.volt,
      });
    }
    for (let i = 0; i < 5; i++)
      particles.spawn(
        PK.STAR,
        tx + rng.range(-14, 14),
        ty - rng.range(0, 20),
        rng.range(-20, 20),
        rng.range(-30, 0),
        rng.range(0.4, 0.8),
        {
          col: V[3],
          size: rng.range(1.5, 3),
        },
      );
    for (let i = 0; i < 4; i++)
      particles.spawn(
        PK.SMOKE,
        tx + rng.range(-6, 6),
        ground - 2,
        rng.range(-10, 10),
        -rng.range(5, 15),
        rng.range(0.8, 1.4),
        {
          col: 0,
          size: rng.range(3, 5),
        },
      );
    game.fx.push(createFloorRing(tx, ground, 36, V, 0.4));
    if (target && target.hp > 0) {
      dealDamage(target, o.damage, { kx: 0, ky: -60, heavy: true });
      target.shock = Math.max(target.shock, o.shock);
      const near = game.enemies
        .filter((e) => e !== target && e.hp > 0)
        .map((e) => ({ e, d: Math.hypot(enemyCenter(e)[0] - tx, enemyCenter(e)[1] - ty) }))
        .filter(({ d }) => d < ARC_REACH)
        .sort((a, b) => a.d - b.d)
        .slice(0, o.arcs);
      for (const { e } of near) {
        const [cx, cy] = enemyCenter(e);
        arcs.push({ x: cx, y: cy, pts: [] });
        dealDamage(e, o.arcDamage, { ky: -40 });
        e.shock = Math.max(e.shock, o.shock * 0.8);
      }
    }
    build();
    shake(0.25, 3);
    hitStop(0.05);
    sfx.thunder();
  };
  return {
    update(dt) {
      t += dt;
      if (t < 0) return true;
      if (t < STRIKE && rng.chance(0.4))
        particles.spawn(
          PK.SPARK,
          tx + rng.range(-6, 6),
          ty + rng.range(-6, 6),
          rng.range(-60, 60),
          rng.range(-90, 0),
          rng.range(0.08, 0.16),
          {
            sparks: SPARKS.volt,
          },
        );
      if (!struck && t >= STRIKE) strike();
      regen -= dt;
      if (struck && regen <= 0) {
        regen = 0.045;
        build();
      }
      return t < STRIKE + LIFE;
    },
    draw() {
      if (t < 0) return;
      place();
      if (t < STRIKE) {
        const k = t / STRIKE;
        ellipseRing(tx, ground, 10 - k * 6, (10 - k * 6) * 0.3, V[3], 0.8);
        glow(tx, ground, 24, V[2], 0.3 * k);
        return;
      }
      const k = 1 - (t - STRIKE) / LIFE;
      strokeBolt(path, k > 0.5, k);
      for (const f of forks) strokeBolt(f, false, k);
      for (const arc of arcs) strokeBolt(arc.pts, false, k);
    },
  };
}
