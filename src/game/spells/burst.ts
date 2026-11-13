import { BURST_CRYSTALS } from "../../constants/kael/crystalLook";
import { PAL, SPARKS } from "../../constants/palette";
import { BURST, WIDE_BURST } from "../../constants/spells";
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

/** Crystal Burst: a ring of crystal bursts out around Kael and pushes every foe in reach away from him; held, a ring
 *  twice as wide that pulls every foe in it to him */
export function castBurst(power: number, wide: boolean): void {
  const x = hero.x;
  const y = hero.y - 16;
  const reach = BURST.reach * (wide ? WIDE_BURST.reach : 1);
  game.fx.push(createFloorRing(x, hero.y, reach, PAL.crystal, 0.35));
  game.fx.push(createFloorRing(x, y, reach * 0.8, PAL.crystal, 0.3, 0.9));
  if (wide) game.fx.push(createFloorRing(x, hero.y, reach * 0.55, PAL.crystal, 0.45, 0.6));
  game.fx.push(createCrystalRow(x, surfaceBelow(x, hero.y), PAL.crystal, { ...BURST_CRYSTALS, reach, grow: 0.12 }));
  lights.add(x, y, reach, PAL.crystal[4], 0.5, 0.3);
  const shards = wide ? 30 : 18;
  for (let i = 0; i < shards; i++) {
    const a = (i / shards) * TAU + rng.range(-0.15, 0.15);
    // held, the shards are drawn back in toward Kael
    const sp = rng.range(120, 200) * (wide ? -0.6 : 1);
    const from = wide ? reach * 0.9 : 0;
    particles.spawn(
      PK.SHARD,
      x + Math.cos(a) * from,
      y + Math.sin(a) * from * 0.6,
      Math.cos(a) * sp,
      Math.sin(a) * sp * 0.6,
      rng.range(0.25, 0.45),
      { col: rng.pick(PAL.crystal.slice(3)), size: rng.range(1, 2.2) },
    );
  }
  const damage = progress.stats.ap * BURST.power * power;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.hypot(ex - x, (ey - y) * 1.4) > reach) continue;
    const dir = Math.sign(ex - x) || hero.face;
    // held, each foe is pulled harder the farther out it stands, so it lands near Kael and not past him
    const kx = wide ? ((x - ex) / reach) * WIDE_BURST.pull : dir * BURST.push;
    dealDamage(e, damage, { fromX: x, kx, ky: -80, heavy: true, source: "abilities" });
    game.fx.push(createImpact(ex, ey, dir, false, SPARKS.crystal));
  }
  shake(wide ? 0.18 : 0.12, wide ? 2 : 1.5);
  sfx.shatter();
}
