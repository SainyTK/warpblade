import { enemyCenter } from "../../../game/enemies/enemy";
import { emitSkillEvent } from "../../../game/skills/events";
import { hero, progress } from "../../../game/state";
import { RECOIL_TIME, TRIGGER } from "../constants/chamber";
import { blastAt } from "./blastFoe";
import { dryClick, roundPower, spendRounds } from "./chamber";
import { afterTrigger, triggerBonus, triggerFx } from "./skills/hairTrigger";
import { calderSound } from "./sound";
import { calder } from "./state";

/** where the Trigger's round goes off: in the foe the blow struck, or ahead of the blade when it fell */
function woundPoint(): [number, number] {
  const foe = hero.lastHit;
  if (foe && foe.hp > 0) return enemyCenter(foe);
  return [hero.x + hero.face * 20, hero.y - 18];
}

/**
 * A Trigger blow has landed: a round goes off in the wound, a blast on the struck foe and a splash around it, and the
 * recoil kicks through Calder's arms. On an empty chamber the hammer only clicks.
 */
export function fireTrigger(): void {
  const free = calder.freeTrigger;
  calder.freeTrigger = false;
  if (!free && !spendRounds(1)) {
    dryClick();
    calderSound.click();
    return;
  }
  const foe = hero.lastHit && hero.lastHit.hp > 0 ? hero.lastHit : null;
  const [x, y] = woundPoint();
  const ad = progress.stats.ad;
  const power = roundPower();
  const bonus = triggerBonus(foe);
  const struck = blastAt(foe, x, y, {
    damage: ad * TRIGGER.blast * power * bonus.blast,
    splash: ad * TRIGGER.splash * power,
    reach: TRIGGER.reach,
    kx: TRIGGER.kx,
    stagger: bonus.stagger,
    heavy: bonus.heavy,
    hot: calder.hot || bonus.blast > 1,
  });
  calder.recoil = RECOIL_TIME;
  triggerFx(x, y, ad * TRIGGER.blast * power * bonus.blast);
  afterTrigger(foe);
  emitSkillEvent({ type: "calderTrigger", foe, x, y });
  emitSkillEvent({ type: "calderBlast", x, y, foes: struck, kind: "trigger" });
}
