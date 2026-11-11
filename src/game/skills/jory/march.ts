import { COMBO } from "../../../constants/combat";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { enemyBox } from "../../enemies/enemy";
import { tier } from "../../hero/jory/beat";
import { soundRing } from "../../hero/jory/soundRing";
import { game, hero, progress } from "../../state";
import { boxHit } from "../../world";
import { skillValues, withCharms } from "../query";

const ID = "j_march";
/** a footfall's ring, and the Parade's */
const FOOTFALL = 30;
const PARADE = 40;
/** how hard a bump pushes a minion back */
const BUMP = 110;

/** he is walking or running on the floor */
const marching = (): boolean => hero.ground && (hero.state === "walk" || hero.state === "run");

/**
 * War March: on each beat while he walks, minions he walks into are bumped back, each downbeat stamps a footfall ring,
 * and at Crescendo the Parade stamps one every beat. The walk's speed and the held Groove live in his kit.
 */
export const marchSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    tick(_m, event) {
      if (!marching()) return;
      const v = skillValues(ID);
      if (v.bump) {
        const reach: [number, number, number, number] = [hero.x - 9, hero.y - 24, hero.x + 9, hero.y];
        for (const e of game.enemies) {
          if (e.hp <= 0 || e.rank !== "minion" || e.air || !boxHit(reach, enemyBox(e))) continue;
          dealDamage(e, progress.stats.ad * 0.2, {
            fromX: hero.x,
            kx: Math.sign(e.x - hero.x || hero.face) * BUMP,
            stagger: COMBO.stagger,
          });
        }
      }
      const parade = !!v.parade && tier() >= 4;
      if (!parade && !(v.footfall && event.downbeat)) return;
      const r = withCharms("area", parade ? PARADE : FOOTFALL);
      soundRing(hero.x, hero.y, r, { damage: progress.stats.ad * Math.max(v.footfall ?? 0, 0.4), stagger: true });
    },
  },
};
