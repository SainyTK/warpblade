import { RITE_RAMP, RITE_SPARKS } from "../../../constants/ysra/emberLook";
import { FLAME_PILLAR as P } from "../../../constants/ysra/rites";
import { fleck, glow, glowLine, hairline, place, shade } from "../../../engine/frame";
import type { SourceId } from "../../../types/build";
import type { Effect } from "../../../types/effect";
import { PF, PK } from "../../../types/particle";
import type { Box } from "../../../types/world";
import type { PillarShape } from "../../../types/ysra/pyre";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { fineRing } from "../../effects/fine";
import { createFloorRing } from "../../effects/floorRing";
import { enemyBox } from "../../enemies/enemy";
import { drawTongue } from "../../hero/ysra/art/flame";
import { game, lights, particles, progress, rng } from "../../state";
import { boxHit, dust, hitStop, shake } from "../../world";
import { riteSound } from "./riteSound";

/** seconds the pillar takes to shoot up to its full height */
const RISE = 0.07;
/** seconds of smoke and embers after it falls */
const TAIL = 0.2;

/** the pillar's colour across its width: white hot at the core while young, cooling toward the rim */
function columnColor(d: number, young: boolean): number {
  if (d < 0.25) return young ? WHITE : RITE_RAMP[5];
  if (d < 0.55) return RITE_RAMP[4];
  if (d < 0.85) return RITE_RAMP[3];
  return RITE_RAMP[2];
}

/** seconds between the burning column's ticks */
const COLUMN_TICK = 0.25;
/** how fast the sigil draws foes toward it */
const PULL_SPEED = 90;

const areaOf = (x: number, floor: number, shape: PillarShape): Box => [
  x - shape.halfWidth - 3,
  floor - shape.height,
  x + shape.halfWidth + 3,
  floor,
];

function erupt(x: number, floor: number, shape: PillarShape, source: SourceId): void {
  const area = areaOf(x, floor, shape);
  let hits = 0;
  for (const e of game.enemies) {
    if (e.hp <= 0 || !boxHit(area, enemyBox(e))) continue;
    dealDamage(e, progress.stats.ap * shape.power, {
      fromX: x,
      launch: shape.launch,
      ky: -200,
      heavy: true,
      source,
    });
    e.burn = Math.max(e.burn, P.burn);
    hits++;
  }
  for (let i = 0; i < 22; i++)
    particles.spawn(
      PK.SPARK,
      x + rng.range(-4, 4),
      floor - rng.range(0, 20),
      rng.range(-60, 60),
      -rng.range(200, 420),
      rng.range(0.3, 0.6),
      {
        sparks: RITE_SPARKS,
      },
    );
  dust(x, floor, 10);
  game.fx.push(createFloorRing(x, floor, 22, [...RITE_RAMP].reverse(), 0.35, 0.3));
  lights.add(x, floor - 30, 46, RITE_RAMP[4], 0.4, 0.5);
  shake(shape.shake, shape.amp);
  if (hits) hitStop(shape.hitStop);
  riteSound(P.pitch);
}

/** the standing column burns the foes falling through it */
function burnColumn(x: number, floor: number, shape: PillarShape, source: SourceId): void {
  const area = areaOf(x, floor, shape);
  for (const e of game.enemies)
    if (e.hp > 0 && boxHit(area, enemyBox(e)))
      dealDamage(e, progress.stats.ap * (shape.column ?? 0), { dot: true, source });
}

/** the glowing sigil draws the foes near it in */
function drawIn(x: number, reach: number): void {
  for (const e of game.enemies) {
    const d = e.x - x;
    if (e.hp > 0 && Math.abs(d) < reach && Math.abs(d) > 2) e.vx = -Math.sign(d) * PULL_SPEED;
  }
}

/**
 * Flame Pillar: a sigil glows on the floor, then a column of fire bursts out of it and throws the foes on it up.
 * `shape` sets its size and strength; the base pillar is the default, so Pyre Colonnade's pillars and a skill's
 * eruptions share this one function. `source` is what its hits count for.
 */
