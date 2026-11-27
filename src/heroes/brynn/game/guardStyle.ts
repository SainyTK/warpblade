import { usesDrill } from "../../../drill";
import { createSlash } from "../../../game/effects/slash";
import { meleeHit } from "../../../game/meleeHit";
import { emitSkillEvent } from "../../../game/skills/events";
import { movePayoff, startMovePayoff } from "../../../game/skills/payoff";
import { skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { boxAhead, boxBehind, newSwing } from "../../../game/world";
import type { GuardStyle } from "../../../types/moveset";
import { BRYNN_BLOCK, COUNTER_CLEAVE } from "../constants/guard";
import { HEFT } from "../constants/heft";
import "../types/events";
import { SLASH } from "../constants/slashes";
import { createCrescentWave } from "./effects/heavyWave";
import { ARMOUR, brynnFx, CRESCENT } from "./fx";
import { addHeft } from "./heft";
import { brynn } from "./state";

/** how far Counter Cleave's crescent flies */
const COUNTER_WAVE_REACH = 110;

/** The Counter Cleave: a wide two-handed cleave in front and behind at once and a knockdown. Counter Cleave's extra
 *  power is a precise payoff: it lands on the foe nearest her, the one that struck, and every other foe takes the
 *  plain cleave. `share` is a block's half-power answer (Iron Answer). */
function cleave(share: number): number {
  const v = skillValues("br_counter");
  const [x0, y0, x1, y1] = COUNTER_CLEAVE.box;
  const reach = x1 + (v.reach ?? 0);
  newSwing();
  startMovePayoff();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...SLASH.cleave, R: SLASH.cleave.R + (v.reach ?? 0) * 0.6 }));
  game.fx.push(createSlash(hero.x, hero.y, -hero.face, { ...SLASH.cleave, W: 9, R: 24 }));
  const plain = COUNTER_CLEAVE.power * share;
  const at = { x: hero.x + hero.face * 12, y: hero.y - 16, face: hero.face, reach: 24 };
  const blow = progress.stats.ad * (COUNTER_CLEAVE.power + (v.power ?? 0)) * share;
  brynnFx("br_counter", "slash", at, { damage: blow, signature: share < 1 ? ARMOUR : CRESCENT });
  const hits = meleeHit([boxAhead(x0, y0, reach, y1), boxBehind(x0, y0, reach * 0.7, y1)], {
    power: (COUNTER_CLEAVE.power + (v.power ?? 0)) * share,
    plain,
    kx: 120,
    ky: -60,
    stun: COUNTER_CLEAVE.stun,
    big: true,
    sureCrit: !!v.crit,
  });
  if (v.wave) {
    const wave = { x: hero.x, y: hero.y, face: hero.face, reach: COUNTER_WAVE_REACH };
    brynnFx("br_counter", "wave", wave, { damage: progress.stats.ad * v.wave * share, quiet: true });
    game.fx.push(
      createCrescentWave({
        x: hero.x + hero.face * 16,
        y: hero.y - 18,
        face: hero.face,
        reach: COUNTER_WAVE_REACH,
        damage: progress.stats.ad * v.wave * share,
        payoff: movePayoff(),
        scale: 1.3,
      }),
    );
  }
  return hits;
}

/** the parry's answer: the Counter Cleave, Heft, a heavy next swing, and Counter Cleave's harder swings after */
function parried(): void {
  const v = skillValues("br_counter");
  const hits = cleave(1);
  addHeft(HEFT.parry + (v.heft ?? 0));
  hero.keenNext = true;
  brynn.afterParry = v.afterBlows ?? 0;
  emitSkillEvent({ type: "counterCleave", hits });
}

/** the flat of the blade: a strong block at a high price in stamina; the parry answers with the Counter Cleave. On the
 *  drill the guard is the shared one and Counter Cleave's drill levels answer it */
export const BRYNN_GUARD: GuardStyle = {
  get chip() {
    return BRYNN_BLOCK.chip;
  },
  get blockCost() {
    return BRYNN_BLOCK.cost * (1 - (usesDrill() ? 0 : (skillValues("br_ironskin").block ?? 0)));
  },
  blocked() {
    const share = skillValues("br_counter").blockCleave;
    if (share && !usesDrill()) cleave(share);
  },
  parried() {
    if (!usesDrill()) parried();
  },
};
