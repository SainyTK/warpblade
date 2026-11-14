import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { HOT_RAMP, PHOSPHOR } from "../../constants/colors";
import { blastAt } from "../blastFoe";

const SKILL = "ca_speedload";
/** the ring's push or pull and stagger, and the reach of the quick reload's hot blast */
const RING = { push: 160, pull: 120, stagger: 0.4, burst: 40 } as const;
/** the ring's slash: a flat circle round Calder's waist */
const RING_SLASH = { cx: 0, cy: -16, R: 18, sy: 0.3, rot: 0, a0: 0, a1: 6.2, W: 4, hold: 0.04, trail: 0.2 } as const;

/** the closing cylinder throws a cutting ring round Calder, pushing foes away or, as Spin Cycle, drawing them in */
function ring(): void {
  const v = skillValues(SKILL);
  const reach = withCharms("area", v.reach);
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...RING_SLASH, R: reach * 0.8, ramp: PHOSPHOR }));
  game.fx.push(createFloorRing(hero.x, hero.y, reach, PHOSPHOR, 0.3));
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.hypot(ex - hero.x, (ey - hero.y + 16) * 1.3) > reach + 6) continue;
    const dir = Math.sign(ex - hero.x) || hero.face;
    const kx = v.pull ? -dir * RING.pull : v.push ? dir * RING.push : dir * 30;
    dealDamage(e, progress.stats.ad * v.ring, {
      fromX: hero.x,
      kx,
      ky: -40,
      stagger: v.push ? RING.stagger : undefined,
    });
  }
}

/** Speed Loader: the reload's ring, and on a quick reload MP back and a hot blast round Calder */
export const speedLoader: SkillBehavior = {
  create: () => ({}),
  on: {
    calderReload(_m, event) {
      if (event.ultimate) return;
      const v = skillValues(SKILL);
      if (v.ring) ring();
      if (!event.quick) return;
      if (v.mp) hero.mp = Math.min(progress.stats.mp, hero.mp + v.mp);
      if (v.burst)
        blastAt(null, hero.x, hero.y - 16, {
          damage: 0,
          splash: progress.stats.ad * v.burst,
          reach: withCharms("area", RING.burst),
          kx: 120,
          hot: true,
          big: true,
        });
      if (v.burst) game.fx.push(createFloorRing(hero.x, hero.y, RING.burst, HOT_RAMP, 0.35));
    },
  },
};
