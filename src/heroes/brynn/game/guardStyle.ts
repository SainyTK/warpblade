import { createSlash } from "../../../game/effects/slash";
import { meleeHit } from "../../../game/meleeHit";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillValues } from "../../../game/skills/query";
import { game, hero } from "../../../game/state";
import { boxAhead, boxBehind, newSwing } from "../../../game/world";
import type { GuardStyle } from "../../../types/moveset";
import { BRYNN_BLOCK, COUNTER_CLEAVE } from "../constants/guard";
import { HEFT } from "../constants/heft";
import { addHeft } from "./heft";
import { SLASH } from "./moves/slashes";

/** the Counter Cleave: a wide two-handed cleave in front and behind at once, a knockdown, Heft, and a heavy next swing */
function counterCleave(): void {
  const v = skillValues("br_counter");
  const [x0, y0, x1, y1] = COUNTER_CLEAVE.box;
  const reach = x1 + (v.reach ?? 0);
  newSwing();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...SLASH.cleave, R: SLASH.cleave.R + (v.reach ?? 0) * 0.6 }));
  game.fx.push(createSlash(hero.x, hero.y, -hero.face, { ...SLASH.cleave, W: 9, R: 24 }));
  const hits = meleeHit([boxAhead(x0, y0, reach, y1), boxBehind(x0, y0, reach * 0.7, y1)], {
    power: COUNTER_CLEAVE.power + (v.power ?? 0),
    kx: 120,
    ky: -60,
    stun: COUNTER_CLEAVE.stun,
    big: true,
    sureCrit: !!v.crit,
  });
  addHeft(HEFT.parry + (v.heft ?? 0));
  hero.keenNext = true;
  emitSkillEvent({ type: "counterCleave", hits });
}

/** the flat of the blade: a strong block at a high price in stamina; the parry answers with the Counter Cleave */
export const BRYNN_GUARD: GuardStyle = {
  get chip() {
    return BRYNN_BLOCK.chip;
  },
  get blockCost() {
    return BRYNN_BLOCK.cost * (1 - (skillValues("br_ironskin").block ?? 0));
  },
  parried: counterCleave,
};
