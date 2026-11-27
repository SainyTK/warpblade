import { KEEN_RAMP } from "../../../../constants/combo";
import { PAL } from "../../../../constants/palette";
import { GROUND } from "../../../../constants/stage";
import { nativeOrDrill } from "../../../../drill";
import { clampStageX } from "../../../../game/adventure";
import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createImpact } from "../../../../game/effects/impact";
import { createSlash } from "../../../../game/effects/slash";
import { createWarpLine } from "../../../../game/effects/warpLine";
import { enemyBox, enemyCenter, walks } from "../../../../game/enemies/enemy";
import { skillFx } from "../../../../game/skillFx";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, hero, lights, progress } from "../../../../game/state";
import { hitStop, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import type { KaelMoveId } from "../../types/moves";
import { createEcho } from "../effects/echo";
import { showPhantom } from "../phantom";
import { holdRiposte } from "../riposte";
import { copyPower } from "./copyPower";

const ID = "k_mirror";
/** how far the knight looks for foes, the seconds between its warps, how long it shows, and how near where a parried
 *  blow came from its attacker stands */
const KNIGHT = { reach: 160, gap: 0.12, show: 0.35, attacker: 40 } as const;
const KNIGHT_SLASH = { cx: 2, cy: -20, R: 24, sy: 0.55, rot: -0.4, a0: -2.5, a1: 0.9, W: 9, hold: 0.05, trail: 0.24 };
/** Perfect Reflection: how long the world stands still */
const REFLECT_SLOW = 0.6;

interface KnightMemory {
  cd: number;
  /** foes the knight still warps to, and seconds to the next */
  queue: Enemy[];
  next: number;
  /** where the knight last stood */
  x: number;
  y: number;
  /** seconds it stays beside Kael to copy his blows */
  stay: number;
}

const memoryOf = (m: SkillMemory): KnightMemory => m as unknown as KnightMemory;

/** the knight warps to the far side of a foe and strikes it */
function warpStrike(m: KnightMemory, foe: Enemy): void {
  const v = skillValues(ID);
  const box = enemyBox(foe);
  const side = Math.sign(foe.x - m.x) || hero.face;
  const x = clampStageX(side > 0 ? box[2] + 9 : box[0] - 9, 8);
  const y = walks(foe) ? foe.y : Math.min(GROUND, enemyCenter(foe)[1] + 18);
  game.fx.push(createWarpLine(m.x, m.y - 18, x, y - 18));
  showPhantom(x, y, -side, KNIGHT.show);
  game.fx.push(createSlash(x, y, -side, KNIGHT_SLASH));
  const [ex, ey] = enemyCenter(foe);
  skillFx(
    ID,
    "slash",
    { x: x - side * 4, y: y - 18, face: -side, reach: 18 },
    { damage: progress.stats.ad * v.strike },
  );
  skillFx(ID, "trail", { x: m.x, y: m.y - 18, face: side, toX: x, toY: y - 18 }, { quiet: true });
  game.fx.push(createImpact(ex, ey, -side, true));
  dealDamage(foe, progress.stats.ad * v.strike, {
    fromX: x,
    kx: -side * 80,
    ky: -60,
    heavy: true,
    stun: v.stun,
    source: ID,
  });
  sfx.warp();
  m.x = x;
  m.y = y;
}

/** Perfect Reflection: the world stands still while Kael and the knight strike the attacker and every foe near */
function reflect(): void {
  const v = skillValues(ID);
  const reach = withBuild("area", v.reflectReach);
  const foes = foesOnScreen().filter((e) => Math.abs(enemyCenter(e)[0] - hero.x) <= reach);
  const attacker = foes.sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))[0];
  game.slow = Math.max(game.slow, REFLECT_SLOW);
  game.fx.push(createFloorRing(hero.x, hero.y, reach, KEEN_RAMP, 0.6));
  lights.add(hero.x, hero.y - 18, reach, PAL.crystal[4], 1, 0.5);
  lights.add(hero.x, hero.y - 18, 24, WHITE, 0.9, 0.15);
  for (const e of foes) {
    const [ex, ey] = enemyCenter(e);
    const side = Math.sign(ex - hero.x) || 1;
    showPhantom(ex + side * 12, walks(e) ? e.y : Math.min(GROUND, ey + 18), -side, 0.5);
    game.fx.push(createSlash(ex, ey + 20, -side, { ...KNIGHT_SLASH, ramp: KEEN_RAMP }));
    skillFx(
      ID,
      "slash",
      { x: ex + side * 8, y: ey, face: -side, reach: 20 },
      { damage: progress.stats.ad * v.reflect, quiet: e !== attacker },
    );
    dealDamage(e, progress.stats.ad * (e === attacker ? v.reflect : v.reflectArea), {
      fromX: ex + side * 12,
      kx: side * 60,
      ky: -60,
      heavy: true,
      source: ID,
    });
  }
  hitStop(0.16);
  shake(0.4, 4);
}

