import { DIAL } from "../../../../constants/mirel/look";
import { PAL, SPARKS } from "../../../../constants/palette";
import { fleck, place } from "../../../../engine/frame";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { TAU } from "../../../../utils/math";
import { dealDamage } from "../../../damage";
import { createImpact } from "../../../effects/impact";
import { enemyBox, enemyCenter } from "../../../enemies/enemy";
import { skillValues, withCharms } from "../../../skills/query";
import { foesOnScreen } from "../../../skills/targets";
import { game, hero, lights, progress } from "../../../state";
import { shake } from "../../../world";
import { type Dial, dialArc, dialMark } from "../clockArt";
import { isStill } from "../strike";
import { drawFlyingHand } from "../trinkets";
import { pressSpell } from "./castSpell";

const ID = "m_foretell";
/** seconds a blade takes to fall from above the foe */
const FALL = 0.12;
/** pixels above the foe the blade appears */
const DROP = 56;
/** the falling hand's length */
const HAND = 11;

/** a blade lands on its foe, and its ring on the foes beside it */
function land(e: Enemy, others: readonly Enemy[]): void {
  const v = skillValues(ID);
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, progress.stats.ap * v.power, { fromX: cx, ky: 60, stun: v.stun || undefined, source: "abilities" });
  if (v.ring) {
    const ring = withCharms("area", v.ring);
    for (const o of others) {
      if (o === e || o.hp <= 0) continue;
      const [ox, oy] = enemyCenter(o);
      if (Math.hypot(ox - cx, oy - cy) <= ring)
        dealDamage(o, progress.stats.ap * v.splash, { fromX: cx, kx: Math.sign(ox - cx) * 50, source: "abilities" });
    }
  }
  game.fx.push(createImpact(cx, cy, 1, true, SPARKS.hour));
  lights.add(cx, cy, 30, PAL.hour[3], 0.5, 0.18);
}

/** the foes Foretell marks: the nearest few, or with Prophecy every foe on screen */
function marked(): Enemy[] {
  const v = skillValues(ID);
  const all = foesOnScreen().filter((e) => e.hp > 0);
  if (v.prophecy) return all;
  return all.sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x)).slice(0, v.count ?? 3);
}

/** marks over the foes, then a teal blade falls on each where it stands; Prophecy's blades land twice on still foes */
function createForetell(foes: readonly Enemy[]): Effect {
  const v = skillValues(ID);
  const delay = v.delay ?? 1.2;
  const twice = !!v.prophecy;
  let t = 0;
  let landed = 0;
  return {
    update(dt) {
      t += dt;
      const round = t >= delay + FALL ? 1 : 0;
      const second = twice && t >= delay + FALL * 3 ? 1 : 0;
      while (landed < round + second) {
        const again = landed === 1;
        for (const e of foes) if (e.hp > 0 && (!again || isStill(e))) land(e, game.enemies);
        shake(0.1, 1.5);
        sfx.hit(true, 1.2);
        landed++;
      }
      return t < delay + FALL * (twice ? 4 : 2);
    },
    draw() {
      place();
      for (const e of foes) {
        if (e.hp <= 0) continue;
        const [cx] = enemyCenter(e);
        const top = enemyBox(e)[1] - 4;
        if (t < delay) {
          const k = 1 - t / delay;
          const r = 2 + k * 3;
          // the mark of what is to come: a fine ring closing on the spot, with a mark at each quarter
          const dial: Dial = { x: cx, y: top, r, a: 1, floor: Number.POSITIVE_INFINITY };
          dialArc(dial, r, 0, TAU, DIAL.hour, 1);
          for (let q = 0; q < 4; q++) dialMark(dial, (q * TAU) / 4, r, r + 1.5, DIAL.quarter, 1);
          fleck(cx, top, DIAL.hub);
          continue;
        }
        const u = Math.min(1, (t - delay) / FALL);
        const tip = top - DROP * (1 - u);
        drawFlyingHand(cx, tip, 0, 1, HAND);
      }
    },
  };
}

/** I with Foretell */
export const pressForetell = (): boolean => pressSpell(ID);

/** the marks go out on the cast's frame */
export function castForetell(): void {
  const foes = marked();
  if (foes.length) game.fx.push(createForetell(foes));
}
