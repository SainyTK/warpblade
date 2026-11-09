import { PAL } from "../../../constants/palette";
import { glow, place } from "../../../engine/frame";
import { PK } from "../../../types/particle";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { wennaHost } from "../../hero/wenna/memory";
import { game, particles, rng } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "w_kindle";
/** Bonfire: how long it burns, how wide, and how much faster Wicks bite in it */
const BONFIRE = { life: 3, half: 26, rate: 2 } as const;

/** Chain Kindle's Bonfire: a Kindle leaves a fire on the floor where her Wicks bite twice as fast */
export const bonfireSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    kindle(_m, event) {
      if (!skillValues(ID).bonfire) return;
      const life = withCharms("duration", BONFIRE.life);
      wennaHost.zones.push({ x: event.x, y: event.y, half: BONFIRE.half, rate: BONFIRE.rate, left: life });
      let t = 0;
      game.fx.push({
        update(dt) {
          t += dt;
          if (rng.chance(0.7))
            particles.spawn(
              PK.FIRE,
              event.x + rng.range(-BONFIRE.half, BONFIRE.half) * 0.6,
              event.y - 1,
              0,
              -rng.range(15, 35),
              0.4,
              {
                size: rng.range(1, 2),
              },
            );
          return t < life;
        },
        drawBack() {
          place();
          glow(event.x, event.y - 4, BONFIRE.half, PAL.wick[3], 0.25 * Math.min(1, (life - t) * 2));
        },
        draw() {},
      });
    },
  },
};
