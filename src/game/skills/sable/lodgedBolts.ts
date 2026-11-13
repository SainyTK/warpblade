import { line, place, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { consumeStacks, stacksOf } from "../../enemies/skillStatus";
import { looseBolt } from "../../hero/sable/loose";
import { skin } from "../../hero/skin";
import { game, progress } from "../../state";
import { skillValues } from "../query";

const ID = "s_lodged";
/** shafts drawn on a foe at most */
const SHOWN = 6;

/** where the n-th lodged shaft sits on a foe, as a part of its box, and which way it leans */
const SPOTS = [
  [0.3, 0.4, -1],
  [0.7, 0.3, 1],
  [0.5, 0.6, -1],
  [0.2, 0.7, 1],
  [0.8, 0.6, -1],
  [0.45, 0.25, 1],
] as const;

/** Point-Blank's kick or the warp's heavy bolt tears the bolts out of a foe: damage for each, and with level 7 they fly on at other foes (Pincushion: a
 *  burst of seeking bolts at every foe around) */
function tearOut(e: Enemy): void {
  const v = skillValues(ID);
  const n = consumeStacks(e, ID);
  if (!n) return;
  const [x, y] = enemyCenter(e);
  dealDamage(e, progress.stats.ad * v.tear * n, { fromX: x, heavy: true, source: ID });
  if (!v.flyOn) return;
  // level 7 sends them at the nearest foe; Pincushion spreads them over every foe around, nearest first
  const near = game.enemies
    .filter((o) => o !== e && o.hp > 0)
    .sort((a, b) => Math.abs(enemyCenter(a)[0] - x) - Math.abs(enemyCenter(b)[0] - x))
    .slice(0, v.seek ? n : 1);
  for (let i = 0; i < n && near.length; i++) {
    const [tx, ty] = enemyCenter(near[i % near.length]);
    looseBolt({
      x,
      y,
      angle: Math.atan2(ty - y, tx - x),
      share: 1,
      power: v.flyOn,
      pierce: v.seek ? 2 : 0,
      struck: new Set([e]),
      prime: null,
      plain: true,
      source: ID,
    });
  }
}

/** Lodged Bolts: the bolts are laid by the shots themselves; they slow the foe and show as shafts, and Point-Blank's
 *  kick or the warp's heavy bolt tears them out */
export const lodgedBolts: SkillBehavior = {
  create: () => ({}),
  update() {
    const v = skillValues(ID);
    if (!v.slow) return;
    for (const e of game.enemies) if (e.hp > 0 && stacksOf(e, ID) >= v.slow) e.chill = Math.max(e.chill, 0.2);
  },
  draw() {
    place();
    for (const e of game.enemies) {
      const n = Math.min(SHOWN, stacksOf(e, ID));
      if (!n || e.hp <= 0) continue;
      const [x0, y0, x1, y1] = enemyBox(e);
      for (let i = 0; i < n; i++) {
        const [u, w, lean] = SPOTS[i];
        const x = x0 + (x1 - x0) * u;
        const y = y0 + (y1 - y0) * w;
        line(x, y, x + lean * 3, y - 2, skin.ramp[2]);
        px(x + lean * 3, y - 2, skin.ramp[4]);
      }
    }
  },
  on: {
    kick(_memory, event) {
      if (!skillValues(ID).tear) return;
      for (const e of event.foes) tearOut(e);
    },
    warpBolt(_memory, event) {
      if (skillValues(ID).tear) tearOut(event.foe);
    },
  },
};
