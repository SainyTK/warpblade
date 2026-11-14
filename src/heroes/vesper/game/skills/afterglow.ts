import { SPARKS } from "../../../../constants/palette";
import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { DUSK_RAMP } from "../../look/colors";
import { vesper } from "../state";
import { tempoMost, tempoTop } from "../tempo";

const ID = "ve_glow";
/** seconds between afterglow's ticks and how long it lasts; a fallen foe's burst reaches this far; Dusk Fire flares every
 *  this many seconds at the top of Tempo, each flare this many ticks at once */
const GLOW = { every: 0.5, duration: 3, burst: 36, flareEvery: 1, flareTicks: 3 } as const;

/** lay afterglow on a foe */
function layGlow(e: Enemy, n: number): void {
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks: n,
    max: withCharms("amount", v.max),
    damage: progress.stats.ad * v.damage,
    every: GLOW.every,
    duration: withCharms("duration", GLOW.duration),
  });
}

/** afterglow is laid from this many Tempo stacks: the top at first, lower with levels */
const glowFrom = (): number => Math.min(tempoMost(), skillValues(ID).from ?? tempoMost());

/**
 * Afterglow: at high Tempo her blows leave a violet afterglow that burns on; a foe that falls with it bursts on foes near
 * it, reaching the top of Tempo lays it on every foe near her, and as Dusk Fire every afterglow on screen flares each
 * second she holds the top.
 */
export const afterglow: SkillBehavior = {
  create: () => ({ flare: 0 }),
  update(memory, { evolved }, dt) {
    if (!evolved || !tempoTop()) return;
    memory.flare = (memory.flare as number) - dt;
    if ((memory.flare as number) > 0) return;
    memory.flare = GLOW.flareEvery;
    const v = skillValues(ID);
    for (const e of game.enemies) {
      const n = stacksOf(e, ID);
      if (!n || e.hp <= 0) continue;
      dealDamage(e, progress.stats.ad * v.damage * n * GLOW.flareTicks, { fromX: e.x, source: ID });
      game.fx.push(createImpact(...enemyCenter(e), 1, false, SPARKS.shadow));
    }
  },
  on: {
    blow(_m, ev) {
      if (vesper.tempo >= glowFrom() && ev.source !== "ultimate") layGlow(ev.foe, 1);
    },
    kill(_m, ev) {
      const v = skillValues(ID);
      if (!v.burst || !stacksOf(ev.foe, ID)) return;
      const [x, y] = enemyCenter(ev.foe);
      game.fx.push(createFloorRing(x, y + 8, GLOW.burst, DUSK_RAMP, 0.35, 0.5));
      for (const e of game.enemies) {
        if (e === ev.foe || e.hp <= 0) continue;
        const [ex, ey] = enemyCenter(e);
        if (Math.hypot(ex - x, ey - y) <= GLOW.burst)
          dealDamage(e, progress.stats.ad * v.burst, { fromX: x, source: ID });
      }
    },
    tempoTop() {
      const reach = skillValues(ID).topRing;
      if (!reach) return;
      for (const e of game.enemies) if (e.hp > 0 && Math.abs(e.x - hero.x) <= reach) layGlow(e, 1);
      game.fx.push(createFloorRing(hero.x, hero.y, reach, DUSK_RAMP, 0.4));
    },
  },
};
