import { PAL } from "../../../constants/palette";
import { fleck, hairline, place, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createAccentRing } from "../../effects/jory/accentRing";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { markFoe } from "../../enemies/skillStatus";
import { jory } from "../../hero/jory/memory";
import { game, hero, progress } from "../../state";
import { skillValues } from "../query";
import { nearestFoe } from "../targets";

const ID = "j_tuning";
/** Perfect Pitch: Accents on a tuned foe that shatter it, and the shatter's ability power */
const PERFECT = { accents: 4, power: 4 } as const;

/** a tuned foe: beats left, whether it was tuned off the beat (half as long, half as much), and Accents taken */
interface Tuned {
  foe: Enemy;
  left: number;
  half: boolean;
  accents: number;
}

/** a small tuning fork humming over a tuned foe */
function drawFork(t: Tuned, time: number): void {
  const [x0, y0] = enemyBox(t.foe);
  const x = (x0 + enemyBox(t.foe)[2]) / 2;
  const y = y0 - 6;
  const hum = Math.sin(time * 40) > 0 ? 0.5 : 0;
  hairline(x - 1.5 - hum, y - 5, x - 1.5, y, PAL.beat[4]);
  hairline(x + 1.5 + hum, y - 5, x + 1.5, y, PAL.beat[4]);
  hairline(x - 1.5, y, x + 1.5, y, PAL.beat[3]);
  px(x, y + 1, PAL.beat[3]);
  if (t.half) return;
  fleck(x - 3.5, y - 4, PAL.beat[5], 0.8);
  fleck(x + 3.5, y - 4, PAL.beat[5], 0.8);
}

/**
 * Tuning Fork: a spell on I. On the beat it tunes the nearest foes for its beats; off the beat for half as long, at
 * half. Each Accent on a tuned foe adds ability power, a tuned foe takes more from every source, and with Perfect Pitch
 * four Accents shatter it.
 */
export const tuningSkill: SkillBehavior = {
  create: () => ({ tuned: [] as Tuned[], time: 0 }),
  update(m, _s, dt) {
    m.time = (m.time as number) + dt;
    m.tuned = (m.tuned as Tuned[]).filter((t) => t.foe.hp > 0 && t.left > 0);
  },
  draw(m) {
    place();
    for (const t of m.tuned as Tuned[]) drawFork(t, m.time as number);
  },
  on: {
    cast(m, event) {
      if (event.ability !== ID) return;
      const v = skillValues(ID);
      const half = !jory.castOnBeat;
      const beats = Math.round((v.beats ?? 8) * (half ? 0.5 : 1));
      const picked: Enemy[] = [];
      for (let i = 0; i < (v.count ?? 1); i++) {
        const foe = nearestFoe(hero.x, hero.y - 16, picked);
        if (!foe) break;
        picked.push(foe);
      }
      const tuned = (m.tuned as Tuned[]).filter((t) => !picked.includes(t.foe));
      for (const foe of picked) {
        tuned.push({ foe, left: beats, half, accents: 0 });
        if (v.bonus) markFoe(foe, ID, beats * jory.beatLen, v.bonus * (half ? 0.5 : 1));
        if (v.slow) foe.chill = Math.max(foe.chill, v.slow);
        const [cx, cy] = enemyCenter(foe);
        game.fx.push(createAccentRing(cx, cy));
      }
      m.tuned = tuned;
    },
    tick(m) {
      for (const t of m.tuned as Tuned[]) t.left--;
    },
    accent(m, event) {
      const t = (m.tuned as Tuned[]).find((x) => x.foe === event.foe);
      if (!t || t.foe.hp <= 0) return;
      const v = skillValues(ID);
      dealDamage(t.foe, progress.stats.ap * (v.ap ?? 0) * (t.half ? 0.5 : 1), { fromX: hero.x, source: ID });
      t.accents++;
      if (!v.perfect || t.accents < PERFECT.accents || t.foe.hp <= 0) return;
      dealDamage(t.foe, progress.stats.ap * PERFECT.power, { fromX: hero.x, heavy: true, source: ID });
      t.left = 0;
    },
  },
};
