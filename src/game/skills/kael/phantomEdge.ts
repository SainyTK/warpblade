import { ECHO_DELAY } from "../../../constants/combat";
import { GROUND } from "../../../constants/stage";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { createEcho } from "../../effects/echo";
import { enemyBox, enemyCenter, walks } from "../../enemies/enemy";
import { showPhantom } from "../../hero/phantom";
import { game, hero, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { copyPower } from "./copyPower";

const ID = "k_echo";

interface Phantom {
  foe: Enemy;
  /** seconds it stays to repeat Kael's blows on its foe */
  left: number;
}

interface EchoMemory {
  cd: number;
  phantoms: Phantom[];
}

const memoryOf = (m: SkillMemory): EchoMemory => m as unknown as EchoMemory;

/** the side of a foe its blows come from: behind it with the skill's fifth level, otherwise Kael's side */
function strikeSide(foe: Enemy, back: boolean): number {
  if (back) return foe.face;
  return Math.sign(foe.x - hero.x) || hero.face;
}

/** a phantom repeats the blow on its foe: the move's own power, from behind or from Kael's side */
function repeat(foe: Enemy, power: number): void {
  const v = skillValues(ID);
  const side = strikeSide(foe, !!v.back);
  const box = enemyBox(foe);
  const x = side > 0 ? box[0] - 8 : box[2] + 8;
  const y = walks(foe) ? foe.y : Math.min(GROUND, enemyCenter(foe)[1] + 18);
  showPhantom(x, y, side, ECHO_DELAY + 0.2);
  game.fx.push(createEcho(foe, progress.stats.ad * power * v.repeat, side, ID, !!v.heavy));
}

/** Phantom Edge: a sword blow from behind may call a phantom of Kael that repeats it; from level 3 the phantom stays and
 *  repeats every blow on its foe; as Phantom Host phantoms come without a back blow */
export const phantomEdge: SkillBehavior = {
  create: () => ({ cd: 0, phantoms: [] }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    for (const p of m.phantoms) p.left -= dt;
    m.phantoms = m.phantoms.filter((p) => p.left > 0 && p.foe.hp > 0);
  },
  on: {
    blow(memory, ev, state) {
      if (ev.source !== "attacks" || !ev.melee || ev.foe.hp <= 0) return;
      const m = memoryOf(memory);
      const v = skillValues(ID);
      const power = copyPower(ev.move);
      const staying = m.phantoms.filter((p) => p.foe === ev.foe);
      if (staying.length) {
        for (let i = 0; i < staying.length; i++) repeat(ev.foe, power);
        return;
      }
      if (!(ev.back || state.evolved) || m.cd > 0 || !rng.chance(v.chance)) return;
      m.cd = withCharms("cooldown", v.cooldown);
      if (m.phantoms.length >= v.most) m.phantoms.shift();
      if (v.stay) m.phantoms.push({ foe: ev.foe, left: withCharms("duration", v.stay) });
      repeat(ev.foe, power);
    },
  },
};
