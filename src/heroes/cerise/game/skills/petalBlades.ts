import { disc, fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { ROSE_RAMP, ROSE_SPARKS } from "../../look/rose";
import { atFloor, atFoe, ceriseFx } from "../fx";

const SOURCE = "ce_petals";
/** the blades circle her this far out and dart at foes within this reach */
const ORBIT = { r: 14, spin: 3, reach: 70 } as const;

interface Blades {
  left: number;
  next: number;
  cd: number;
  t: number;
}

const blades = (m: SkillMemory): Blades => m as unknown as Blades;

/** how many blades circle her now */
const count = (): number => Math.round(withBuild("amount", skillValues(SOURCE).count));

/** one dart from a blade at the nearest foe in reach */
function dart(): void {
  const v = skillValues(SOURCE);
  const foe = nearestFoe(hero.x, hero.y - 18);
  if (!foe) return;
  const [x, y] = enemyCenter(foe);
  if (Math.hypot(x - hero.x, y - hero.y + 18) > ORBIT.reach) return;
  dealDamage(foe, progress.stats.ad * v.power, { fromX: hero.x, kx: 0, stagger: 0.2, source: SOURCE });
  game.fx.push(createImpact(x, y, Math.sign(x - hero.x) || 1, false, ROSE_SPARKS));
  ceriseFx(SOURCE, "burst", atFoe(foe, 7), { damage: progress.stats.ad * v.power, quiet: true });
  if (v.bleed)
    addStacks(foe, SOURCE, { stacks: 1, max: 5, damage: progress.stats.ad * v.bleed, every: 0.5, duration: 3 });
}

/** Petal Blades: an ability can call petal blades that circle her and dart at foes; evolved, six circle her for good */
export const petalBlades: SkillBehavior = {
  create: () => ({ left: 0, next: 0, cd: 0, t: 0 }),
  update(m, _state, dt) {
    const b = blades(m);
    b.t += dt;
    b.cd = Math.max(0, b.cd - dt);
    const forever = skillEvolved(SOURCE);
    if (!forever && b.left <= 0) return;
    b.left -= dt;
    b.next -= dt;
    if (b.next > 0) return;
    b.next = withBuild("cooldown", skillValues(SOURCE).every);
    for (let i = 0; i < count(); i++) dart();
  },
  draw(m) {
    const b = blades(m);
    if (!skillEvolved(SOURCE) && b.left <= 0) return;
    place();
    const n = count();
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + b.t * ORBIT.spin;
      const x = hero.x + Math.cos(a) * ORBIT.r;
      const y = hero.y - 18 + Math.sin(a) * ORBIT.r * 0.45;
      disc(x, y, 1.2, ROSE_RAMP[4], 0.85);
      fleck(x + Math.cos(a + 1.6), y + Math.sin(a + 1.6) * 0.45, ROSE_RAMP[6]);
      glow(x, y, 4, ROSE_RAMP[3], 0.2);
    }
  },
  on: {
    cast(m) {
      const b = blades(m);
      const v = skillValues(SOURCE);
      if (b.cd > 0) return;
      if (skillEvolved(SOURCE)) {
        b.cd = v.cd;
        ceriseFx(SOURCE, "nova", atFloor(hero.x, hero.y, 22), {
          damage: progress.stats.ad * v.power * count() * 2,
          sigil: "rose",
          lift: 18,
        });
        return;
      }
      if (!rng.chance(v.chance)) return;
      b.left = withBuild("duration", v.life);
      ceriseFx(SOURCE, "nova", atFloor(hero.x, hero.y, 18), {
        damage: progress.stats.ad * v.power * count() * 2,
        sigil: "rose",
        lift: 18,
      });
      b.next = 0;
      b.cd = v.cd;
    },
  },
};
