import { CHAIN_BLOWS, CHAIN_LINK, CHAIN_STRING, KNEE_RANGE, SHOULDER_Y } from "../../../constants/orrin/string";
import { sfx } from "../../../services/audio";
import type { ChainBlow } from "../../../types/orrin";
import { clamp, TAU } from "../../../utils/math";
import { createSlash } from "../../effects/slash";
import { enemyBox } from "../../enemies/enemy";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { newSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { skin } from "../skin";
import { type ChainStrike, sweepChain } from "./chainHit";
import { orrin } from "./memory";
import { blowReach } from "./reach";

/** a foe on the floor ahead right against him turns the lash into the knee */
function foeAgainstHim(): boolean {
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [x0, y0, x1, y1] = enemyBox(e);
    const gap = hero.face > 0 ? x0 - hero.x : hero.x - x1;
    if (gap > -6 && gap < KNEE_RANGE && y1 > hero.y - 30 && y0 < hero.y) return true;
  }
  return false;
}

/** how many times Full Circle turns: Iron Weight adds turns */
export const circleTurns = (): number => Math.max(1, skillValues("o_ironweight").turns ?? 1);

/** the strike of the blow under way, with Sweet Spot's sure crit on a Full Circle tip */
export function currentStrike(): ChainStrike {
  const blow = orrin.current;
  return { spec: CHAIN_BLOWS[blow], blow, tipCrit: blow === "circle" && !!skillValues("o_sweetspot").circleCrit };
}

/** the blow's length, Full Circle's growing with each extra turn */
export function blowLength(blow: ChainBlow): number {
  const b = CHAIN_BLOWS[blow];
  if (blow !== "circle") return b.dur;
  return b.dur + (circleTurns() - 1) * (b.hitEnd - b.hit);
}

/** the brass smear the blow leaves on its hit frame */
function smear(blow: ChainBlow): void {
  const b = CHAIN_BLOWS[blow];
  if (blow === "knee") return;
  const R = blowReach(b, blow);
  const full = blow === "circle";
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, {
      cx: 0,
      cy: -SHOULDER_Y,
      R,
      sy: full ? 0.35 : 1,
      rot: 0,
      a0: full ? -Math.PI / 2 : b.a0,
      a1: full ? -Math.PI / 2 + TAU * 0.98 : b.a1,
      W: full ? 4 : 3,
      sweep: full ? b.hitEnd - b.hit : 0.04,
      trail: 0.12,
      ramp: skin.ramp,
    }),
  );
}

function startBlow(index: number): void {
  orrin.blow = index;
  orrin.current = index === 0 && foeAgainstHim() ? "knee" : CHAIN_STRING[index];
  orrin.queued = false;
  orrin.struck = false;
  orrin.swept = 0;
  orrin.link = 0;
  hero.chain = Math.min(progress.comboLimit, index + 1);
  hero.vx = 0;
  newSwing();
  setState("lash");
  sfx.swing(orrin.current === "circle" ? 0.8 : 1.15);
}

/** J on the floor: the next blow of the string, or queue it during one */
export function pressString(): boolean {
  if (hero.state === "lash") {
    orrin.queued = true;
    return true;
  }
  if (!isFree() || !hero.ground) return false;
  startBlow(orrin.link > 0 ? orrin.blow : 0);
  return true;
}

/**
 * The blow under way: the chain sweeps its arc between its first and last hit frames, striking each foe once; Full
 * Circle turns again for each Iron Weight turn, the later turns at half. When it ends a queued press carries on.
 */
export function runString(dt: number): void {
  const h = hero;
  h.st += dt * (progress.stats.aspd - 1);
  const blow = orrin.current;
  const b = CHAIN_BLOWS[blow];
  const span = b.hitEnd - b.hit;
  const turns = blow === "circle" ? circleTurns() : 1;
  if (h.st >= b.hit && orrin.swept < turns) {
    if (!orrin.struck) {
      orrin.struck = true;
      smear(blow);
    }
    const to = span > 0 ? clamp((h.st - b.hit) / span, 0, turns) : 1;
    const strike = currentStrike();
    while (orrin.swept < to - 1e-6) {
      const turn = Math.floor(orrin.swept + 1e-6);
      const end = Math.min(to, turn + 1);
      const f0 = orrin.swept - turn;
      const f1 = end - turn;
      sweepChain({ ...strike, scale: turn > 0 ? 0.5 : 1 }, b.a0 + (b.a1 - b.a0) * f0, b.a0 + (b.a1 - b.a0) * f1);
      orrin.swept = end;
      if (end >= turn + 1 && end < turns) {
        newSwing();
        smear(blow);
      }
    }
  }
  if (h.st < blowLength(blow)) return;
  const next = orrin.blow < CHAIN_STRING.length - 1 ? orrin.blow + 1 : -1;
  if (orrin.queued && next >= 0) return startBlow(next);
  settle();
  orrin.blow = next >= 0 ? next : 0;
  orrin.link = next >= 0 ? CHAIN_LINK : 0;
}

/** a blow's recovery after it struck can be cut short by the hook or a Backline */
export const inRecovery = (): boolean => hero.state === "lash" && orrin.struck && orrin.swept >= 1;
