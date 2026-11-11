import { BURST_CRYSTALS } from "../../constants/kael/crystalLook";
import { PAL, SPARKS } from "../../constants/palette";
import { BURST } from "../../constants/spells";
import { sfx } from "../../services/audio";
import { PK } from "../../types/particle";
import { TAU } from "../../utils/math";
import { dealDamage } from "../damage";
import { createFloorRing } from "../effects/floorRing";
import { createImpact } from "../effects/impact";
import { enemyCenter } from "../enemies/enemy";
import { createCrystalRow } from "../hero/kael/art/crystalRow";
import { game, hero, lights, particles, progress, rng } from "../state";
import { shake, surfaceBelow } from "../world";

/** Crystal Burst: a ring of crystal bursts out around Kael and pushes every foe in reach away from him */
export function castBurst(power: number): void {
  const x = hero.x;
  const y = hero.y - 16;
  game.fx.push(createFloorRing(x, hero.y, BURST.reach, PAL.crystal, 0.35));
  game.fx.push(createFloorRing(x, y, BURST.reach * 0.8, PAL.crystal, 0.3, 0.9));
  game.fx.push(
    createCrystalRow(x, surfaceBelow(x, hero.y), PAL.crystal, { ...BURST_CRYSTALS, reach: BURST.reach, grow: 0.12 }),
  );
  lights.add(x, y, 40, PAL.crystal[4], 0.5, 0.3);
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * TAU + rng.range(-0.15, 0.15);
    const sp = rng.range(120, 200);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * sp, Math.sin(a) * sp * 0.6, rng.range(0.25, 0.45), {
      col: rng.pick(PAL.crystal.slice(3)),
      size: rng.range(1, 2.2),
    });
  }
  const damage = progress.stats.ap * BURST.power * power;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.hypot(ex - x, (ey - y) * 1.4) > BURST.reach) continue;
    const dir = Math.sign(ex - x) || hero.face;
    dealDamage(e, damage, { fromX: x, kx: dir * BURST.push, ky: -80, heavy: true, source: "abilities" });
    game.fx.push(createImpact(ex, ey, dir, false, SPARKS.crystal));
  }
  shake(0.12, 1.5);
  sfx.shatter();
}
