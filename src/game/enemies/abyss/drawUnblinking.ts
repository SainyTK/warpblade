import { GROUND } from "../../../constants/stage";
import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix } from "../../../utils/color";
import { AC, clipBelow, VOID } from "./colors";
import { UNB_HIDE } from "./unblinkingColors";
import { paintCorona } from "./unblinkingCorona";
import { paintEyeball } from "./unblinkingEyeball";
import { paintNerves, paintThorns } from "./unblinkingFringe";
import { blackSunRim } from "./unblinkingLight";
import { Mirrored } from "./unblinkingMirror";
import { type UnblinkingPose, unblinkingPose } from "./unblinkingPose";
import { almond, BODY, type BodyFrame, bodyBottom, bodyTop, lidLower, lidUpper, OPENING } from "./unblinkingShape";
import { paintTears } from "./unblinkingTears";

/** wide enough for the corona's streamers and tall enough for the nerves hanging under it */
const canvas = detailCanvas(96, 96, 48, 46);
const mirrored = new Mirrored(canvas);

/** its slow breath: how fast, and how much it swells, hovering and lying spent on the floor */
const BREATH = { rate: 1.1, size: 0.015, lyingRate: 0.6, lying: 0.03 } as const;
/** lying on the floor it slumps: wider, flatter and lower */
const SLUMP = { sx: 1.06, sy: 0.86, drop: 6.5 } as const;
/** falling, it stretches tall and thin */
const STRETCH = { sx: 0.06, sy: 0.12 } as const;
/** how fast the shiver of a swelling tear flickers */
const SHIVER_RATE = 47;
/** the outlines the body and its lit dome are drawn from, as points along the almond */
const OUTLINE_STEPS = 24;
/** the lit dome sits this far toward the sun and this much smaller than the body, leaving a crescent of shadow */
const DOME = { x: 0.8, y: -1, sx: 0.93, sy: 0.9 } as const;
/** the upper lid's skin: how far above its edge it reaches, the highest it rises as a share of the opening's rest height, and where its fold runs */
const LID = { margin: 1.8, reach: 1.25, crease: 1, lower: 1.4, swell: 3.4 } as const;
/** the shut lid's lashes along the seam: spacing, length, and how far out they run */
const SHUT_LASHES = { every: 3, long: 1.6, reach: 14 } as const;
/** the lids count as shut for the lashes along the seam below this */
const SHUT_BELOW = 0.35;
/** an ember of light still leaks from the seam this far each side of the middle */
const EMBER_SEAM = 10;
/** the eye rolling under the shut lid: how fast, how far each side, how wide the swell is and how far above the seam */
const ROLL = { rate: 0.7, reach: 6, wide: 4, above: 4 } as const;

/** the cracks of void light across its hide below half health, as paths; above the middle they keep clear of the opening */
const CRACKS: readonly (readonly (readonly [number, number])[])[] = [
  [
    [-9, -16.5],
    [-7, -14.5],
    [-8.2, -12.6],
    [-6.5, -11],
  ],
  [
    [5, -16.8],
    [7, -14.6],
    [6, -13],
    [8.2, -11.6],
  ],
  [
    [-4, 14.6],
    [-2.2, 12.8],
    [-3.2, 11.2],
  ],
  [
    [15, -9.5],
    [16.8, -7.6],
    [16, -6],
  ],
];

/** where the body sits and how it is squashed for this pose */
function bodyFrame(p: UnblinkingPose, time: number): BodyFrame {
  const breath = p.lying
    ? Math.sin(time * BREATH.lyingRate) * BREATH.lying
    : Math.sin(time * BREATH.rate) * BREATH.size;
  const flicker = Math.sin(time * SHIVER_RATE) > 0 ? 1 : -1;
  const slump = p.lying ? 1 : 0;
  return {
    x: p.shiver * flicker,
    y: SLUMP.drop * slump,
    sx: (1 + breath) * (1 + (SLUMP.sx - 1) * slump) * (1 - STRETCH.sx * p.fall),
    sy: (1 + breath) * (1 + (SLUMP.sy - 1) * slump) * (1 + STRETCH.sy * p.fall),
  };
}

