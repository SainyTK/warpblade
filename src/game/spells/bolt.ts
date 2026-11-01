import { PAL, SPARKS } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { ellipseRing, glow, glowLine, line, place } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { clamp, TAU } from "../../utils/math";
import { damageEnemy } from "../combat";
import { createFloorRing } from "../effects/floorRing";
import { enemyCenter } from "../enemies/enemy";
import { game, lights, particles, rng } from "../state";
import { hitStop, shake, surfaceBelow } from "../world";

type Path = [number, number][];
const STRIKE = 0.18;
const LIFE = 0.34;
export const SKY_FLASH = 0.16;

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

/** lightning on the nearest foe in front: a crackling mark, the strike, forks, an arc to one more foe */
export function castBolt(x: number, y: number, face: number): Effect {
  const V = PAL.volt;
  const ahead = game.enemies
    .filter((e) => (enemyCenter(e)[0] - x) * face > -6 && Math.abs(enemyCenter(e)[0] - x) < 190)
    .sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x));
  const target = ahead[0];
  const markX = clamp(x + face * 80, 10, W - 10);
  const [tx, ty] = target ? enemyCenter(target) : [markX, surfaceBelow(markX, y)];
  const ground = target ? Math.min(GROUND, surfaceBelow(tx, ty)) : ty;
  let t = 0;
  let struck = false;
  let regen = 0;
  let path: Path = [];
  let forks: Path[] = [];
  let arc: { x: number; y: number; pts: Path } | null = null;
  const build = () => {
    path = boltPath(tx + rng.range(-16, 16), -4, tx, ty, 16, 5);
    forks = Array.from({ length: 3 }, () => {
      const [fx, fy] = path[rng.int(6, path.length - 6)];
      return boltPath(fx, fy, fx + rng.range(-24, 24), fy + rng.range(12, 30), 7, 3);
    });
    if (arc) arc.pts = boltPath(tx, ty, arc.x, arc.y, 10, 4);
  };
  const strike = () => {
    struck = true;
    game.flash = SKY_FLASH;
    lights.add(tx, ty, 80, V[3], 0.55, 0.45);
    lights.add(tx, ty, 18, WHITE, 0.6, 0.1);
    lights.add(tx, ground, 50, V[2], 0.6, 0.6);
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
        { col: 0, size: rng.range(3, 5) },
      );
    game.fx.push(createFloorRing(tx, ground, 36, V, 0.4));
    if (target) {
      damageEnemy(target, 40, face * 80, -60);
      target.shock = 1;
      const next = game.enemies
        .filter((e) => e !== target && e.hp > 0)
        .map((e) => ({ e, d: Math.hypot(enemyCenter(e)[0] - tx, enemyCenter(e)[1] - ty) }))
        .filter(({ d }) => d < 90)
        .sort((a, b) => a.d - b.d)[0];
      if (next) {
        const [cx, cy] = enemyCenter(next.e);
        arc = { x: cx, y: cy, pts: [] };
        damageEnemy(next.e, 20, 0, -40);
        next.e.shock = 0.8;
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
      if (t < STRIKE && rng.chance(0.4))
        particles.spawn(
          PK.SPARK,
          tx + rng.range(-6, 6),
          ty + rng.range(-6, 6),
          rng.range(-60, 60),
          rng.range(-90, 0),
          rng.range(0.08, 0.16),
          { sparks: SPARKS.volt },
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
      if (arc) strokeBolt(arc.pts, false, k);
    },
  };
}
