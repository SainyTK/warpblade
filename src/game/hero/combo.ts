import { CLIPS } from "../../constants/clips";
import { COMBO, FUSION } from "../../constants/combat";
import { KEEN, KEEN_RAMP } from "../../constants/combo";
import { sfx } from "../../services/audio";
import type { MoveHit, MoveId } from "../../types/move";
import { chooseMove } from "../../utils/comboChoice";
import { createCrystalWave } from "../effects/crystalWave";
import { createSlash } from "../effects/slash";
import { wispsEvade } from "../enemies/evade";
import { pressAge, take } from "../input";
import { meleeHit } from "../meleeHit";
import { hasPerk } from "../progress";
import { game, hero, progress } from "../state";
import { boxAhead, boxBehind } from "../world";
import { isFree, leaveHang, setState, settle } from "./actions";
import { dropMoveGhost } from "./afterimages";
import { MOVES } from "./moves";
import { advance, strideAt } from "./moves/advance";
import { foeOnlyBehind, readSituation } from "./situation";

/** seconds between afterimages of a fast move */
const GHOST_EVERY = 0.03;

/** the move J starts now, from the keys held, what Kael is doing and the foes around him; null when the combo cannot go on */
export function pickMove(): MoveId | null {
  const h = hero;
  if (h.chain === 0 && h.comboCd > 0) return null;
  if (h.chain + 1 > progress.comboLimit) return null;
  return chooseMove(readSituation());
}

const endsChain = (id: MoveId): boolean => !!MOVES[id].finisher || hero.chain >= progress.comboLimit;

/** Mana Blade: with MP above three quarters, a swing also sends a crystal wave */
function manaWave(): void {
  if (!hasPerk("manaBlade") || hero.mp < progress.stats.mp * FUSION.manaWaveFrom) return;
  hero.mp -= FUSION.manaWaveCost;
  game.fx.push(createCrystalWave(hero.x + hero.face * 10, hero.y - 18, hero.face, progress.stats.ad * FUSION.manaWave));
}

export function startMove(id: MoveId): void {
  const h = hero;
  const m = MOVES[id];
  if (h.state === "hang") leaveHang();
  if (h.chain === 0) h.stabbed = false;
  if (m.turns && foeOnlyBehind()) h.face = -h.face;
  h.chain++;
  if (!h.ground) h.airHits++;
  Object.assign(h, {
    move: id,
    lastMove: id,
    hitIndex: 0,
    queued: null,
    link: 0,
    running: false,
    moveHits: 0,
    moveGhost: 0,
  });
  Object.assign(h, { keen: h.keenNext, keenNext: false, keenSpoiled: false, keenOpen: 0 });
  setState("move");
  m.enter?.();
  if (m.hits.length) {
    wispsEvade();
    manaWave();
  }
  sfx.swing(m.pitch ?? 1);
  if (h.keen) sfx.chime(2);
}

/** close the combo: a full one leaves a short cooldown */
export function endCombo(cooldown: boolean): void {
  hero.chain = 0;
  hero.link = 0;
  hero.queued = null;
  hero.keenNext = false;
  hero.keenOpen = 0;
  if (cooldown) hero.comboCd = COMBO.cooldown;
}

/** end the current move: close the combo if it was the last one, otherwise open the link window */
export function endMove(): void {
  const id = hero.move;
  hero.move = null;
  if (id && endsChain(id)) endCombo(true);
  else hero.link = COMBO.link;
  hero.queued = null;
  settle();
}

function strike(hit: MoveHit): number {
  game.swing++;
  const slash = hit.slash && hero.keen ? { ...hit.slash, ramp: KEEN_RAMP } : hit.slash;
  if (slash) game.fx.push(createSlash(hero.x, hero.y, hero.face, slash));
  const [x0, y0, x1, y1] = hit.box;
  const boxes = hit.around ? [boxAhead(x0, y0, x1, y1), boxBehind(x0, y0, x1, y1)] : [boxAhead(x0, y0, x1, y1)];
  return meleeHit(boxes, { ...hit, sureCrit: hero.keen });
}

