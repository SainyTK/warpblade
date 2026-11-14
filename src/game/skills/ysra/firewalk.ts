import { PILLAR_STRIDE } from "../../../constants/evolutions";
import { W } from "../../../constants/stage";
import { GLAIVE_FEEL } from "../../../constants/ysra/glaive";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createSlash } from "../../effects/slash";
import { ignite } from "../../enemies/burn";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { G_FIREWALK, G_TURN } from "../../hero/ysra/glaive/slashes";
import { pinFoe } from "../../hero/ysra/pin";
import { gainHeat } from "../../hero/ysra/pyre/heat";
import { meleeHit } from "../../meleeHit";
import { castFlamePillar } from "../../spells/rites/flamePillar";
import { game, hero, progress } from "../../state";
import { boxAhead, boxHit, heroBox, newSwing, surfaceBelow } from "../../world";
import { skillEvolved, skillValues } from "../query";
import { memoryAs } from "./memory";

const ID = "y_firewalk";
/** the sweep behind her as the dodge ends: its box, behind her feet facing the dodge's way */
const TURN_BOX = [-40, -34, 6, 2] as const;

interface FirewalkMemory {
  /** where she stood before the dodge under way set off, for Pillar Stride's row */
  from: number;
  /** the foes the dodge under way has cut, so each is cut once */
  cut: Enemy[];
}

/** the glaive cuts a foe the dodge passes through: burning, pinned and Heat as the level sets */
function cutFoe(e: Enemy): void {
  const v = skillValues(ID);
  const [x, y] = enemyCenter(e);
  game.fx.push(createSlash(x, y + 18, hero.face, G_FIREWALK));
  dealDamage(e, progress.stats.ad * v.cut, {
    fromX: hero.x - hero.face * 10,
    kx: hero.face * 30,
    ky: -20,
    melee: true,
  });
  if (v.burn) ignite(e, v.burn);
  if (v.pin) pinFoe(e, { time: v.pin, taken: 0, burn: 0 });
  if (v.heat) gainHeat(v.heat);
}

/** Pillar Stride: low flame pillars along the path from where she set off to where she stopped */
function pillarRow(from: number, power: number): void {
  const to = hero.x;
  const n = Math.floor(Math.abs(to - from) / PILLAR_STRIDE.spacing);
  for (let i = 0; i <= n; i++) {
    const x = from + Math.sign(to - from) * i * PILLAR_STRIDE.spacing;
    if (x < 4 || x > W - 4) continue;
    game.fx.push(castFlamePillar(x, surfaceBelow(x, hero.y), { ...PILLAR_STRIDE.shape, power }, ID));
  }
}

/** the sweep behind her: the foes she just passed through, struck as she turns the glaive round */
function turnSweep(power: number): void {
  newSwing();
  game.fx.push(createSlash(hero.x, hero.y, -hero.face, G_TURN));
  meleeHit([boxAhead(...TURN_BOX)], { power, kx: 90, ky: -40, big: true, feel: GLAIVE_FEEL.sweep });
}

/**
 * Firewalk: her front dodge cuts every foe it passes through with the glaive, setting them burning, building Heat and
 * pinning them as its level grows; the dodge ends in a sweep behind her, and Pillar Stride bursts pillars along its path.
 * Its level 2 gives her a second air sweep, read by her kit.
 */
export const firewalk: SkillBehavior = {
  create: () => ({ from: Number.NaN, cut: [] }),
  update(memory) {
    const m = memoryAs<FirewalkMemory>(memory);
    if (hero.state !== "dash") {
      m.from = hero.x;
      m.cut = [];
      return;
    }
    const box = heroBox();
    for (const e of game.enemies) {
      if (e.hp <= 0 || m.cut.includes(e) || !boxHit(box, enemyBox(e))) continue;
      m.cut.push(e);
      cutFoe(e);
    }
  },
  on: {
    dash(memory) {
      const v = skillValues(ID);
      if (v.turn) turnSweep(v.turn);
      const from = memoryAs<FirewalkMemory>(memory).from;
      if (skillEvolved(ID) && Number.isFinite(from)) pillarRow(from, v.pillars);
    },
  },
};
