import { COMBO } from "../../../constants/combat";
import { PAL, SPARKS } from "../../../constants/palette";
import { blendScreen, glow, line, place, px, toScreenX, toScreenY } from "../../../engine/frame";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { WHITE } from "../../../utils/color";
import { ease } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { createAccentRing } from "../../effects/jory/accentRing";
import { enemyCenter } from "../../enemies/enemy";
import { beatShare } from "../../hero/jory/beat";
import { game, hero, lights, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

const ID = "j_drumCorps";
/** how far a drummer's beat reaches, how fast it walks to its place, and seconds it takes to show and to fade */
const DRUMMER = { reach: 130, follow: 7, show: 0.25, fade: 0.4, knock: 20 } as const;
/** drummers march in a file behind him: the first this far behind, each next one this much further, every other one a
 *  step further from the viewer, and at most this many */
const FILE = { first: -13, apart: 7, slots: 8 } as const;
/** the band takes the first places in the file; called drummers take the next free ones */
const BAND_SIZE = 3;
/** seconds the mallet stays down after a strike before it lifts with the coming beat */
const MALLET_REST = 0.08;

interface Drummer {
  x: number;
  y: number;
  /** its place in the file behind him */
  slot: number;
  /** beats it still strikes; the band never runs out */
  beats: number;
  band: boolean;
  /** seconds since it came, since its last strike, and since it ran out of beats */
  t: number;
  struck: number;
  gone: number;
  face: number;
  phase: number;
}

interface CorpsMemory {
  cd: number;
  drummers: Drummer[];
}

const memoryOf = (m: SkillMemory): CorpsMemory => m as unknown as CorpsMemory;

/** where a place in the file stands from him: px along his facing, and px up the floor away from the viewer */
const placeOf = (slot: number): { dx: number; dy: number } => ({
  dx: FILE.first - FILE.apart * slot,
  dy: slot % 2 ? -1 : 0,
});

/** a new drummer at its place in the file */
function drummer(slot: number, beats: number, band: boolean): Drummer {
  const at = placeOf(slot);
  return {
    x: hero.x + at.dx * hero.face,
    y: hero.y + at.dy,
    slot,
    beats,
    band,
    t: 0,
    struck: 1,
    gone: 0,
    face: hero.face,
    phase: rng.range(0, 1),
  };
}

/** the band marches with him from the moment the skill evolves */
function gatherBand(m: CorpsMemory): void {
  if (m.drummers.some((d) => d.band)) return;
  for (let slot = 0; slot < BAND_SIZE; slot++) m.drummers.push(drummer(slot, Number.POSITIVE_INFINITY, true));
}

/** the nearest place in the file no drummer holds, or -1 when the file is full */
function freeSlot(m: CorpsMemory): number {
  for (let slot = 0; slot < FILE.slots; slot++) if (!m.drummers.some((d) => d.slot === slot)) return slot;
  return -1;
}

/** called by an accented Crash: drummers stand beside him for a few beats */
function call(m: CorpsMemory): void {
  const v = skillValues(ID);
  const n = Math.round(withCharms("amount", v.count));
  const beats = Math.round(withCharms("duration", v.beats));
  m.drummers = m.drummers.filter((d) => d.band || d.beats > 0);
  const called = m.drummers.filter((d) => !d.band);
  for (const d of called) d.beats = Math.max(d.beats, beats);
  for (let i = called.length; i < n; i++) {
    const slot = freeSlot(m);
    if (slot < 0) return;
    m.drummers.push(drummer(slot, beats, false));
  }
}

/** the mallet comes down on the nearest foe in reach */
function strike(d: Drummer): void {
  const e = nearestFoe(d.x, d.y - 6);
  d.struck = 0;
  if (!e) return;
  const [ex, ey] = enemyCenter(e);
  if (Math.abs(ex - d.x) > DRUMMER.reach) return;
  const v = skillValues(ID);
  const dir = Math.sign(ex - d.x) || d.face;
  d.face = dir;
  dealDamage(e, progress.stats.ad * v.power, {
    fromX: d.x,
    kx: dir * DRUMMER.knock,
    stagger: v.stagger ? COMBO.stagger : undefined,
    source: ID,
  });
  game.fx.push(createAccentRing(ex, ey));
  game.fx.push(createImpact(ex, ey, dir, false, SPARKS.beat));
  lights.add(d.x + d.face * 3, d.y - 5, 14, PAL.beat[3], 0.35, 0.12);
}

/** one beat: every drummer with beats left strikes */
function beat(m: CorpsMemory): void {
  for (const d of m.drummers) {
    if (d.beats <= 0) continue;
    strike(d);
    d.beats--;
  }
}

/** it walks to its place beside him, and is gone once faded */
function march(d: Drummer, dt: number): boolean {
  d.t += dt;
  d.struck += dt;
  if (d.beats <= 0) d.gone += dt;
  const at = placeOf(d.slot);
  d.x += (hero.x + at.dx * hero.face - d.x) * Math.min(1, dt * DRUMMER.follow);
  if (hero.ground) d.y += (hero.y + at.dy - d.y) * Math.min(1, dt * DRUMMER.follow);
  if (d.struck > MALLET_REST * 4) d.face = hero.face;
  return d.gone < DRUMMER.fade;
}

/** how far the mallet is raised, 0 down on the drum to 1 high: it rests after a strike, then lifts with the beat */
function lift(d: Drummer): number {
  if (d.struck < MALLET_REST) return 0;
  return ease.outCubic(beatShare());
}

/**
 * A spectral drummer about 10 px tall standing on (x, y), facing right, one string per row from the top and the third
 * column over its feet: a navy outline (o), a cobalt body (b) lit on the side it faces (l), a white eye (w), and a
 * tiny drum at its waist with a white head (h) on a deep shell (d). Its legs take turns as it marches.
 */
const DRUMMER_ART = [
  "..ooo...",
  ".ollwo..",
  "..ooo...",
  ".obblo..",
  ".obblhhh",
  ".obbldDd",
  ".obbloo.",
  "..obo...",
] as const;
const DRUMMER_LEGS = [
  ["..o.o...", ".oo.oo.."],
  ["..oo.o..", "..oo.oo."],
] as const;
/** the color behind each letter of the art: steps of his cobalt, and white */
const DRUMMER_SHADE: Readonly<Record<string, number>> = { o: 1, D: 1, d: 2, b: 3, l: 4, h: 5 };
/** the mallet: its length in px, and its tilt down on the drum and raised high behind the head */
const MALLET = { length: 3, down: -0.3, up: 1.9 } as const;

/** one art pixel laid over what is behind it, so the figure shows the scenery through it */
function ghost(x: number, y: number, c: number, a: number): void {
  blendScreen(toScreenX(x), toScreenY(y), c, a);
}

/** one row of the art at (x, y), mirrored when it faces left */
function drawRow(row: string, x: number, y: number, f: number, a: number): void {
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === ".") continue;
    const cx = x + (i - 3) * f;
    if (ch === "w") ghost(cx, y, WHITE, a);
    else ghost(cx, y, PAL.beat[DRUMMER_SHADE[ch]], ch === "o" || ch === "D" ? a : a * 0.9);
  }
}

