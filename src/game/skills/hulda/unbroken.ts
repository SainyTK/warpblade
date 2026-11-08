import { ENEMIES } from "../../../constants/enemies";
import { HERO_COLORS as HC } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import { glow, place, px } from "../../../engine/frame";
import { blit, detailCanvas } from "../../../engine/sprite";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createQuakeLine } from "../../effects/quakeLine";
import { enemyCenter } from "../../enemies/enemy";
import { drawHero } from "../../hero/drawHero";
import { inIron } from "../../hero/hulda/fury";
import { hulda } from "../../hero/hulda/memory";
import { heroLook } from "../../hero/look";
import { skin } from "../../hero/skin";
import { game, hero, progress } from "../../state";
import { castQuakeDrop } from "../../ultimates/quakeDrop";
import { dust, shake } from "../../world";
import { skillValues } from "../query";
import { nearestFoe } from "../targets";

const ID = "h_unbroken";
/** a blow's quake runs this far each way; a stride's quake reaches this far */
const QUAKE_REACH = 40;
const STEP_REACH = 30;
/** a foe that strikes her in iron is knocked down this long, if it stands this near the blow's side */
const KNOCK = { stun: 0.8, near: 40 } as const;
/** seconds between two blow quakes, so one blow on several foes cracks the floor once */
const QUAKE_GAP = 0.2;

const sheen = detailCanvas(80, 76, 40, 62);

interface IronMemory {
  /** iron was on last step, to catch the moment it ends */
  was: boolean;
  /** the half stride the last step was in, to quake on each footfall */
  stride: number;
  quakeCd: number;
}

const memoryOf = (m: SkillMemory): IronMemory => m as unknown as IronMemory;

const minion = (e: Enemy): boolean => ENEMIES[e.type].launchable;

/** a crack each way along her floor that strikes every foe on it for `power` */
function quake(x: number, reach: number, power: number): void {
  game.fx.push(
    createQuakeLine({
      x,
      floor: hero.y,
      ends: [clamp(x - reach, 6, W - 6), clamp(x + reach, 6, W - 6)],
      ramp: skin.ramp,
      delay: 0,
      slam() {
        shake(0.15, 2);
        sfx.boom();
      },
      strike(e) {
        dealDamage(e, progress.stats.ad * power, { source: ID, fromX: x, kx: 0, launch: minion(e) ? -200 : undefined });
      },
    }),
  );
}

/** Iron Titan: each footfall quakes the floor round her feet */
function stride(m: IronMemory): void {
  const half = Math.floor(hero.runPhase * 2);
  if (half === m.stride) return;
  m.stride = half;
  if (!hero.ground || Math.abs(hero.vx) < 5) return;
  const v = skillValues(ID);
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.air) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.abs(cx - hero.x) > STEP_REACH || cy < hero.y - 40) continue;
    dealDamage(e, progress.stats.ad * v.steps, { source: ID, fromX: hero.x, kx: Math.sign(cx - hero.x) * 60 });
  }
  game.fx.push(createFloorRing(hero.x, hero.y, STEP_REACH, skin.ramp, 0.3));
  dust(hero.x, hero.y, 4);
  shake(0.08, 1);
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
 * Unbroken in play: while iron lasts, every blow she lands quakes the floor, foes that strike her are knocked down and, as Iron
 * Titan, every footfall quakes; when the iron ends it can finish in a level 1 Quake Drop. The form itself is cast in
 * src/game/ultimates/unbroken.ts.
 */
export const unbroken: SkillBehavior = {
  create: () => ({ was: false, stride: 0, quakeCd: 0 }),
  update(memory, state, dt) {
    const m = memoryOf(memory);
    m.quakeCd = Math.max(0, m.quakeCd - dt);
    const iron = inIron();
    if (m.was && !iron && skillValues(ID).finale) castQuakeDrop(1);
    m.was = iron;
    if (iron && state.evolved) stride(m);
  },
  draw() {
    if (inIron()) drawIron();
  },
  on: {
    blow(memory, event) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (!inIron() || !v.quake || event.source !== "attacks" || m.quakeCd > 0) return;
      m.quakeCd = QUAKE_GAP;
      quake(enemyCenter(event.foe)[0], QUAKE_REACH, v.quake);
    },
    hurt(_memory, event) {
      if (!inIron() || !skillValues(ID).knock) return;
      const foe = nearestFoe(event.fromX, hero.y - 14);
      if (!foe || Math.abs(foe.x - event.fromX) > KNOCK.near) return;
      foe.stun = Math.max(foe.stun, KNOCK.stun);
      foe.vx += Math.sign(foe.x - hero.x) * 80;
    },
  },
};
