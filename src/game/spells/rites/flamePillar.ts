import { RITE_RAMP, RITE_SPARKS } from "../../../constants/ysra/emberLook";
import { FLAME_PILLAR as P } from "../../../constants/ysra/rites";
import { ellipseRing, glow, glowLine, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PF, PK } from "../../../types/particle";
import type { Box } from "../../../types/world";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { enemyBox } from "../../enemies/enemy";
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

function erupt(x: number, floor: number): void {
  const area: Box = [x - P.halfWidth - 3, floor - P.height, x + P.halfWidth + 3, floor];
  let hits = 0;
  for (const e of game.enemies) {
    if (e.hp <= 0 || !boxHit(area, enemyBox(e))) continue;
    dealDamage(e, progress.stats.ap * P.power, { fromX: x, launch: P.launch, ky: -200, heavy: true });
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
  lights.add(x, floor - 30, 50, RITE_RAMP[4], 0.7, 0.5);
  shake(0.25, 3);
  if (hits) hitStop(0.07);
  riteSound(P.pitch);
}

/** Flame Pillar: a sigil glows on the floor, then a column of fire bursts out of it and throws the foes on it up */
export function castFlamePillar(x: number, floor: number): Effect {
  let t = 0;
  let out = false;
  const sigil = () => {
    place();
    const u = t / P.warn;
    const r = 4 + u * 8;
    ellipseRing(x, floor, r, r * 0.28, RITE_RAMP[3], 0.6 + u * 0.4);
    ellipseRing(x, floor, r * 0.55, r * 0.55 * 0.28, RITE_RAMP[4], u);
    for (let i = 0; i < 4; i++) {
      const a = t * 9 + (i / 4) * TAU;
      px(x + Math.cos(a) * r, floor + Math.sin(a) * r * 0.28, RITE_RAMP[5]);
    }
    glow(x, floor - 2, 10 + u * 8, RITE_RAMP[4], 0.3 + u * 0.3);
  };
  const column = () => {
    place();
    const s = t - P.warn;
    const u = s / P.stand;
    const top = floor - P.height * Math.min(1, s / RISE);
    const thin = u < 0.7 ? 1 : Math.max(0, 1 - (u - 0.7) / 0.3);
    const young = u < 0.35;
    for (let y = Math.ceil(top); y <= floor; y++) {
      const along = (y - top) / Math.max(1, floor - top);
      const hw = P.halfWidth * thin * (0.45 + 0.55 * along);
      const wobble = Math.sin(y * 0.45 + t * 38) * 1.2 * (1 - along);
      for (let dx = -hw; dx <= hw; dx++) px(x + dx + wobble, y, columnColor(Math.abs(dx) / Math.max(1, hw), young));
    }
    // tongues licking off the top
    for (let i = 0; i < 4; i++) {
      const tx = x + Math.sin(t * 30 + i * 2.1) * P.halfWidth * thin * 0.6;
      const h = (3 + ((i * 7 + Math.floor(t * 30)) % 5)) * thin;
      for (let d = 0; d < h; d++) px(tx, top - d, d < h * 0.5 ? RITE_RAMP[4] : RITE_RAMP[5]);
    }
    glowLine(x, floor, x, top, 12 * thin + 2, RITE_RAMP[4], 0.3 * thin);
  };
  return {
    update(dt) {
      t += dt;
      if (!out && t >= P.warn) {
        out = true;
        erupt(x, floor);
      }
      if (out && t < P.warn + P.stand && rng.chance(0.7))
        particles.spawn(
          PK.FIRE,
          x + rng.range(-P.halfWidth, P.halfWidth) * 0.6,
          floor - rng.range(10, P.height),
          rng.range(-15, 15),
          -rng.range(40, 90),
          rng.range(0.2, 0.4),
          { col: 0, size: rng.range(1.2, 2.2), flag: rng.chance(0.4) ? PF.SMOKES : 0 },
        );
      return t < P.warn + P.stand + TAIL;
    },
    draw() {
      if (t < P.warn) sigil();
      else if (t < P.warn + P.stand) column();
    },
  };
}
