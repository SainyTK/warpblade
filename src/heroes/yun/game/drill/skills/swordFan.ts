import { drillFighter } from "../../../../../drill";
import { game, progress } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { createStreamSword } from "../../effects/stream";
import { hoverPlace } from "../../hover";
import { foesNear, spellStrike } from "../strike";

const ID = "yu_fan";
const RISES = [-0.35, 0.3, -0.12, 0.18, -0.5, 0.45, 0.05, -0.25] as const;
const PIERCE = 30;
const fan = { release: null as object | null };

export const SWORD_FAN_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.preparation *= values.preparation ?? 1;
  },
  spellHit(foe, spell, { values }) {
    if (spell.id !== "stream") {
      return;
    }
    spellStrike(foe, values.bonus, ID);
    if (values.knock) {
      foe.vx += Math.sign(foe.x - (drillFighter()?.x ?? foe.x)) * 90;
    }
    if (values.pierce) {
      for (const near of foesNear(foe.x, foe.y - 14, PIERCE)) {
        if (near !== foe) {
          spellStrike(near, values.bonus, ID);
        }
      }
    }
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    const release = h?.spellRelease;
    if (!h || !release || h.spellBook.selected.id !== "stream" || fan.release === release) {
      if (!release) {
        fan.release = null;
      }
      return;
    }
    fan.release = release;
    const count = evolved ? values.peacock : (values.fan ?? 0);
    for (let i = 0; i < count; i++) {
      game.fx.push(
        createStreamSword({
          from: hoverPlace(i),
          delay: i * 0.04,
          reach: 150,
          rise: RISES[i % RISES.length],
          damage: progress.stats.ap * values.swordPower,
          source: ID,
          returns: false,
        }),
      );
    }
  },
};
