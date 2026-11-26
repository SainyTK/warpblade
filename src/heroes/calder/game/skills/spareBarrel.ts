import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { hex } from "../../../../utils/color";
import { PHOSPHOR } from "../../constants/colors";
import { createMuzzleFlash } from "../effects/muzzleFlash";
import { createTracerLine } from "../effects/tracerLine";

const ID = "ca_turret";
/** how far a barrel sees, how high its muzzle sits, and how far behind Calder it is planted */
const BARREL = { range: 170, muzzle: 9, behind: 10, pierce: 4, pierceShare: 0.25 } as const;
const STEEL = hex("#686f74");
const DARK = hex("#2a2f33");

interface Barrel {
  x: number;
  y: number;
  left: number;
  next: number;
  face: number;
}
interface BarrelMemory {
  cd: number;
  barrels: Barrel[];
}
const memoryOf = (m: SkillMemory): BarrelMemory => m as unknown as BarrelMemory;

/** plant a barrel behind Calder, when the chance and the cooldown allow */
function plant(m: BarrelMemory): void {
  const v = skillValues(ID);
  if (m.cd > 0 || !rng.chance(v.chance)) return;
  m.cd = v.cooldown;
  const x = hero.x - hero.face * BARREL.behind;
  m.barrels.push({
    x,
    y: surfaceBelow(x, hero.y - 4),
    left: withBuild("duration", v.life),
    next: 0.15,
    face: hero.face,
  });
  while (m.barrels.length > withBuild("amount", v.most)) m.barrels.shift();
}

/** one shot of a barrel at the nearest foe: a tracer, the hit, a pierce through foes on the line and a splash */
function shoot(b: Barrel): void {
  const v = skillValues(ID);
  const my = b.y - BARREL.muzzle;
  const foe = nearestFoe(b.x, my);
  if (!foe) return;
  const [fx, fy] = enemyCenter(foe);
  if (Math.hypot(fx - b.x, fy - my) > BARREL.range) return;
  b.face = Math.sign(fx - b.x) || b.face;
  const angle = Math.atan2(fy - my, fx - b.x);
  game.fx.push(createMuzzleFlash(b.x + b.face * 3, my, angle));
  game.fx.push(createTracerLine(b.x + b.face * 3, my, fx, fy));
  const damage = progress.stats.ad * v.power;
  dealDamage(foe, damage, { fromX: b.x, kx: b.face * 30, ky: -10, source: ID });
  if (v.stagger && foe.rank === "minion") staggerFoe(foe, v.stagger);
  if (!v.pierce) return;
  for (const e of game.enemies) {
    if (e === foe || e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    const u = (ex - b.x) / (fx - b.x || 1);
    if (u > 1 && Math.abs(ey - (my + (fy - my) * u)) < BARREL.pierce)
      dealDamage(e, damage * BARREL.pierceShare, { fromX: b.x, kx: b.face * 30, source: ID });
  }
}

/** Spare Barrel: a parry, and from level 7 a perfect dodge, may plant a barrel on legs that shoots the nearest foe */
export const spareBarrel: SkillBehavior = {
  create: () => ({ cd: 0, barrels: [] }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    const every = skillValues(ID).every;
    for (const b of m.barrels) {
      b.left -= dt;
      b.next -= dt;
      if (b.next > 0) continue;
      b.next = every;
      shoot(b);
    }
    m.barrels = m.barrels.filter((b) => b.left > 0);
  },
  draw(memory) {
    place();
    for (const b of memoryOf(memory).barrels) {
      const k = Math.min(1, b.left / 0.3);
      hairline(b.x - 4, b.y, b.x, b.y - 6, DARK, k);
      hairline(b.x + 4, b.y, b.x, b.y - 6, DARK, k);
      hairline(b.x, b.y, b.x, b.y - 6, DARK, k);
      for (let d = -2; d <= 5; d += 0.5) {
        fleck(b.x + b.face * d, b.y - BARREL.muzzle, STEEL, k);
        fleck(b.x + b.face * d, b.y - BARREL.muzzle + 0.5, DARK, k);
      }
      fleck(b.x, b.y - BARREL.muzzle - 0.5, PHOSPHOR[5], k);
      glow(b.x, b.y - BARREL.muzzle, 5, PHOSPHOR[4], 0.2 * k);
    }
  },
  on: {
    parry(memory) {
      plant(memoryOf(memory));
    },
    perfectDodge(memory) {
      if (skillValues(ID).dodge) plant(memoryOf(memory));
    },
  },
};
