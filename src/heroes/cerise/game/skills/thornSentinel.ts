import { GROUND } from "../../../../constants/stage";
import { drillFighter } from "../../../../drill";
import { glow, glowLine, hairline, line, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { touches } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { ROSE_RAMP, ROSE_SPARKS } from "../../look/rose";

const SOURCE = "ce_sentinel";
/** a sentinel is planted this far ahead of her, and its rapier stands this tall */
const PLANT = { ahead: 40, height: 18, flash: 0.1 } as const;

interface Sentinel {
  x: number;
  y: number;
  left: number;
  next: number;
  flash: number;
  face: number;
}

const list = (m: SkillMemory): Sentinel[] => m.list as Sentinel[];

/** a sentinel thrusts at the nearest foe in its reach */
function thrust(s: Sentinel): void {
  const v = skillValues(SOURCE);
  const reach = withCharms("area", v.reach);
  const foe = game.enemies.find((e) => e.hp > 0 && touches(e, s.x, s.y - PLANT.height, reach));
  if (!foe) return;
  const [ex, ey] = enemyCenter(foe);
  s.face = Math.sign(ex - s.x) || s.face;
  s.flash = PLANT.flash;
  dealDamage(foe, progress.stats.ad * v.power, { fromX: s.x, kx: s.face * 30, stagger: 0.3, source: SOURCE });
  if (v.pin) foe.pinned = Math.max(foe.pinned, v.pin);
  game.fx.push(createImpact(ex, ey, s.face, false, ROSE_SPARKS));
}

/** evolved: the sentinel bursts into petal blades as it fades */
function fade(s: Sentinel): void {
  if (!skillEvolved(SOURCE)) return;
  game.fx.push(createFloorRing(s.x, s.y, 36, ROSE_RAMP, 0.4));
  for (const e of game.enemies)
    if (e.hp > 0 && touches(e, s.x, s.y - 12, 36))
      dealDamage(e, progress.stats.ad * skillValues(SOURCE).bloom, { fromX: s.x, kx: 0, source: SOURCE });
}

/** Thorn Sentinel: the lunge can plant a rapier of light in the floor that keeps thrusting at foes near it */
export const thornSentinel: SkillBehavior = {
  create: () => ({ list: [], swing: -1 }),
  update(m, _state, dt) {
    const v = skillValues(SOURCE);
    for (const s of list(m)) {
      s.left -= dt;
      s.next -= dt;
      s.flash = Math.max(0, s.flash - dt);
      if (s.next <= 0) {
        s.next = withCharms("cooldown", v.every);
        thrust(s);
      }
      if (s.left <= 0) fade(s);
    }
    m.list = list(m).filter((s) => s.left > 0);
  },
  drawBack(m) {
    place();
    for (const s of list(m)) {
      const k = Math.min(1, s.left * 3);
      const top = s.y - PLANT.height;
      const tip = s.flash > 0 ? s.x + s.face * 18 : s.x;
      line(s.x, s.y, s.x, top, ROSE_RAMP[3], 0.8 * k);
      hairline(s.x, s.y - 2, s.x, top, ROSE_RAMP[6], k);
      line(s.x - 3, top, s.x + 3, top, ROSE_RAMP[5], k);
      if (s.flash > 0) glowLine(s.x, top + 4, tip, top + 4, 3, ROSE_RAMP[4], 0.5);
      glow(s.x, top, 6, ROSE_RAMP[3], 0.3 * k);
    }
  },
  on: {
    blow(m, event) {
      const drillSwing = drillFighter()?.swing;
      const lunge = event.move === "longLunge" || drillSwing?.kind === "third";
      const swing = drillSwing ?? hero.swing;
      if (!lunge || !event.finisher || m.swing === swing) return;
      m.swing = swing;
      const v = skillValues(SOURCE);
      if (!rng.chance(v.chance)) return;
      const x = hero.x + hero.face * PLANT.ahead;
      const y = Math.min(GROUND, surfaceBelow(x, hero.y - 4));
      const kept = list(m).slice(Math.max(0, list(m).length - (v.most - 1)));
      m.list = [...kept, { x, y, left: withCharms("duration", v.time), next: 0.15, flash: 0, face: hero.face }];
    },
  },
};
