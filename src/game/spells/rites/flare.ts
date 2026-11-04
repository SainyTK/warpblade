import { RITE_RAMP, RITE_SPARKS } from "../../../constants/ysra/emberLook";
import { FLARE } from "../../../constants/ysra/rites";
import { circle, glow, line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { ease, TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { enemyCenter } from "../../enemies/enemy";
import { game, lights, particles, progress, rng } from "../../state";
import { hitStop, shake } from "../../world";
import { riteSound } from "./riteSound";

const LIFE = 0.55;
const TONGUES = 16;
/** seconds the ring takes to run out to its radius */
const SPREAD = 0.22;

/** every foe standing within the ring, thrown away from her and set alight */
function strikeRing(x: number, y: number): number {
  let hits = 0;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.abs(ex - x) > FLARE.radius || ey < y - FLARE.radius || ey > y + 6) continue;
    const dir = Math.sign(ex - x) || 1;
    dealDamage(e, progress.stats.ap * FLARE.power, { fromX: x, kx: dir * FLARE.kx, ky: FLARE.ky, heavy: true });
    e.burn = Math.max(e.burn, FLARE.burn);
    hits++;
  }
  return hits;
}

function sparksOut(x: number, y: number): void {
  for (let i = 0; i < 26; i++) {
    const a = rng.range(Math.PI * 1.02, Math.PI * 1.98);
    const sp = rng.range(120, 300);
    particles.spawn(PK.SPARK, x, y - 4, Math.cos(a) * sp, Math.sin(a) * sp * 0.7, rng.range(0.2, 0.5), {
      sparks: RITE_SPARKS,
    });
  }
  for (let i = 0; i < 14; i++)
    particles.spawn(
      PK.EMBER,
      x + rng.range(-FLARE.radius, FLARE.radius),
      y - rng.range(0, 6),
      rng.range(-20, 20),
      -rng.range(30, 80),
      rng.range(0.7, 1.4),
      { sparks: RITE_SPARKS, delay: rng.range(0, 0.25) },
    );
}

/** Flare: fire bursts out of the floor in a ring around her feet and throws every foe in it back */
export function castFlare(x: number, y: number): Effect {
  const hits = strikeRing(x, y);
  sparksOut(x, y);
  game.fx.push(createFloorRing(x, y, FLARE.radius * 1.15, [...RITE_RAMP].reverse(), 0.45, 0.3));
  lights.add(x, y - 10, 80, RITE_RAMP[4], 1, 0.5);
  lights.add(x, y - 10, 24, WHITE, 0.8, 0.1);
  shake(0.22, 2.5);
  if (hits) hitStop(0.06);
  riteSound(FLARE.pitch);
  const heights = Array.from({ length: TONGUES }, () => rng.range(0.6, 1));
  const tilt = Array.from({ length: TONGUES }, () => rng.range(-2, 2));
  let t = 0;
  /** one tongue of the ring: a column of flame leaning outward, hotter toward its tip; back ones behind the bodies */
  const tongues = (front: boolean) => {
    place();
    const spread = ease.outCubic(Math.min(1, t / SPREAD));
    const r = FLARE.radius * spread;
    const life = Math.sin(Math.PI * Math.min(1, t / LIFE));
    for (let i = 0; i < TONGUES; i++) {
      const a = (i / TONGUES) * TAU + 0.2;
      if (Math.sin(a) > 0 !== front) continue;
      const bx = x + Math.cos(a) * r;
      const by = y + Math.sin(a) * r * 0.3;
      const h = 15 * heights[i] * life;
      if (h < 1) continue;
      const lean = Math.cos(a) * 3 + tilt[i] * life;
      line(bx, by, bx + lean, by - h, (u) => RITE_RAMP[u < 0.3 ? 3 : u < 0.75 ? 4 : 5]);
      line(bx + 1, by, bx + 1 + lean * 0.8, by - h * 0.6, RITE_RAMP[2]);
      if (t < LIFE * 0.4) px(bx + lean, by - h, WHITE);
      glow(bx, by - h * 0.5, 6, RITE_RAMP[4], 0.25 * life);
    }
  };
  return {
    update(dt) {
      t += dt;
      return t < LIFE;
    },
    drawBack: () => tongues(false),
    draw() {
      tongues(true);
      if (t < 0.08) {
        place();
        circle(x, y - 10, 6 + (t / 0.08) * 10, t < 0.04 ? WHITE : RITE_RAMP[5]);
      }
    },
  };
}
