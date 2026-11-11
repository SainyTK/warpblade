import { COMBO } from "../../../constants/combat";
import { PAL, SPARKS } from "../../../constants/palette";
import { GROUND, W } from "../../../constants/stage";
import { fleck, glow, hairline, place, polygon, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { hex, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { createAccentRing } from "../../effects/jory/accentRing";
import { enemyCenter, walks } from "../../enemies/enemy";
import { beatShare, tier } from "../../hero/jory/beat";
import { jory } from "../../hero/jory/memory";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { shake } from "../../world";
import { skillValues } from "../query";
import { distance2, nearestFoe } from "../targets";

const ID = "j_metronome";
/** it lands this far beside its foe, falls from this high this fast, and strikes foes this near */
const DROP = { beside: 12, from: 70, gravity: 900, reach: 70, knock: 30 } as const;
/** its pyramid body: height, half its base and half its top in px */
const BODY = { tall: 9, base: 4, top: 1 } as const;
/** its arm: length, how far it swings either side in radians, and the pivot's height above the floor */
const ARM = { length: 9, swing: 0.55, pivot: 2 } as const;
/** seconds it takes to fade once its beats are spent, and its strike flash */
const LOOK = { fade: 0.4, flash: 0.15 } as const;
/** a Crescendo tier: the Conductor holds it while he stays there */
const CRESCENDO = 4;
/** dark iron, its lit edge, and the pewter face */
const IRON = { dark: hex("#1c1e24"), body: hex("#34373f"), edge: hex("#565a64") } as const;
const PEWTER = { face: hex("#8c929a"), glint: hex("#c4c9cf") } as const;

interface Metronome {
  x: number;
  /** where it stands, and how high above that it still is while it falls */
  floor: number;
  height: number;
  vy: number;
  landed: boolean;
  /** the foe it was dropped beside */
  foe: Enemy | null;
  beats: number;
  /** the side the arm ticked to on the last beat, seconds since then, since its last strike, and since it ran out */
  side: number;
  struck: number;
  gone: number;
}

interface MetronomeMemory {
  metronome: Metronome | null;
}

const memoryOf = (m: SkillMemory): MetronomeMemory => m as unknown as MetronomeMemory;

/** it stays while it has beats, or while the Conductor holds it at Crescendo */
const standing = (m: Metronome): boolean => m.beats > 0 || (skillValues(ID).conductor > 0 && tier() >= CRESCENDO);

/** drop a metronome on the far side of the foe nearest him, clear of him, or beside him when no foe stands */
function drop(): Metronome {
  const foe = nearestFoe(hero.x, hero.y - 10);
  const side = foe ? Math.sign(foe.x - hero.x) || 1 : hero.face;
  const x = clamp((foe ? foe.x : hero.x) + side * DROP.beside, 8, W - 8);
  const floor = foe && walks(foe) ? foe.y : foe ? GROUND : hero.y;
  return {
    x,
    floor,
    height: DROP.from,
    vy: 0,
    landed: false,
    foe,
    beats: skillValues(ID).beats,
    side: 1,
    struck: 1,
    gone: 0,
  };
}

/** it lands: a ring of dust on the floor and a little shake */
function land(m: Metronome): void {
  m.landed = true;
  m.height = 0;
  game.fx.push(createFloorRing(m.x, m.floor, 16, PAL.beat, 0.35));
  shake(0.1, 1.5);
  for (let i = 0; i < 6; i++) {
    const s = rng.chance(0.5) ? 1 : -1;
    particles.spawn(PK.DUST, m.x + s * rng.range(2, 6), m.floor - 1, s * rng.range(20, 50), -rng.range(10, 30), 0.4);
  }
}

/** the foe it strikes: the one it was dropped beside, else the nearest to it in reach */
function targetOf(m: Metronome): Enemy | null {
  if (m.foe && m.foe.hp > 0) return m.foe;
  const e = nearestFoe(m.x, m.floor - 6);
  m.foe = e && distance2(e, m.x, m.floor - 6) <= DROP.reach ** 2 ? e : null;
  return m.foe;
}

/** one beat: the arm ticks to its other side and it strikes its foe */
function strike(m: Metronome): void {
  m.side = -m.side;
  const e = targetOf(m);
  if (!e) return;
  const v = skillValues(ID);
  const [ex, ey] = enemyCenter(e);
  const dir = Math.sign(ex - m.x) || 1;
  m.struck = 0;
  dealDamage(e, progress.stats.ad * v.power, {
    fromX: m.x,
    kx: dir * DROP.knock,
    stagger: v.stagger ? COMBO.stagger : undefined,
    source: ID,
  });
  game.fx.push(createAccentRing(ex, ey));
  game.fx.push(createImpact(ex, ey, dir, true, SPARKS.beat));
  lights.add(m.x, m.floor - BODY.tall, 20, PAL.beat[3], 0.5, LOOK.flash);
}

/** it falls until it lands, and is gone once faded */
function stand(m: Metronome, dt: number): boolean {
  m.struck += dt;
  if (!m.landed) {
    m.vy += DROP.gravity * dt;
    m.height -= m.vy * dt;
    if (m.height <= 0) land(m);
  }
  if (m.landed && !standing(m)) m.gone += dt;
  return m.gone < LOOK.fade;
}

/**
 * A dark iron pyramid about 9 px tall with a pewter face, its arm swinging from side to side and ticking over on each
 * beat, and a cobalt flash when it strikes
 */
function drawMetronome(m: Metronome): void {
  const show = 1 - m.gone / LOOK.fade;
  if (show <= 0) return;
  const x = Math.round(m.x);
  const y = Math.round(m.floor - m.height);
  const top = y - BODY.tall;
  // its shadow on the floor grows as it nears it
  const near = 1 - clamp(m.height / DROP.from);
  hairline(x - BODY.base * near, m.floor, x + BODY.base * near, m.floor, IRON.dark, 0.7 * show);
  // a dark rim round the iron, so it stands off pale stone
  polygon(
    [
      [x - BODY.base - 1, y + 0.5],
      [x + BODY.base + 2, y + 0.5],
      [x + BODY.top + 2, top - 1],
      [x - BODY.top - 1, top - 1],
    ],
    IRON.dark,
    show,
  );
  polygon(
    [
      [x - BODY.base, y],
      [x + BODY.base + 1, y],
      [x + BODY.top + 1, top],
      [x - BODY.top, top],
    ],
    IRON.body,
    show,
  );
  // the pewter face, a narrow plate set in from the iron's edges, and a lit right edge
  polygon(
    [
      [x - 1.5, y - 1.5],
      [x + 2.5, y - 1.5],
      [x + 1.5, top + 2.5],
      [x - 0.5, top + 2.5],
    ],
    PEWTER.face,
    show,
  );
  hairline(x + BODY.base + 1, y, x + BODY.top + 1, top, IRON.edge, show);
  px(x, top - 1, IRON.edge, show);
  for (let i = 0; i < 3; i++) fleck(x + 0.5, y - 2.5 - i * 1.6, IRON.body, show);
  // the arm swings to the other side over each beat, reaching it as the beat clicks
  const swing = m.landed ? m.side * Math.cos(Math.PI * beatShare()) * ARM.swing : 0;
  const pivotX = x + 0.5;
  const pivotY = y - ARM.pivot;
  const tipX = pivotX + Math.sin(swing) * ARM.length;
  const tipY = pivotY - Math.cos(swing) * ARM.length;
  hairline(pivotX, pivotY, tipX, tipY, PEWTER.glint, show);
  const weight = 0.62;
  px(
    pivotX + Math.sin(swing) * ARM.length * weight - 0.5,
    pivotY - Math.cos(swing) * ARM.length * weight - 0.5,
    IRON.edge,
    show,
  );
  fleck(pivotX, pivotY, PEWTER.glint, show);
  if (m.struck < LOOK.flash) {
    const k = 1 - m.struck / LOOK.flash;
    glow(tipX, tipY, 6, PAL.beat[4], 0.6 * k * show);
    glow(x, y - BODY.tall / 2, 10, PAL.beat[3], 0.4 * k * show);
    fleck(tipX, tipY, WHITE, k * show);
  }
}

/**
 * Iron Metronome: on-beat presses in a row drop an iron metronome beside the nearest foe that strikes it on each of
 * the next beats; with its levels harder, longer, sooner and staggering. Conductor keeps it while Crescendo lasts, and
 * every strike staggers. One stands at a time: a new streak refreshes its beats.
 */
export const ironMetronomeSkill: SkillBehavior = {
  create: () => ({ metronome: null }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    if (m.metronome && !stand(m.metronome, dt)) m.metronome = null;
  },
  draw(memory) {
    place();
    const m = memoryOf(memory).metronome;
    if (m) drawMetronome(m);
  },
  on: {
    beat(memory, event) {
      const v = skillValues(ID);
      if (!event.onBeat || jory.streak <= 0 || jory.streak % v.streak !== 0) return;
      const m = memoryOf(memory);
      if (m.metronome && m.metronome.gone <= 0) m.metronome.beats = Math.max(m.metronome.beats, v.beats);
      else m.metronome = drop();
    },
    tick(memory) {
      const m = memoryOf(memory).metronome;
      if (!m || !m.landed || !standing(m)) return;
      strike(m);
      if (m.beats > 0) m.beats--;
    },
  },
};