export function castFlamePillar(
  x: number,
  floor: number,
  shape: PillarShape = P,
  source: SourceId = "abilities",
): Effect {
  let t = 0;
  let out = false;
  let tick = 0;
  const sigil = () => {
    place();
    const u = t / shape.warn;
    const r = (4 + u * 8) * shape.sigil;
    if (shape.ring) fineRing(x, floor, r * 1.4, r * 1.4 * 0.28, RITE_RAMP[5], 0.4 + u * 0.6);
    fineRing(x, floor, r, r * 0.28, RITE_RAMP[4], 0.6 + u * 0.4);
    fineRing(x, floor, r - 0.5, (r - 0.5) * 0.28, RITE_RAMP[3], 0.6 + u * 0.4);
    fineRing(x, floor, r * 0.55, r * 0.55 * 0.28, RITE_RAMP[4], u);
    // four runes turning on the ring, each a spoke of light toward the middle that grows as the pillar nears
    for (let i = 0; i < 4; i++) {
      const a = t * 9 + (i / 4) * TAU;
      const rx = x + Math.cos(a) * r;
      const ry = floor + Math.sin(a) * r * 0.28;
      hairline(
        rx,
        ry,
        x + Math.cos(a) * r * (1 - 0.45 * u),
        floor + Math.sin(a) * r * 0.28 * (1 - 0.45 * u),
        RITE_RAMP[4],
      );
      fleck(rx, ry, WHITE);
      hairline(rx, ry, rx, ry - 2 - u * 3, RITE_RAMP[5], (v) => 1 - v);
    }
    glow(x, floor - 2, (10 + u * 8) * shape.sigil, RITE_RAMP[4], 0.3 + u * 0.3);
  };
  const column = () => {
    place();
    const s = t - shape.warn;
    const u = s / shape.stand;
    const top = floor - shape.height * Math.min(1, s / RISE);
    const thin = u < 0.7 ? 1 : Math.max(0, 1 - (u - 0.7) / 0.3);
    const young = u < 0.35;
    // the column, image pixel row by row: its edges waver more toward the top and carry a darker ragged rim
    shade(x - shape.halfWidth - 2, top, x + shape.halfWidth + 2, floor, (px, py, o) => {
      const along = (py - top) / Math.max(1, floor - top);
      const hw = shape.halfWidth * thin * (0.45 + 0.55 * along);
      const wobble = Math.sin(py * 0.45 + t * 38) * 1.2 * (1 - along);
      const d = Math.abs(px - x - wobble) / Math.max(1, hw);
      const ragged = 1 - 0.18 * grain(Math.floor(py * 2 - t * 90), px > x ? 1 : 2);
      if (d > ragged) return;
      o.c = columnColor(d, young);
    });
    // tongues licking off the top
    for (let i = 0; i < 4; i++) {
      const tx = x + Math.sin(t * 30 + i * 2.1) * shape.halfWidth * thin * 0.6;
      const h = (3 + ((i * 7 + Math.floor(t * 30)) % 5)) * thin;
      drawTongue(tx, top + 1, h + 1, Math.sin(t * 22 + i) * 1.5, RITE_RAMP);
    }
    glowLine(x, floor, x, top, 12 * thin + 2, RITE_RAMP[4], 0.3 * thin);
  };
  return {
    update(dt) {
      t += dt;
      if (!out && shape.pull) drawIn(x, shape.pull);
      if (!out && t >= shape.warn) {
        out = true;
        erupt(x, floor, shape, source);
      }
      tick -= dt;
      if (out && shape.column && tick <= 0 && t < shape.warn + shape.stand) {
        tick = COLUMN_TICK;
        burnColumn(x, floor, shape, source);
      }
      if (out && t < shape.warn + shape.stand && rng.chance(0.7))
        particles.spawn(
          PK.FIRE,
          x + rng.range(-shape.halfWidth, shape.halfWidth) * 0.6,
          floor - rng.range(10, shape.height),
          rng.range(-15, 15),
          -rng.range(40, 90),
          rng.range(0.2, 0.4),
          { col: 0, size: rng.range(1.2, 2.2), flag: rng.chance(0.4) ? PF.SMOKES : 0 },
        );
      return t < shape.warn + shape.stand + TAIL;
    },
    draw() {
      if (t < shape.warn) sigil();
      else if (t < shape.warn + shape.stand) column();
    },
  };
}