/** the ink-black hide around the eye: a lit dome over a crescent of shadow */
function paintBody(m: Mirrored, s: SpriteCanvas, f: BodyFrame): void {
  const at = (x: number, y: number): [number, number] => [f.x + x * f.sx, f.y + y * f.sy];
  const outline: [number, number][] = [];
  const dome: [number, number][] = [];
  for (let i = 0; i <= OUTLINE_STEPS; i++) {
    const x = -BODY.x + (2 * BODY.x * i) / OUTLINE_STEPS;
    outline.push(at(x, bodyTop(x)));
    dome.push(at(x * DOME.sx + DOME.x, bodyTop(x) * DOME.sy + DOME.y));
  }
  for (let i = OUTLINE_STEPS; i >= 0; i--) {
    const x = -BODY.x + (2 * BODY.x * i) / OUTLINE_STEPS;
    outline.push(at(x, bodyBottom(x)));
    dome.push(at(x * DOME.sx + DOME.x, bodyBottom(x) * DOME.sy + DOME.y));
  }
  s.begin();
  m.poly(outline, UNB_HIDE.dark);
  m.poly(dome, UNB_HIDE.body);
  s.shadeEdges(UNB_HIDE.body, UNB_HIDE.sheen, UNB_HIDE.body);
  s.shadeEdges(UNB_HIDE.dark, UNB_HIDE.dark, UNB_HIDE.deep, 3);
  s.commit();
}

/**
 * The lids over the eyeball: the upper lid's skin from its fold down to its edge (all of the eye when shut), a fold
 * line across it, the lower lid's rim, swollen while a tear gathers, and once it has shut lashes along the seam, an
 * ember leaking from it and the eye rolling under the lid.
 */
function paintLids(m: Mirrored, s: SpriteCanvas, p: UnblinkingPose, f: BodyFrame, time: number): void {
  const at = (x: number, y: number): [number, number] => [f.x + x * f.sx, f.y + y * f.sy];
  const reach = OPENING.x + 0.6;
  const upperTop = (x: number) =>
    Math.min(
      lidUpper(x, p) - LID.margin * almond(x, reach, OPENING.point),
      -OPENING.up * LID.reach * almond(x, reach, OPENING.point),
    );
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];
  for (let i = 0; i <= OUTLINE_STEPS; i++) {
    const x = -reach + (2 * reach * i) / OUTLINE_STEPS;
    upper.push(at(x, upperTop(x)));
    lower.push(at(x, lidLower(x, p) - 0.3));
  }
  for (let i = OUTLINE_STEPS; i >= 0; i--) {
    const x = -reach + (2 * reach * i) / OUTLINE_STEPS;
    const f0 = almond(x, reach, OPENING.point);
    upper.push(at(x, lidUpper(x, p) + 0.4 * f0));
    lower.push(at(x, Math.max(lidLower(x, p) + LID.lower * f0, OPENING.low * f0 + f0)));
  }
  s.begin();
  m.poly(upper, UNB_HIDE.fold);
  s.shadeEdges(UNB_HIDE.fold, UNB_HIDE.foldLight, UNB_HIDE.dark, 2);
  // the fold across the upper lid
  for (let i = 1; i < OUTLINE_STEPS; i++) {
    const x0 = -reach * 0.8 + (1.6 * reach * (i - 1)) / OUTLINE_STEPS;
    const x1 = -reach * 0.8 + (1.6 * reach * i) / OUTLINE_STEPS;
    m.hairline(...at(x0, upperTop(x0) + LID.crease), ...at(x1, upperTop(x1) + LID.crease), UNB_HIDE.dark);
  }
  s.commit();
  // the lower lid flushes as it swells with a tear
  const lowerLid = p.swell > 0 ? mix(UNB_HIDE.fold, UNB_HIDE.swollen, p.swell) : UNB_HIDE.fold;
  s.begin();
  m.poly(lower, lowerLid);
  if (p.swell > 0) m.dot(...at(0, lidLower(0, p) + LID.lower), LID.lower + LID.swell * p.swell, lowerLid);
  s.shadeEdges(lowerLid, mix(lowerLid, UNB_HIDE.foldLight, 0.7), UNB_HIDE.dark, 2);
  s.commit();
  if (p.open >= SHUT_BELOW) return;
  s.begin();
  for (let x = -SHUT_LASHES.reach; x <= SHUT_LASHES.reach; x += SHUT_LASHES.every) {
    const y = lidUpper(x, p);
    m.hairline(...at(x, y), ...at(x * 1.06, y + SHUT_LASHES.long), UNB_HIDE.lashLight);
  }
  for (let i = 1; i <= OUTLINE_STEPS; i++) {
    const x0 = -OPENING.x + (2 * OPENING.x * (i - 1)) / OUTLINE_STEPS;
    const x1 = -OPENING.x + (2 * OPENING.x * i) / OUTLINE_STEPS;
    m.hairline(...at(x0, lidUpper(x0, p)), ...at(x1, lidUpper(x1, p)), UNB_HIDE.deep);
    if (Math.abs(x0) < EMBER_SEAM)
      m.hairline(...at(x0, lidUpper(x0, p) + 0.5), ...at(x1, lidUpper(x1, p) + 0.5), VOID[2]);
  }
  // the eye rolls slowly under the shut lid, a lit swell crossing it
  const under = Math.sin(time * ROLL.rate) * ROLL.reach;
  for (let x = under - ROLL.wide; x < under + ROLL.wide; x += 0.5) {
    const y = lidUpper(x, p) - ROLL.above;
    const y1 = lidUpper(x + 0.5, p) - ROLL.above;
    m.hairline(...at(x, y), ...at(x + 0.5, y1), UNB_HIDE.foldLight);
    if (Math.abs(x - under) < ROLL.wide * 0.6) m.hairline(...at(x, y + 0.5), ...at(x + 0.5, y1 + 0.5), UNB_HIDE.sheen);
  }
  s.commit(false);
}