/** the foe a parried blow came from, nearest that side of Kael */
function attackerNear(fromX: number): Enemy | null {
  return (
    foesOnScreen()
      .filter((e) => Math.abs(e.x - fromX) <= KNIGHT.attacker)
      .sort((a, b) => Math.abs(a.x - fromX) - Math.abs(b.x - fromX))[0] ?? null
  );
}

/** a parry or a perfect dodge calls the knight: it warp-strikes the attacker first (a parry's), then the nearest foes;
 *  as Perfect Reflection the world stands still instead */
function summon(m: KnightMemory, evolved: boolean, attacker: Enemy | null): void {
  const v = skillValues(ID);
  if (m.cd > 0) return;
  m.cd = withBuild("cooldown", v.cooldown);
  if (v.stay) m.stay = withBuild("duration", v.stay);
  if (evolved) {
    reflect();
    return;
  }
  m.x = hero.x;
  m.y = hero.y;
  const near = foesOnScreen()
    .filter((e) => e !== attacker && Math.abs(e.x - hero.x) <= KNIGHT.reach)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
  m.queue = (attacker ? [attacker, ...near] : near).slice(0, v.targets);
  m.next = 0;
}

/** Mirror Knight: a parry or a perfect dodge calls a mirror knight that warp-strikes the nearest foes; later it stays and copies
 *  Kael's blows; as Perfect Reflection the world stands still while both strike everything near */
const knight: SkillBehavior = {
  create: () => ({ cd: 0, queue: [], next: 0, x: 0, y: 0, stay: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.stay = Math.max(0, m.stay - dt);
    if (!m.queue.length) return;
    m.next -= dt;
    if (m.next > 0) return;
    m.next = KNIGHT.gap;
    const foe = m.queue.shift();
    if (foe && foe.hp > 0) warpStrike(m, foe);
  },
  on: {
    perfectDodge(memory, _ev, state) {
      summon(memoryOf(memory), state.evolved, null);
    },
    parry(memory, ev, state) {
      summon(memoryOf(memory), state.evolved, attackerNear(ev.fromX));
    },
    blow(memory, ev) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (m.stay <= 0 || !v.copy || ev.source !== "attacks" || !ev.melee || ev.foe.hp <= 0) return;
      const side = Math.sign(ev.foe.x - hero.x) || hero.face;
      const box = enemyBox(ev.foe);
      const x = side > 0 ? box[2] + 9 : box[0] - 9;
      showPhantom(x, walks(ev.foe) ? ev.foe.y : hero.y, -side, KNIGHT.show);
      const [cx, cy] = enemyCenter(ev.foe);
      skillFx(ID, "slash", { x: cx + side * 6, y: cy, face: -side, reach: 14 }, { quiet: true, delay: 0.08 });
      game.fx.push(createEcho(ev.foe, progress.stats.ad * copyPower(ev.move as KaelMoveId | null) * v.copy, -side, ID));
    },
  },
};

const drillKnight: SkillBehavior = {
  ...knight,
  on: {
    ...knight.on,
    perfectDodge(memory, ev, state) {
      holdRiposte(0, 0);
      knight.on?.perfectDodge?.(memory, ev, state);
    },
  },
};

export const mirrorKnight: SkillBehavior = nativeOrDrill(knight, drillKnight);
