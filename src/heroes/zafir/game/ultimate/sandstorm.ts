import { ULT_LEVELS } from "../../../../constants/ultimate";
import { fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { ultimateValues } from "../../../../game/hero/ultimate";
import { withCharms } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, hero, particles, progress, rng } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { TAU } from "../../../../utils/math";
import { GRAIN, SAND_RAMP } from "../../constants/palette";
import { STORM_CUT, STORM_LOOK, STORM_REACH, STORM_TIME } from "../../constants/storm";
import { sandSound } from "../sound";
import { zafir } from "../state";
import { openWounds } from "../wounds";

/** the storm's grains: each turns round him at its own height, radius and speed; fixed per storm, so drawing reads no rng */
type Grain = readonly [height: number, radius: number, phase: number, speed: number, shade: number];

/**
 * The storm that follows Zafir: every `STORM_CUT.every` it cuts each foe inside it, drags it a little toward him and
 * opens a wound. Its skill makes it larger, longer and harder, adds blades of glass and, evolved, a second storm.
 */
function createStorm(level: number, reach: number, life: number, cut: number): Effect {
  let t = 0;
  let clock = 0;
  const v = ultimateValues();
  const grains: Grain[] = Array.from({ length: STORM_LOOK.grains * (v.grains ?? 1) }, () => [
    rng.range(0, STORM_LOOK.height),
    rng.range(0.35, 1),
    rng.range(0, TAU),
    rng.range(0.7, 1.3),
    rng.int(0, GRAIN.length - 1),
  ]);
  const strike = () => {
    for (const e of foesOnScreen()) {
      const [ex, ey] = enemyCenter(e);
      if (Math.abs(ex - hero.x) > reach || ey < hero.y - STORM_LOOK.height - 10 || ey > hero.y + 6) continue;
      dealDamage(e, cut, { fromX: hero.x, kx: Math.sign(hero.x - ex) * STORM_CUT.pull, source: "ultimate" });
      openWounds(e, STORM_CUT.wounds + (v.wounds ?? 0));
      if (v.blind && e.rank === "minion") e.blind = Math.max(e.blind, STORM_CUT.every * 2);
    }
  };
  const draw = (near: boolean) => {
    place();
    const fade = Math.min(1, (life - t) / 0.4, t / 0.2);
    for (const [h, r, phase, speed, shade] of grains) {
      const a = phase + t * STORM_LOOK.spin * speed;
      if (Math.sin(a) > 0 !== near) continue;
      const rr = reach * r * (0.6 + (0.4 * h) / STORM_LOOK.height);
      const x = hero.x + Math.cos(a) * rr;
      const y = hero.y - h + Math.sin(a) * rr * 0.25;
      fleck(x, y, GRAIN[shade], fade);
      fleck(x - Math.sin(a) * 1.5, y, GRAIN[shade], fade * 0.5);
    }
    if (near) glow(hero.x, hero.y - STORM_LOOK.height * 0.5, reach, SAND_RAMP[3], 0.1 * fade);
  };
  zafir.storm = life;
  zafir.stormLevel = level;
  return {
    update(dt) {
      t += dt;
      clock -= dt;
      zafir.storm = Math.max(0, life - t);
      if (clock <= 0) {
        clock = STORM_CUT.every;
        strike();
      }
      if (rng.chance(0.7))
        particles.spawn(
          PK.DUST,
          hero.x + rng.range(-reach, reach),
          hero.y - 1,
          rng.range(-40, 40),
          -rng.range(10, 40),
          0.6,
          {
            col: GRAIN[3],
            size: 2,
          },
        );
      return t < life && hero.hp > 0;
    },
    drawBack: () => draw(false),
    draw: () => draw(true),
  };
}

/**
 * Sandstorm, Zafir's ultimate: a storm rises round him and follows him for a few seconds while he fights on, longer and
 * wider at each charge level. A foe that stays in it all the way takes `STORM_CUT.share` of the level's power.
 */
export function castSandstorm(level: number): void {
  const v = ultimateValues();
  const life = withCharms("duration", STORM_TIME[level - 1] * (v.time ?? 1));
  const reach = withCharms("area", STORM_REACH[level - 1] * (v.reach ?? 1));
  const cuts = life / STORM_CUT.every;
  const cut = (ULT_LEVELS[level - 1].power * progress.stats.ad * STORM_CUT.share * (v.power ?? 1)) / cuts;
  game.fx.push(createStorm(level, reach, life, cut));
  if (v.twin) game.fx.push(createStorm(level, reach * 1.6, life, cut * v.twin));
  sandSound.gust(0.18);
}