/** every blow of the current move is out and its follow-through has started, so it can be cancelled;
 *  a move that struck nothing must play most of its clip first, so swinging at the air is slow */
export function blowsDone(): boolean {
  const h = hero;
  if (h.state !== "move" || !h.move) return false;
  const m = MOVES[h.move];
  if (m.untilLanding || h.hitIndex < m.hits.length) return false;
  const last = m.hits[m.hits.length - 1];
  if (!last) return true;
  if (h.moveHits === 0 && m.hits.length) return h.st >= CLIPS[m.clip].dur * COMBO.whiff;
  return h.st >= last.at + (m.cancel ?? COMBO.cancel);
}

/** footwork and afterimages of the current move */
function moveBody(dt: number): void {
  const h = hero;
  if (!h.move) return;
  const m = MOVES[h.move];
  // footwork owns Kael's ground speed: he stands still between strides, so he never slides into the foe
  const stride = strideAt(m, h.st);
  if (stride) advance(stride);
  else if (m.strides && h.ground) h.vx = 0;
  if (!m.ghosts || h.st >= m.ghosts) return;
  h.moveGhost -= dt;
  if (h.moveGhost > 0) return;
  h.moveGhost = GHOST_EVERY;
  dropMoveGhost();
}

/** play the current move: deal its blows on time, chain into the queued move, end with the clip or on landing */
export function runMove(dt: number): void {
  const h = hero;
  if (!h.move) return settle();
  const id = h.move;
  const m = MOVES[id];
  m.step?.(h.st);
  moveBody(dt);
  while (h.hitIndex < m.hits.length && h.st >= m.hits[h.hitIndex].at - 0.025) {
    const hits = strike(m.hits[h.hitIndex]);
    h.hitIndex++;
    m.afterHit?.(hits);
    // the last blow landed clean: a J pressed in the next moment is Keen
    if (h.hitIndex === m.hits.length && hits > 0 && !h.keenSpoiled) h.keenOpen = KEEN.window;
  }
  // a hop finishes its landing before the next move
  if (h.queued && blowsDone() && !endsChain(id) && (!m.hop || h.ground)) {
    const next = h.queued;
    h.move = null;
    startMove(next);
    return;
  }
  const over = m.untilLanding ? h.ground : h.st >= CLIPS[m.clip].dur;
  if (!over) return;
  if (m.untilLanding) m.land?.();
  endMove();
}

/** the combo has room for one more move after at least this many hits, and the last blow has landed */
export function comboOpen(hits: number): boolean {
  const h = hero;
  if (h.chain < hits || h.chain >= progress.comboLimit) return false;
  if (h.state === "move" && h.move) return h.hitIndex >= MOVES[h.move].hits.length;
  return h.link > 0 && isFree();
}

/** a fresh J press: before the blow lands it spoils Keen timing, just after it lands it earns it */
function judgeTiming(): void {
  const h = hero;
  if (pressAge("attack") !== 0) return;
  if (h.state === "move" && h.move && h.hitIndex < MOVES[h.move].hits.length) h.keenSpoiled = true;
  else if (h.keenOpen > 0) h.keenNext = true;
}

/** J pressed: start a move now, or queue it while the current one plays out */
export function pressAttack(): boolean {
  judgeTiming();
  const id = pickMove();
  if (!id) return false;
  // the Up that aimed the launcher is spent on it, not on a jump
  if (id === "launcher") take("up");
  if (hero.state === "move") {
    hero.queued = id;
    return true;
  }
  if (!isFree() && hero.state !== "hang" && hero.state !== "dash") return false;
  startMove(id);
  return true;
}

/** count down the link window, Keen timing and the combo cooldown */
export function tickCombo(dt: number): void {
  const h = hero;
  h.comboCd = Math.max(0, h.comboCd - dt);
  h.keenOpen = Math.max(0, h.keenOpen - dt);
  if (h.link <= 0) return;
  h.link -= dt;
  if (h.link <= 0 && h.state !== "move") h.chain = 0;
}
