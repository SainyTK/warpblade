import { game, lights, progress } from "../../../../game/state";
import { shake } from "../../../../game/world";
import type { SkillCast } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { TIER_EFFECT } from "../../constants/drill/statuses";
import { DUSK_RAMP, NIGHT_RAMP } from "../../look/colors";
import { createDuskWave } from "../effects/duskWave";
import { dance } from "./dance";
import { foesAhead, foesNear } from "./strike";

const WAVE = { speed: 260, life: 0.6, spread: 12 } as const;

function crossingWaves(x: number, y: number, face: number, damage: number): void {
  const struck = new Set<Enemy>();
  const common = {
    x: x + face * 6,
    face,
    damage,
    speed: WAVE.speed,
    life: WAVE.life,
    struck,
    source: "ultimate" as const,
  };
  game.fx.push(createDuskWave({ ...common, y: y - WAVE.spread, rise: 0.16, half: 12 }));
  game.fx.push(createDuskWave({ ...common, y: y + WAVE.spread * 0.4, rise: -0.16, half: 12, ramp: NIGHT_RAMP }));
}

export function releaseWaltz({ tier, x, y, face }: SkillCast, power: number): void {
  const blow = (tier.damage / 10) * progress.stats.ap * power;
  const height = y - 18;
  lights.add(x, height, 40 + tier.level * 10, DUSK_RAMP[4], 0.9, 0.4);
  if (tier.level <= 2) {
    crossingWaves(x, height, face, blow * TIER_EFFECT.waveShare);
    if (tier.around) {
      crossingWaves(x, height, -face, blow * TIER_EFFECT.waveShare);
    }
    return;
  }
  const foes = tier.level === 3 ? foesAhead(x, y, face, tier.reach, tier.height) : foesNear(x, height, tier.reach);
  dance(foes.slice(0, 8), tier.level - 1, blow * TIER_EFFECT.danceShare, "ultimate");
  if (tier.level === 4) {
    crossingWaves(x, height, face, blow * TIER_EFFECT.waveShare);
    crossingWaves(x, height, -face, blow * TIER_EFFECT.waveShare);
    shake(0.3, 3);
  }
}