/** the cracks of void light across its hide, kept off the eye's opening */
function paintCracks(m: Mirrored, s: SpriteCanvas, p: UnblinkingPose, f: BodyFrame): void {
  const at = ([x, y]: readonly [number, number]): [number, number] => {
    const clear = y < 0 ? Math.min(y, lidUpper(x, p) - 0.8) : Math.max(y, lidLower(x, p) + 1.4);
    return [f.x + x * f.sx, f.y + clear * f.sy];
  };
  s.begin();
  for (const crack of CRACKS)
    for (let i = 1; i < crack.length; i++) m.stroke(...at(crack[i - 1]), ...at(crack[i]), 0.7, VOID[1]);
  for (const crack of CRACKS)
    for (let i = 1; i < crack.length; i++) m.hairline(...at(crack[i - 1]), ...at(crack[i]), i % 2 ? VOID[4] : VOID[3]);
  s.commit(false);
}

/**
 * The Unblinking: a great eye in an almond of ink-black hide, a crown of thorns along its brow, nerves trailing
 * beneath it and the broken corona of a black sun turning behind it. Its wet eyeball follows Kael; its pupil is a
 * small black sun. Its lids stare wide as it burns lances and pull back past their rest as it gazes, its iris
 * following the wall; it squints as a tear swells under the lid and weeps; after a gaze that found nothing its lids
 * hang heavy, the white flushes and the iris twitches. Shut, it falls and lies slumped on the floor, then the lid
 * flutters apart before it rises. Below half health void light cracks its hide, its veins and nerves burn and its
 * corona closes.
 */
export function drawUnblinking(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const m = mirrored;
  const time = t + e.seed;
  const p = unblinkingPose(e, t);
  const f = bodyFrame(p, time);
  const enraged = e.phase === 2;
  s.clear();
  m.start();
  paintNerves(m, s, p, f, time, GROUND - e.y, enraged);
  paintThorns(m, s, p, f, time, enraged);
  paintBody(m, s, f);
  s.begin();
  paintEyeball(m, p, f, enraged);
  s.commit();
  paintLids(m, s, p, f, time);
  paintTears(m, s, p, f, time, enraged);
  if (enraged) paintCracks(m, s, p, f);
  blackSunRim(s, AC.rim, AC.rimSoft);
  m.finish(e.face, AC.outline);
  paintCorona(m, s, p, f, time);
  if (p.lying) clipBelow(s, GROUND - e.y);
  return s;
}
