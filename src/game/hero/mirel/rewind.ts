import { REWIND } from "../../../constants/mirel/rewind";
import { PAL, SAND } from "../../../constants/palette";
import { STEP } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { PathPoint } from "../../../types/mirel";
import { PK } from "../../../types/particle";
import { createFloorRing } from "../../effects/floorRing";
import { skillValues } from "../../skills/query";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { surfaceBelow } from "../../world";
import { setState } from "../actions";
import { dropMoveGhost } from "../afterimages";
import { travelEnded } from "../travelEnd";
import { mirel, mirelHost } from "./memory";
import { rewound } from "./rewound";

/** path points kept: the longest look back any skill gives */
const KEEP = Math.round(REWIND.keep / STEP);
/** seconds between the afterimages she leaves along the path */
const GHOST_EVERY = REWIND.play / 3;

/** each fixed step her place, facing and HP join her path; the oldest fall off */
export function recordPath(): void {
  if (hero.state === "rewind") return;
  const path = mirelHost.path;
  path.push({ x: hero.x, y: hero.y, face: hero.face, hp: hero.hp });
  if (path.length > KEEP) path.splice(0, path.length - KEEP);
}

/** HP lost along a stretch of path, oldest first: every drop counted, healing left out */
function lossAlong(points: readonly PathPoint[]): number {
  let loss = 0;
  for (let i = 1; i < points.length; i++) loss += Math.max(0, points[i - 1].hp - points[i].hp);
  return loss;
}

/** HP she lost over the last `seconds`, up to now */
export function lostLately(seconds: number): number {
  const stretch = mirelHost.path.slice(-Math.max(2, Math.round(seconds / STEP)));
  return lossAlong([...stretch, { x: hero.x, y: hero.y, face: hero.face, hp: hero.hp }]);
}

/**
 * Second Chance: once a wave a blow that would fell her plays her last two seconds of path backwards instead, and she
 * gets back all she lost in them.
 */
export function secondChance(dmg: number): boolean {
  const h = hero;
  if (!skillValues("m_longrewind").secondChance || h.hp - dmg > 0 || mirel.secondChance === game.wave) return false;
  if (h.state === "rewind") return false;
  mirel.secondChance = game.wave;
  const stretch = mirelHost.path.slice(-Math.max(2, Math.round(REWIND.look / STEP)));
  if (stretch.length < 2) stretch.unshift({ x: h.x, y: h.y, face: h.face, hp: h.hp });
  mirelHost.rewound = [...stretch].reverse();
  mirel.rewindFrom = { x: h.x, y: h.y };
  mirel.hovering = false;
  Object.assign(h, { vx: 0, vy: 0, move: null, queued: null, charge: 0, chargeLevel: 0 });
  setState("rewind");
  sfx.swing(0.45);
  sfx.chime(0);
  lights.add(h.x, h.y - 16, 70, PAL.hour[4], 0.55, 0.4);
  return true;
}

/** nothing touches her while her path plays back */
export const rewinding = (): boolean => hero.state === "rewind";

/** sand motes stream back toward her along the path */
function streamSand(): void {
  if (!rng.chance(0.6)) return;
  const from = mirel.rewindFrom;
  if (!from) return;
  particles.spawn(
    PK.MOTE,
    from.x + rng.range(-4, 4),
    from.y - rng.range(4, 26),
    (hero.x - from.x) * 3,
    rng.range(-10, 10),
    0.3,
    {
      col: rng.chance(0.5) ? SAND.light : PAL.hour[4],
      size: 0.6,
    },
  );
}

/** the path has played back: every HP lost along it comes back */
function endRewind(): void {
  const h = hero;
  const from = mirel.rewindFrom ?? { x: h.x, y: h.y };
  mirelHost.rewound = [];
  mirelHost.path = [];
  h.ground = Math.abs(surfaceBelow(h.x, h.y - 1) - h.y) < 0.6;
  setState(h.ground ? "idle" : "fall");
  game.fx.push(createFloorRing(h.x, h.y, 16, PAL.hour, 0.35));
  rewound(progress.stats.hp - h.hp, from, { x: h.x, y: h.y });
  travelEnded();
}

/** the path plays backwards: she is moved along it, gravity off, leaving afterimages */
export function runRewind(): void {
  const h = hero;
  const points = mirelHost.rewound;
  // Light Boots play the path back faster
  const u = Math.min(1, h.st / (REWIND.play / progress.stats.move));
  // the pull starts slow and eases into the stop, so the body loads before it travels and settles after
  const eased = u * u * (3 - 2 * u);
  const p = points[Math.min(points.length - 1, Math.floor(eased * (points.length - 1)))];
  if (p) Object.assign(h, { x: p.x, y: p.y, face: p.face, vx: 0, vy: 0, ground: false });
  const before = h.st - STEP;
  if (Math.floor(h.st / GHOST_EVERY) !== Math.floor(before / GHOST_EVERY)) dropMoveGhost();
  streamSand();
  if (u >= 1) endRewind();
}
