import { ENEMIES } from "../../../constants/enemies";
import { QUAKE_SKILL } from "../../../constants/hulda/ultimates";
import { HERO_COLORS as HC } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import { glow, place, px } from "../../../engine/frame";
import { blit, detailCanvas } from "../../../engine/sprite";
import { sfx } from "../../../services/audio";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createQuakeLine } from "../../effects/quakeLine";
import { enemyCenter } from "../../enemies/enemy";
import { drawHero } from "../../hero/drawHero";
import { inIron } from "../../hero/hulda/fury";
import { hulda } from "../../hero/hulda/memory";
import { heroLook } from "../../hero/look";
import { skin } from "../../hero/skin";
import { game, hero, progress } from "../../state";
import { shake } from "../../world";
import { skillValues } from "../query";

const ID = "h_quakeDrop";

const sheen = detailCanvas(80, 76, 40, 62);

interface IronMemory {
  quakeCd: number;
}

const memoryOf = (m: SkillMemory): IronMemory => m as unknown as IronMemory;

/** a crack each way along her floor from a struck foe that strikes every foe on it for `power` */
function quake(x: number, power: number): void {
  game.fx.push(
    createQuakeLine({
      x,
      floor: hero.y,
      ends: [clamp(x - QUAKE_SKILL.blowReach, 6, W - 6), clamp(x + QUAKE_SKILL.blowReach, 6, W - 6)],
      ramp: skin.ramp,
      delay: 0,
      slam() {
        shake(0.15, 2);
        sfx.boom();
      },
      strike(e) {
        const minion = ENEMIES[e.type].launchable;
        dealDamage(e, progress.stats.ad * power, { source: ID, fromX: x, kx: 0, launch: minion ? -200 : undefined });
      },
    }),
  );
}

/** a steel sheen over her whole body and her plates lit while iron lasts */
function drawIron(): void {
  drawHero(sheen, hero.pose, heroLook(2));
  const pulse = 0.25 + 0.1 * Math.sin(hulda.ironT * 12);
  blit(sheen, hero.x, hero.y, hero.face < 0, { alpha: pulse, tint: HC.steelGlint, tintAmount: 0.85, soft: true });
  place();
  const sx = hero.x - hero.face * 2;
  for (let i = 0; i < 3; i++) px(sx + i * hero.face, hero.y - 24 + i, HC.steelGlint, 0.9);
  glow(hero.x, hero.y - 18, 22, HC.steelLight, 0.18);
}

/**
 * Quake Drop in play: while the iron the drop leaves lasts, she shows a steel sheen and, from the skill's seventh
 * level, every blow she lands cracks the floor round the foe. The drop itself is cast in src/game/ultimates/quakeDrop.ts.
 */
export const quakeDrop: SkillBehavior = {
  create: () => ({ quakeCd: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.quakeCd = Math.max(0, m.quakeCd - dt);
  },
  draw() {
    if (inIron()) drawIron();
  },
  on: {
    blow(memory, event) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (!inIron() || !v.quake || event.source !== "attacks" || m.quakeCd > 0) return;
      m.quakeCd = QUAKE_SKILL.quakeGap;
      quake(enemyCenter(event.foe)[0], v.quake);
    },
  },
};
