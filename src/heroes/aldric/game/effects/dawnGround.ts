import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import { grain } from "../../../../utils/grain";
import { PILLAR } from "../../constants/abilities";
import { DAWN_RAMP } from "../../constants/light";
import { DAWN_PULSE } from "../../constants/skillNumbers";
import { createSunPillar } from "../abilities/pillar";
import { foesIn } from "../strike";

/** seconds between burns */
const EVERY = 0.5;

/**
 * Burning light on the floor (Lingering Dawn and the skills that leave it): foes standing in it burn every half
 * second, and with Lingering Dawn's later levels their feet are held, Aldric heals standing in it, and as High Noon
 * a small pillar falls on a foe in it each second. Motes of light rise from it until it fades.
 */
export function createDawnGround(x: number, width: number, time: number, perSecond: number): Effect {
  let t = 0;
  let next = EVERY;
  let pulse = DAWN_PULSE.every;
  const half = width / 2;
  return {
    update(dt) {
      t += dt;
      const v = skillValues("al_dawn");
      const inside = foesIn([x - half, GROUND - 40, x + half, GROUND + 2], x);
      if (v.halt) for (const e of inside) e.halt = Math.max(e.halt, dt * 2);
      if (v.heal && hero.ground && Math.abs(hero.x - x) <= half)
        hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * v.heal * dt);
      if (t >= next) {
        next += EVERY;
        for (const e of inside) dealDamage(e, perSecond * EVERY, { source: "al_dawn", dot: true, fromX: x });
      }
      pulse -= dt;
      if (pulse <= 0 && skillEvolved("al_dawn") && inside.length) {
        pulse = DAWN_PULSE.every;
        game.fx.push(
          createSunPillar({
            x: inside[0].x,
            delay: DAWN_PULSE.delay,
            damage: progress.stats.ap * PILLAR.power * DAWN_PULSE.share * (v.pulse ?? 1),
            stun: 0,
            half: DAWN_PULSE.half,
            source: "al_dawn",
          }),
        );
      }
      return t < time;
    },
    draw() {
      place();
      const k = Math.min(1, (time - t) / 0.4);
      hairline(x - half, GROUND, x + half, GROUND, DAWN_RAMP[4], 0.7 * k);
      hairline(x - half * 0.7, GROUND - 0.5, x + half * 0.7, GROUND - 0.5, DAWN_RAMP[5], 0.5 * k);
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.7 + grain(i, 7)) % 1;
        fleck(x - half + grain(i, 3) * width, GROUND - u * 14, DAWN_RAMP[u < 0.5 ? 5 : 4], k * (1 - u));
      }
      glow(x, GROUND - 3, half, DAWN_RAMP[3], 0.25 * k);
    },
  };
}
