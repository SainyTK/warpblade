import { DEBT } from "../../../constants/brannoc/fury";
import { GEYSER } from "../../../constants/brannoc/skills";
import { SPARKS } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createBloodPillar } from "../../effects/brannoc/bloodPillar";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { markFoe } from "../../enemies/skillStatus";
import { repay } from "../../hero/brannoc/debt";
import { game, hero, progress } from "../../state";
import { boxHit, shake } from "../../world";
import { skillValues, withCharms } from "../query";
import { foesOnScreen } from "../targets";

const ID = "b_geyser";

/** a pillar still to erupt: where, how wide, seconds until it does, and the foes this cast's pillars have struck */
interface Pending {
  x: number;
  width: number;
  wait: number;
  struck: Set<Enemy>;
}

interface GeyserMemory {
  pending: Pending[];
}

const memoryOf = (m: SkillMemory): GeyserMemory => m as unknown as GeyserMemory;

/** the standing foes within reach of him that a pillar rising under them reaches, nearest first */
function foesInReach(): Enemy[] {
  return foesOnScreen()
    .filter((e) => enemyBox(e)[3] > GROUND - GEYSER.height)
    .map((e) => ({ e, d: Math.abs(enemyCenter(e)[0] - hero.x) }))
    .filter((f) => f.d <= GEYSER.reach)
    .sort((p, q) => p.d - q.d)
    .map((f) => f.e);
}

/** where each pillar rises: under the nearest foes in turn, and beside the first once there are no more foes; with no
 *  foe in reach a single pillar rises a little ahead of him */
function pillarSpots(count: number, width: number): number[] {
  const foes = foesInReach();
  if (!foes.length) return [hero.x + hero.face * GEYSER.bare];
  const spots: number[] = [];
  for (let i = 0; i < count; i++) {
    if (i < foes.length) {
      spots.push(enemyCenter(foes[i])[0]);
      continue;
    }
    // beside the first, alternating sides, a pillar's width further out each time
    const k = i - foes.length + 1;
    const side = k % 2 ? 1 : -1;
    spots.push(spots[0] + side * width * Math.ceil(k / 2));
  }
  return spots;
}

/** a pillar erupts: it rises, and strikes each foe its column reaches that no other pillar of this cast struck */
function erupt({ x, width, struck }: Pending): void {
  game.fx.push(createBloodPillar(x, GROUND, width, GEYSER.height));
  const v = skillValues(ID);
  const box: [number, number, number, number] = [x - width / 2, GROUND - GEYSER.height, x + width / 2, GROUND];
  for (const e of game.enemies) {
    if (e.hp <= 0 || struck.has(e)) continue;
    if (!boxHit(box, enemyBox(e))) continue;
    struck.add(e);
    // the pillar strikes from below, so no foe is struck from behind
    dealDamage(e, progress.stats.ap * (v.ap ?? 0) + progress.stats.ad * (v.ad ?? 0), {
      launch: e.rank === "minion" ? GEYSER.launch : undefined,
      source: "abilities",
    });
    const [cx, cy] = enemyCenter(e);
    game.fx.push(createImpact(cx, cy, Math.sign(cx - hero.x) || hero.face, false, SPARKS.rage));
    if (v.mark) markFoe(e, ID, GEYSER.markTime, v.mark);
    const times = v.fountain ? 2 : v.repay ? 1 : 0;
    for (let i = 0; i < times; i++) repay(DEBT.repay, e);
  }
}

/**
 * Blood Geyser: a spell on I paid in HP. Pillars of blood erupt under the nearest foes within reach, each striking
 * with his ability power and attack damage and throwing minions up; with its levels more pillars, wider, marking the
 * foes struck and repaying the debt on each. Blood Fountain raises three pillars and repays twice on each foe.
 */
export const geyserSkill: SkillBehavior = {
  create: () => ({ pending: [] }),
  update(memory, _s, dt) {
    const m = memoryOf(memory);
    for (const p of m.pending) {
      p.wait -= dt;
      if (p.wait <= 0) erupt(p);
    }
    m.pending = m.pending.filter((p) => p.wait > 0);
  },
  on: {
    cast(memory, event) {
      if (event.ability !== ID) return;
      const v = skillValues(ID);
      const width = withCharms("area", v.width ?? 12);
      const count = Math.round(withCharms("amount", v.pillars ?? 1));
      const struck = new Set<Enemy>();
      const [first, ...rest] = pillarSpots(count, width);
      // the first erupts at once; the rest follow one after another
      erupt({ x: first, width, wait: 0, struck });
      const m = memoryOf(memory);
      rest.forEach((x, i) => {
        m.pending.push({ x, width, wait: (i + 1) * GEYSER.stagger, struck });
      });
      shake(0.12, 1.5);
    },
  },
};
