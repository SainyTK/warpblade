import { GRIT } from "../../../constants/hulda/grit";
import { SHOULDER } from "../../../constants/hulda/shoulderCheck";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { floorThud } from "../../hero/hulda/effects/thud";
import { throwPower } from "../../hero/hulda/fracture";
import { gainGrit } from "../../hero/hulda/grit";
import { canHold } from "../../hero/hulda/hold";
import { slamRing } from "../../hero/hulda/slam";
import { refundStamina } from "../../hero/stamina";
import { game, hero, progress } from "../../state";
import { dust, hitStop, shake } from "../../world";
import { emitSkillEvent } from "../events";
import { skillValues } from "../query";

const ID = "h_shoulderCheck";

/** the pauldron meets a foe the dodge passed: a heavy shove aside and a short reel */
function shoulder(e: Enemy, power: number, reel: number): void {
  const [cx, cy] = enemyCenter(e);
  const dir = Math.sign(cx - hero.x) || -hero.face;
  dealDamage(e, progress.stats.ad * power, {
    fromX: hero.x,
    kx: dir * SHOULDER.kx,
    stun: reel,
    heavy: true,
    melee: true,
  });
  game.fx.push(createImpact(cx, cy, dir, false));
}

/**
 * A minion the dodge passed is flipped over her shoulder: struck, it comes up behind her at shoulder height and drops
 * hard into the floor there, a throw of her own. The `order`-th flip of one dodge lands a little further back, and the
 * flip's ring spares the other foes flipped with it.
 */
function flip(e: Enemy, order: number, flipped: readonly Enemy[], v: Readonly<Record<string, number>>): void {
  e.x = hero.x - hero.face * (SHOULDER.behind + order * SHOULDER.spread);
  e.y = hero.y;
  dealDamage(e, progress.stats.ad * throwPower(e, v.flip), {
    fromX: hero.x,
    kx: 0,
    stun: SHOULDER.flipStun,
    heavy: true,
  });
  if (e.hp > 0) Object.assign(e, { air: true, airTime: 0, y: hero.y - SHOULDER.lift, vx: 0, vy: SHOULDER.drop });
  game.fx.push(createImpact(e.x, hero.y - 6, -hero.face, true));
  if (v.ring > 0) {
    slamRing({
      x: e.x,
      floor: hero.y,
      body: e,
      skip: flipped,
      radius: v.ring,
      power: v.ringPower,
      stun: SHOULDER.flipStun,
      stop: SHOULDER.stop,
      shake: SHOULDER.shake,
    });
  } else {
    floorThud(e.x, hero.y, "mid");
    dust(e.x, hero.y, 6);
    hitStop(SHOULDER.stop);
    shake(SHOULDER.shake[0], SHOULDER.shake[1]);
    sfx.boom();
  }
  emitSkillEvent({ type: "throw", foe: e, x: e.x, y: hero.y, slam: true });
}

/**
 * Shoulder Check: her dodge leads with the iron pauldron. Foes it passes are shouldered aside, minions are flipped and
 * slammed down behind her from level 3, each foe passed gives Grit and stamina back, and a perfect dodge fills a plate.
 * Battering Ram rings every flip wide, gives a plate a foe and makes a dodge through foes free.
 */
export const shoulderCheck: SkillBehavior = {
  create: () => ({}),
  on: {
    dash(_memory, event) {
      const v = skillValues(ID);
      const met = event.foes.filter((e) => e.hp > 0);
      for (const e of met) shoulder(e, v.power, v.reel);
      const flipped = v.flip > 0 ? met.filter(canHold) : [];
      flipped.forEach((e, i) => {
        flip(e, i, flipped, v);
      });
      if (!met.length) return;
      sfx.hit(true, 0.7);
      if (v.grit) gainGrit(v.grit * met.length);
      if (v.refund) refundStamina(v.refund);
    },
    perfectDodge() {
      if (skillValues(ID).plate) gainGrit(GRIT.plate);
    },
  },
};
