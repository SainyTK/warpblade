import { ULT_LEVELS } from "../../../../constants/ultimate";
import { fleck, glow, hairline, haze, place, px } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { ultimateValues } from "../../../../game/hero/ultimate";
import { withBuild } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { fxRng, game, hero, particles, progress } from "../../../../game/state";
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
export interface StormTraits {
  grains: number;
  wounds: number;
  blind: boolean;
}

export function createStorm(level: number, reach: number, life: number, cut: number, traits: StormTraits): Effect {
  let t = 0;
  let clock = 0;
  const grains: Grain[] = Array.from({ length: STORM_LOOK.grains * traits.grains }, () => [
    fxRng.range(0, STORM_LOOK.height),
    fxRng.range(0.35, 1),
    fxRng.range(0, TAU),
    fxRng.range(0.7, 1.3),
    fxRng.int(0, GRAIN.length - 1),
  ]);
  const strike = () => {
    for (const e of foesOnScreen()) {
      const [ex, ey] = enemyCenter(e);
      if (Math.abs(ex - hero.x) > reach || ey < hero.y - STORM_LOOK.height - 10 || ey > hero.y + 6) continue;
      dealDamage(e, cut, { fromX: hero.x, kx: Math.sign(hero.x - ex) * STORM_CUT.pull, source: "ultimate" });
      openWounds(e, STORM_CUT.wounds + traits.wounds);
      if (traits.blind && e.rank === "minion") e.blind = Math.max(e.blind, STORM_CUT.every * 2);
    }
  };
  const draw = (near: boolean) => {
    place();
    const fade = Math.min(1, (life - t) / 0.4, t / 0.2);
    // the body of the storm: bands of blown sand turning round him, the far side behind him
    for (let band = 0; band < STORM_LOOK.bands; band++) {
      const h = ((band + 0.5) / STORM_LOOK.bands) * STORM_LOOK.height;
      const rr = reach * (0.55 + (0.45 * h) / STORM_LOOK.height);
      const sway = Math.sin(t * 2.3 + band * 1.7) * 4;
      haze(hero.x + sway, hero.y - h, rr, 8, GRAIN[near ? 1 : 3], (near ? 0.3 : 0.4) * fade);
      // arcs of wind turning round the band
      for (let arc = 0; arc < 3; arc++) {
        const from = t * STORM_LOOK.spin * 1.3 + arc * 2.1 + band;
        for (let step = 0; step < 10; step++) {
          const a = from + step * 0.12;
          if (Math.sin(a) > 0 !== near) continue;
          px(
            hero.x + sway + Math.cos(a) * rr,
            hero.y - h + Math.sin(a) * rr * 0.25,
            GRAIN[near ? 0 : 2],
            fade * (0.4 + step * 0.06),
          );
        }
      }
    }
    for (const [h, r, phase, speed, shade] of grains) {
      const a = phase + t * STORM_LOOK.spin * speed;
      if (Math.sin(a) > 0 !== near) continue;
      const rr = reach * r * (0.6 + (0.4 * h) / STORM_LOOK.height);
      const x = hero.x + Math.cos(a) * rr;
      const y = hero.y - h + Math.sin(a) * rr * 0.25;
      // a grain and the streak it leaves, trailing against its turn
      hairline(x, y, x + Math.sin(a) * 4, y - Math.cos(a), GRAIN[Math.min(GRAIN.length - 1, shade + 1)], fade * 0.7);
      if (shade < 2) px(x, y, GRAIN[shade], fade);
      else fleck(x, y, GRAIN[shade], fade);
    }
    if (near) glow(hero.x, hero.y - STORM_LOOK.height * 0.5, reach, SAND_RAMP[3], 0.14 * fade);
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
      if (fxRng.chance(0.7))
        particles.spawn(
          PK.DUST,
          hero.x + fxRng.range(-reach, reach),
          hero.y - 1,
          fxRng.range(-40, 40),
          -fxRng.range(10, 40),
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
 * wider at each charge level. A foe that stays in the plain storm all the way takes `STORM_CUT.share` of the level's power.
 */
export function castSandstorm(level: number): void {
  const v = ultimateValues();
  const base = STORM_TIME[level - 1];
  const life = withBuild("duration", base * (v.time ?? 1));
  const reach = withBuild("area", STORM_REACH[level - 1] * (v.reach ?? 1));
  // a longer storm keeps each cut as hard, so its skill's longer storms deal more
  const cuts = base / STORM_CUT.every;
  const cut = (ULT_LEVELS[level - 1].power * progress.stats.ad * STORM_CUT.share * (v.power ?? 1)) / cuts;
  const traits = { grains: v.grains ?? 1, wounds: v.wounds ?? 0, blind: !!v.blind };
  game.fx.push(createStorm(level, reach, life, cut, traits));
  if (v.twin) game.fx.push(createStorm(level, reach * 1.6, life, cut * v.twin, traits));
  sandSound.gust(0.18);
}
