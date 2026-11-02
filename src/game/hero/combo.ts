import { COMBO, FUSION, HERO_MOVE } from "../../constants/combat";
import { CLIPS } from "../../constants/hero";
import { sfx } from "../../services/audio";
import type { MoveHit, MoveId } from "../../types/move";
import { createCrystalWave } from "../effects/crystalWave";
import { createSlash } from "../effects/slash";
import { wispsEvade } from "../enemies/evade";
import { isHeld, take } from "../input";
import { meleeHit } from "../meleeHit";
import { hasPerk } from "../progress";
import { game, hero, progress } from "../state";
import { boxAhead, boxBehind } from "../world";
import { isFree, leaveHang, setState, settle } from "./actions";
import { GROUND_LIGHTS, MOVES } from "./moves";

/** the move J starts now, from the keys held and what Kael is doing; null when the combo cannot go on */
export function pickMove(): MoveId | null {
  const h = hero;
  if (h.chain === 0 && h.comboCd > 0) return null;
  const next = h.chain + 1;
  if (next > progress.comboLimit) return null;
  const up = isHeld("up");
  const down = isHeld("down");
  if (!h.ground && h.state !== "hang") {
    if (down && hasPerk("meteorDrop")) return "meteor";
    if (h.jumps >= 2 && !h.whirled && hasPerk("whirlwind")) return "whirl";
    if (next === progress.comboLimit || h.airHits >= COMBO.airLights) return "airSpike";
    return h.airHits % 2 === 0 ? "airCut1" : "airCut2";
  }
  if ((h.state === "dash" || h.sinceDash < HERO_MOVE.dashLink) && hasPerk("dashStrike")) return "dashStrike";
  if (h.running && h.state === "run" && hasPerk("runThrust")) return "thrust";
  if (down && hasPerk("sweep")) return "sweep";
  if (up && h.chain >= 1 && hasPerk("launcher")) return "launcher";
  if (next === progress.comboLimit) return "smash";
  return GROUND_LIGHTS[Math.min(next, GROUND_LIGHTS.length) - 1];
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
  h.chain++;
  if (!h.ground) h.airHits++;
  Object.assign(h, { move: id, hitIndex: 0, queued: null, link: 0, running: false, moveHits: 0 });
  setState("move");
  m.enter?.();
  if (m.hits.length) {
    wispsEvade();
    manaWave();
  }
  sfx.swing(m.hits.some((x) => x.big) ? 0.7 : 1);
}

/** close the combo: a full one leaves a short cooldown */
export function endCombo(cooldown: boolean): void {
  hero.chain = 0;
  hero.link = 0;
  hero.queued = null;
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
  if (hit.slash) game.fx.push(createSlash(hero.x, hero.y, hero.face, hit.slash));
  const [x0, y0, x1, y1] = hit.box;
  const boxes = hit.around ? [boxAhead(x0, y0, x1, y1), boxBehind(x0, y0, x1, y1)] : [boxAhead(x0, y0, x1, y1)];
  return meleeHit(boxes, hit);
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
  return h.st >= last.at + COMBO.cancel;
}

/** play the current move: deal its blows on time, chain into the queued move, end with the clip or on landing */
export function runMove(): void {
  const h = hero;
  if (!h.move) return settle();
  const id = h.move;
  const m = MOVES[id];
  m.step?.(h.st);
  while (h.hitIndex < m.hits.length && h.st >= m.hits[h.hitIndex].at - 0.025) {
    const hits = strike(m.hits[h.hitIndex]);
    h.hitIndex++;
    m.afterHit?.(hits);
  }
  if (h.queued && blowsDone() && !endsChain(id)) {
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

/** J pressed: start a move now, or queue it while the current one plays out */
export function pressAttack(): boolean {
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

/** count down the link window and the combo cooldown */
export function tickCombo(dt: number): void {
  const h = hero;
  h.comboCd = Math.max(0, h.comboCd - dt);
  if (h.link <= 0) return;
  h.link -= dt;
  if (h.link <= 0 && h.state !== "move") h.chain = 0;
}
