import { fleck, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { GRAIN } from "../../constants/palette";
import { zafirFx } from "../skillFx";
import { STRING_SPINS } from "../stringSkills";

const ID = "za_scour";
/** grit grinds once a second, stays this long after the last, and a shatter cuts this far round */
const GRIT = { every: 1, life: 4, splash: 30 } as const;
/** fused glass, glint to shadow */
const FUSED = [WHITE, 0xdff8f2, 0x9ee0d8, 0x4a9a96] as const;

/** grind `n` grit into a foe; a foe filled up stands held, and from level 7 fuses to glass and shatters */
export function grind(e: Enemy, n: number): void {
  const v = skillValues(ID);
  if (!v.grit || e.hp <= 0) return;
  addStacks(e, ID, {
    stacks: n,
    max: v.gritMost,
    damage: progress.stats.ad * v.grit * GRIT.every,
    every: GRIT.every,
    duration: withBuild("duration", GRIT.life),
  });
  const [x, y] = enemyCenter(e);
  const full = stacksOf(e, ID) >= v.gritMost;
  const grit = progress.stats.ad * v.grit * GRIT.life * n;
  zafirFx(ID, "mark", { x, y, reach: 6 + stacksOf(e, ID) }, { damage: grit, quiet: !full });
  if (!full) return;
  if (v.gritHalt) e.halt = Math.max(e.halt, v.gritHalt);
  if (v.fuse) shatter(e, v);
}

/** a foe full of grit shatters: the fused glass cuts it, and as Glassing Wind every foe round it */
function shatter(e: Enemy, v: Readonly<Record<string, number>>): void {
  const n = consumeStacks(e, ID);
  const [x, y] = enemyCenter(e);
  const damage = progress.stats.ad * v.fuse * n;
  dealDamage(e, damage, { fromX: x, source: ID });
  if (v.splash)
    for (const f of foesOnScreen())
      if (f !== e && Math.abs(f.x - x) <= GRIT.splash) dealDamage(f, damage * 0.5, { fromX: x, source: ID });
  game.fx.push(createImpact(x, y, 1, true, [...FUSED]));
  zafirFx(ID, "burst", { x, y, reach: v.splash ? GRIT.splash * 0.6 : 12 }, { damage });
}

/** the ring cuts gritted foes harder, from level 4 */
export const gritTaken = (e: Enemy): number => (stacksOf(e, ID) ? (skillValues(ID).gritTaken ?? 0) : 0);

/** Scouring Sand: the sand ring grinds grit into the foes it cuts; from level 5 the cyclone grinds two, and as Glassing
 *  Wind every spin grinds one */
export const scouringSand: SkillBehavior = {
  create: () => ({}),
  draw() {
    place();
    for (const e of foesOnScreen()) {
      const n = stacksOf(e, ID);
      if (!n) continue;
      const [x, y] = enemyCenter(e);
      for (let i = 0; i < n * 2; i++) {
        const a = (i / (n * 2)) * TAU + e.seed;
        fleck(
          x + Math.cos(a) * 6,
          y + Math.sin(a) * 5,
          n >= (skillValues(ID).gritMost ?? 99) ? FUSED[2] : GRAIN[i % 2],
        );
      }
    }
  },
  on: {
    ringCut(_memory, ev) {
      grind(ev.foe, 1);
    },
    blow(_memory, ev, state) {
      if (ev.source !== "attacks" || !ev.move) return;
      if (ev.move === "duneCyclone") grind(ev.foe, skillValues(ID).cyclone ?? 0);
      else if (state.evolved && STRING_SPINS.has(ev.move)) grind(ev.foe, 1);
    },
  },
};
