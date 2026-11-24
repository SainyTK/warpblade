import { POSES } from "../../../../constants/hero";
import { dealDamage } from "../../../../game/damage";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { ghostCanvas } from "../../../../game/hero/afterimages";
import { drawHeroSprite } from "../../../../game/hero/look";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { fxRng, game, hero, particles, progress, rng } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { HOT_BLAST, TRIGGER } from "../../constants/chamber";
import { GUNSMOKE, PHOSPHOR } from "../../constants/colors";
import { blastFoe } from "../blastFoe";
import { SLASHES } from "../moves/slashes";

const ID = "ca_double";
/** the double stands this far from the foe on Calder's side of it, and fires its rounds this far apart */
const DOUBLE = { gap: 14, first: 0.22, between: 0.16, life: 0.45 } as const;

interface DoubleMemory {
  cd: number;
}
const memoryOf = (m: SkillMemory): DoubleMemory => m as unknown as DoubleMemory;

/** a double of gunsmoke beside the foe: it rises in smoke, cuts, fires its rounds into the foe and drifts away */
function createDouble(foe: Enemy, side: number): Effect {
  const v = skillValues(ID);
  const o = { t: 0, fired: 0 };
  const [fx] = enemyCenter(foe);
  const x = fx - side * DOUBLE.gap;
  const y = foe.y;
  const shots = v.shots;
  drawHeroSprite(ghostCanvas, POSES.dodge, 0);
  game.ghosts.push({
    s: ghostCanvas.snapshot(),
    x,
    y,
    flip: side < 0,
    life: DOUBLE.life + shots * DOUBLE.between,
    max: DOUBLE.life + shots * DOUBLE.between,
  });
  for (let i = 0; i < 8; i++)
    particles.spawn(
      PK.SMOKE,
      x + fxRng.range(-5, 5),
      y - fxRng.range(2, 28),
      fxRng.range(-10, 10),
      fxRng.range(-20, -5),
      fxRng.range(0.4, 0.8),
      {
        col: GUNSMOKE,
      },
    );
  if (v.cut) {
    game.fx.push(createSlash(x, y, side, { ...SLASHES.hew, ramp: PHOSPHOR }));
    dealDamage(foe, progress.stats.ad * v.cut, { fromX: x, kx: side * 20, ky: -20, source: ID });
  }
  return {
    update(dt) {
      o.t += dt;
      while (o.fired < shots && o.t >= DOUBLE.first + o.fired * DOUBLE.between) {
        o.fired++;
        if (foe.hp <= 0) return false;
        const hot = !!v.hot || skillEvolved(ID);
        blastFoe(foe, {
          damage: progress.stats.ad * TRIGGER.blast * v.power * (hot ? HOT_BLAST : 1),
          splash: v.splash ? progress.stats.ad * v.splash : 0,
          reach: TRIGGER.reach,
          kx: side * 30,
          hot,
          source: ID,
        });
      }
      return o.fired < shots;
    },
    draw() {},
  };
}

/** Smoke Double: a Trigger may call doubles of gunsmoke beside its foe that fire the same round again */
export const smokeDouble: SkillBehavior = {
  create: () => ({ cd: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
  },
  on: {
    calderTrigger(memory, event) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (!event.foe || event.foe.hp <= 0 || m.cd > 0 || !rng.chance(v.chance)) return;
      m.cd = v.cooldown;
      game.fx.push(createDouble(event.foe, hero.face));
      if (v.doubles > 1) game.fx.push(createDouble(event.foe, -hero.face));
    },
  },
};
