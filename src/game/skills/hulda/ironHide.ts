import { ENEMIES } from "../../../constants/enemies";
import { GRIT } from "../../../constants/hulda/grit";
import { HIDE } from "../../../constants/hulda/rust";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { createFloorRing } from "../../effects/floorRing";
import { enemyCenter } from "../../enemies/enemy";
import { gainGrit } from "../../hero/hulda/grit";
import { hulda } from "../../hero/hulda/memory";
import { skin } from "../../hero/skin";
import { game, hero } from "../../state";
import { skillValues } from "../query";
import { distance2 } from "../targets";
import { sprayRust } from "./rustSpray";

const ID = "h_ironHide";

interface HideMemory {
  /** seconds toward the next plate Living Fortress regrows */
  regrow: number;
}

const memoryOf = (m: SkillMemory): HideMemory => m as unknown as HideMemory;

/** a broken plate shoves every foe close to her off its feet */
function knockDown(): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || distance2(e, hero.x, hero.y - 16) > HIDE.knock * HIDE.knock) continue;
    const dir = Math.sign(enemyCenter(e)[0] - hero.x) || hero.face;
    e.vx += dir * HIDE.knockKx;
    if (ENEMIES[e.type].launchable) e.stun = Math.max(e.stun, HIDE.knockStun);
  }
  game.fx.push(createFloorRing(hero.x, hero.y, HIDE.knock, skin.ramp, 0.3));
}

/** a foe stands close enough to keep her plates regrowing */
const foesNear = (): boolean =>
  game.enemies.some((e) => e.hp > 0 && distance2(e, hero.x, hero.y - 16) <= HIDE.near * HIDE.near);

/**
 * Iron Hide: taken, it fills her Grit to its start; her plates take more of each blow (grit.ts) and heal her as they
 * break (armour.ts); a break knocks foes near down, and evolved, plates regrow while foes are near and breaks spray rust.
 */
export const ironHide: SkillBehavior = {
  create() {
    hulda.grit = Math.max(hulda.grit, skillValues(ID).start);
    return { regrow: 0 };
  },
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    const every = skillValues(ID).regrow;
    if (!every || !foesNear()) return;
    m.regrow += dt;
    if (m.regrow < every) return;
    m.regrow = 0;
    gainGrit(GRIT.plate);
  },
  on: {
    armour(_memory, event) {
      if (event.kind !== "plate") return;
      const v = skillValues(ID);
      if (v.knock) knockDown();
      if (v.rust) sprayRust(hero.x - hero.face * 2, hero.y - 20, v.rust);
    },
  },
};
