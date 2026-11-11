import { NOVA_CRYSTALS, NOVA_RING } from "../../constants/kael/crystalLook";
import { PAL } from "../../constants/palette";
import { ULT_LEVELS } from "../../constants/ultimate";
import { glow, place } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { scale, WHITE } from "../../utils/color";
import { grain } from "../../utils/grain";
import { ease, TAU } from "../../utils/math";
import { dealDamage } from "../damage";
import { fineRing } from "../effects/fine";
import { createImpact } from "../effects/impact";
import { enemyCenter } from "../enemies/enemy";
import { createCrystalRow } from "../hero/kael/art/crystalRow";
import { game, hero, particles, progress, rng } from "../state";
import { surfaceBelow } from "../world";

/** how far the ring runs at each level; level 4 crosses the whole screen */
const RADIUS = [60, 100, 150, 340] as const;
/** the special is the weakest ultimate: this share of a level's power */
const SHARE = 0.75;
const GROW = 0.4;
const C = PAL.crystal;

/** Crystal Nova, Kael's special from the start: a ring of crystal bursts out around him and throws foes up */
export function castCrystalNova(level: number): void {
  const x = hero.x;
  const y = hero.y - 16;
  const reach = RADIUS[level - 1];
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad * SHARE;
  const struck = new Set<Enemy>();
  let t = 0;
  for (let i = 0; i < 20 + level * 10; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(80, 140 + level * 50);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * sp, Math.sin(a) * sp * 0.6, rng.range(0.4, 0.8), {
      col: rng.pick(PAL.crystal.slice(3)),
      size: rng.range(1, 2.5),
    });
  }
  /** one half of the ring: a white front, bands cooling behind it and a wake of dashes; the far half is dimmer */
  const ring = (half: number) => {
    place();
    const u = Math.min(1, t / GROW);
    const r = reach * ease.outCubic(u);
    const k = (1 - Math.max(0, (t - GROW) / 0.25)) * (half > 0 ? 1 : NOVA_RING.farStrength);
    const sy = NOVA_RING.squash;
    fineRing(x, y, r, r * sy, WHITE, k * 1.6, half);
    NOVA_RING.bands.forEach((d, i) => {
      fineRing(x, y, r - d, (r - d) * sy, C[5 - i], k * (1.4 - i * 0.3), half);
    });
    NOVA_RING.wake.forEach((d, i) => {
      // the wake breaks into dashes that drift round the ring
      const dashed = grain(Math.floor(t * 30), i) * 0.3 + 0.35;
      fineRing(x, y, r - d, (r - d) * sy, scale(C[3], 1 - i * 0.3), k * dashed, half);
    });
    if (half > 0) glow(x, y, 30 + level * 10, C[3], 0.5 * (1 - u));
  };
  game.fx.push(
    createCrystalRow(x, surfaceBelow(x, y), C, {
      ...NOVA_CRYSTALS[level - 1],
      reach: Math.min(reach, 170),
      grow: GROW,
    }),
  );
  const effect: Effect = {
    update(dt) {
      t += dt;
      const r = reach * ease.outCubic(Math.min(1, t / GROW));
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0) continue;
        const [cx, cy] = enemyCenter(e);
        if (Math.hypot(cx - x, (cy - y) * 1.6) > r) continue;
        struck.add(e);
        const dir = Math.sign(cx - x) || hero.face;
        dealDamage(e, damage, { fromX: x, kx: dir * 140, launch: -170, heavy: true, source: "ultimate" });
        game.fx.push(createImpact(cx, cy, dir, level >= 3));
      }
      return t < GROW + 0.25;
    },
    drawBack: () => ring(-1),
    draw: () => ring(1),
  };
  game.fx.push(effect);
}
