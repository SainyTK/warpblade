import { NOVA_CRYSTALS, NOVA_RING } from "../../../constants/kael/crystalLook";
import { NOVA_KNOCK, NOVA_TIME } from "../../../constants/kael/nova";
import { PAL } from "../../../constants/palette";
import { glow, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { scale, WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { ease, TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { fineRing } from "../../effects/fine";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { createCrystalRow } from "../../hero/kael/art/crystalRow";
import { game, hero, particles, rng } from "../../state";
import { surfaceBelow } from "../../world";

const C = PAL.crystal;

/** one nova ring: where it bursts, how far it runs, its blow on each foe, the charge level, and whether it draws foes in */
export interface NovaRing {
  x: number;
  y: number;
  reach: number;
  damage: number;
  level: number;
  pull: boolean;
  /** seconds before it bursts */
  delay: number;
  /** every foe the ring struck, once it has faded */
  done?(struck: readonly Enemy[]): void;
}

/** shards thrown out as the ring bursts, more at higher charge */
function burstShards(x: number, y: number, level: number): void {
  for (let i = 0; i < 20 + level * 10; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(80, 140 + level * 50);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * sp, Math.sin(a) * sp * 0.6, rng.range(0.4, 0.8), {
      col: rng.pick(C.slice(3)),
      size: rng.range(1, 2.5),
    });
  }
}

/** a ring of crystal bursts out from (x, y) and strikes each foe it reaches once: thrown out and up, or drawn in to
 *  Kael and up */
export function createNovaRing(o: NovaRing): Effect {
  const struck: Enemy[] = [];
  let t = -o.delay;
  let burst = false;
  const end = NOVA_TIME.grow + NOVA_TIME.fade;
  /** one half of the ring: a white front, bands cooling behind it and a wake of dashes; the far half is dimmer */
  const ring = (half: number) => {
    if (t < 0) return;
    place();
    const u = Math.min(1, t / NOVA_TIME.grow);
    const r = o.reach * ease.outCubic(u);
    const k = (1 - Math.max(0, (t - NOVA_TIME.grow) / NOVA_TIME.fade)) * (half > 0 ? 1 : NOVA_RING.farStrength);
    const sy = NOVA_RING.squash;
    fineRing(o.x, o.y, r, r * sy, WHITE, k * 1.6, half);
    NOVA_RING.bands.forEach((d, i) => {
      fineRing(o.x, o.y, r - d, (r - d) * sy, C[5 - i], k * (1.4 - i * 0.3), half);
    });
    NOVA_RING.wake.forEach((d, i) => {
      // the wake breaks into dashes that drift round the ring
      const dashed = grain(Math.floor(t * 30), i) * 0.3 + 0.35;
      fineRing(o.x, o.y, r - d, (r - d) * sy, scale(C[3], 1 - i * 0.3), k * dashed, half);
    });
    if (half > 0) glow(o.x, o.y, 30 + o.level * 10, C[3], 0.5 * (1 - u));
  };
  const start = () => {
    burst = true;
    burstShards(o.x, o.y, o.level);
    game.fx.push(
      createCrystalRow(o.x, surfaceBelow(o.x, o.y), C, {
        ...NOVA_CRYSTALS[o.level - 1],
        reach: Math.min(o.reach, 170),
        grow: NOVA_TIME.grow,
      }),
    );
  };
  return {
    update(dt) {
      t += dt;
      if (t < 0) return true;
      if (!burst) start();
      const r = o.reach * ease.outCubic(Math.min(1, t / NOVA_TIME.grow));
      for (const e of game.enemies) {
        if (struck.includes(e) || e.hp <= 0) continue;
        const [cx, cy] = enemyCenter(e);
        if (Math.hypot(cx - o.x, (cy - o.y) * 1.6) > r) continue;
        struck.push(e);
        const dir = Math.sign(cx - o.x) || hero.face;
        const kx = dir * (o.pull ? NOVA_KNOCK.pull : NOVA_KNOCK.out);
        dealDamage(e, o.damage, { fromX: o.x, kx, launch: NOVA_KNOCK.launch, heavy: true, source: "ultimate" });
        game.fx.push(createImpact(cx, cy, dir, o.level >= 3));
      }
      if (t < end) return true;
      o.done?.(struck);
      return false;
    },
    drawBack: () => ring(-1),
    draw: () => ring(1),
  };
}