/**
 * A spectral drummer: the translucent figure, and a mallet in its front hand that lifts with the coming beat and comes
 * down on the drum's head as the beat lands, in a soft glow and a white flash on the drum as it strikes
 */
function drawDrummer(d: Drummer): void {
  const show = Math.min(1, d.t / DRUMMER.show) * (1 - d.gone / DRUMMER.fade);
  if (show <= 0) return;
  const a = show * 0.92;
  const f = d.face;
  const x = Math.round(d.x);
  const y = Math.round(d.y);
  const step = Math.floor(d.t * 4 + d.phase * 2) % 2;
  glow(x, y - 5, 7, PAL.beat[3], 0.22 * show);
  for (let r = 0; r < DRUMMER_ART.length; r++) drawRow(DRUMMER_ART[r], x, y - 10 + r, f, a);
  drawRow(DRUMMER_LEGS[step][0], x, y - 2, f, a);
  drawRow(DRUMMER_LEGS[step][1], x, y - 1, f, a);
  // the mallet from the front shoulder: high and back before the beat, down on the drum's head as it lands
  const angle = MALLET.down + lift(d) * (MALLET.up - MALLET.down);
  const shoulderX = x + f * 1.5 + 0.5;
  const shoulderY = y - 6.5;
  const headX = shoulderX + f * Math.cos(angle) * MALLET.length;
  const headY = shoulderY - Math.sin(angle) * MALLET.length;
  line(shoulderX - 0.5, shoulderY - 0.5, headX - 0.5, headY - 0.5, PAL.beat[4], show);
  px(headX - 0.5, headY - 0.5, WHITE, show);
  if (d.struck < MALLET_REST * 2) {
    const k = 1 - d.struck / (MALLET_REST * 2);
    glow(x + f * 3 + 0.5, y - 5.5, 6, WHITE, 0.55 * k * show);
  }
}

/**
 * Drum Corps: an accented Crash may call spectral drummers who stand beside him and strike the nearest foe on each of
 * the next beats; with its levels more often, longer, harder, staggering and two at once. Marching Band keeps three
 * drummers marching with him for the whole run, striking on every beat.
 */
export const drumCorpsSkill: SkillBehavior = {
  create: () => ({ cd: 0, drummers: [] }),
  update(memory, { evolved }, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    if (evolved || skillValues(ID).band) gatherBand(m);
    m.drummers = m.drummers.filter((d) => march(d, dt));
  },
  draw(memory) {
    place();
    const drummers = [...memoryOf(memory).drummers].sort((p, q) => p.y - q.y);
    for (const d of drummers) drawDrummer(d);
  },
  on: {
    accent(memory, event) {
      if (event.blow !== "crash") return;
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (m.cd > 0 || !rng.chance(v.chance)) return;
      m.cd = withCharms("cooldown", v.cooldown);
      call(m);
    },
    tick(memory) {
      beat(memoryOf(memory));
    },
  },
};
