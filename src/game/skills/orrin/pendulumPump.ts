import { SPARKS } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { orrin } from "../../hero/orrin/memory";
import { swingHand } from "../../hero/orrin/swing";
import { game, hero, progress } from "../../state";
import { skillValues } from "../query";

const ID = "o_pump";
/** pixels between the points tested along the chain */
const STEP = 4;

interface PumpMemory {
  /** foes the chain has cut in the swing under way */
  cut: Enemy[];
}

const memoryOf = (m: SkillMemory): PumpMemory => m as unknown as PumpMemory;

/** the taut chain from his hand to the latch passes through this foe */
function onChain(e: Enemy): boolean {
  const at = orrin.latchAt;
  if (!at) return false;
  const hand = swingHand();
  const [x0, y0, x1, y1] = enemyBox(e);
  const n = Math.max(1, Math.ceil(Math.hypot(at.x - hand.x, at.y - hand.y) / STEP));
  for (let i = 0; i <= n; i++) {
    const x = hand.x + ((at.x - hand.x) * i) / n;
    const y = hand.y + ((at.y - hand.y) * i) / n;
    if (x >= x0 && x <= x1 && y >= y0 && y <= y1) return true;
  }
  return false;
}

/**
 * Pendulum Pump: a harder pump, longer air bites and hooks, bigger flings, cheaper and more hooks (in the kit). Here:
 * with Skyline the taut chain cuts every foe it sweeps through during a swing, once each swing.
 */
export const pendulumPump: SkillBehavior = {
  create: () => ({ cut: [] }),
  update(memory) {
    const m = memoryOf(memory);
    const power = skillValues(ID).cut ?? 0;
    if (hero.state !== "swing" || !orrin.latchAt) {
      m.cut = [];
      return;
    }
    if (!power) return;
    for (const e of game.enemies) {
      if (e.hp <= 0 || m.cut.includes(e) || !onChain(e)) continue;
      m.cut.push(e);
      const dir = Math.sign(hero.vx) || hero.face;
      dealDamage(e, progress.stats.ad * power, { fromX: e.x - dir * 6, kx: dir * 60, melee: true, source: ID });
      const [cx, cy] = enemyCenter(e);
      game.fx.push(createImpact(cx, cy, dir, false, SPARKS.brass));
      sfx.hit(false, 1.4);
    }
  },
  on: {
    latch(memory) {
      memoryOf(memory).cut = [];
    },
  },
};
