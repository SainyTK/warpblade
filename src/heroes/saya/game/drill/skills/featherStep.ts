import { drillFighter } from "../../../../../drill";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { game, hero, progress } from "../../../../../game/state";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { createInkBurst } from "../../effects/inkBurst";
import { createInkWave } from "../../effects/inkWave";
import { sayaFx } from "../../skillFx";
import { foesNear, skillStrike } from "../targets";

const feather = { kicking: false, boosted: false, rising: false };
rememberPerSeat(hostMemory(feather));
const KICK_REACH = 30;

function cutAround(power: number): void {
  sayaFx(SKILL.breath, { x: hero.x, y: hero.y, face: hero.face }, { damage: progress.stats.ad * (1 + power) });
  game.fx.push(createInkBurst(hero.x, hero.y - 16, [0.9, -0.9], false));
  for (const foe of foesNear(hero.x, hero.y - 16, KICK_REACH)) {
    skillStrike(foe, power, SKILL.breath);
  }
}

export const FEATHER_STEP_DRILL: SayaDrillSkill = {
  id: SKILL.breath,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
    m.airSlashes += values.air ?? 0;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const kicking = h.wallLock > 0;
    const boosted = h.jumpBoost;
    const rising = !h.grounded && h.vy < 0;
    if (kicking && !feather.kicking) {
      cutAround(values.kick);
      if (values.refresh) {
        h.airDashes = Math.max(h.airDashes, 1);
      }
    }
    if (boosted && !feather.boosted && values.dashJump) {
      cutAround(values.kick);
    }
    if (rising && !feather.rising && !kicking && !boosted) {
      sayaFx(
        SKILL.breath,
        { x: h.x, y: h.y, face: h.face },
        { damage: progress.stats.ad * (1 + (evolved ? values.crescent : 0)) },
      );
    }
    if (evolved && rising && !feather.rising) {
      const power = progress.stats.ad * values.crescent;
      game.fx.push(createInkWave(hero.x + hero.face * 8, hero.y, hero.face, { now: power * 0.3, store: power }));
    }
    feather.kicking = kicking;
    feather.boosted = boosted;
    feather.rising = rising;
  },
};
