import { CHAIN_BLOWS, CHAIN_LINK, CHAIN_STRING, SHOULDER_Y, WHOOSH_LEAD } from "../../../constants/orrin/string";
import { sfx } from "../../../services/audio";
import type { ChainBlow } from "../../../types/orrin";
import { clamp, TAU } from "../../../utils/math";
import { createSlash } from "../../effects/slash";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { newSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { skin } from "../skin";
import { type ChainStrike, sweepChain } from "./chainHit";
import { orrin } from "./memory";
import { blowReach } from "./reach";

/** how many times Full Circle turns: Iron Weight adds turns */
export const circleTurns = (): number => Math.max(1, skillValues("o_ironweight").turns ?? 1);

/** the strike of the blow under way, with Sweet Spot's sure crit on a Full Circle tip */
export function currentStrike(): ChainStrike {
  const blow = orrin.current;
  return { spec: CHAIN_BLOWS[blow], blow, tipCrit: blow === "circle" && !!skillValues("o_sweetspot").circleCrit };
}

/** seconds Full Circle's extra Iron Weight turns add to the blow; none for the other blows */
const extraTurns = (blow: ChainBlow): number => {
  const b = CHAIN_BLOWS[blow];
  return blow === "circle" ? (circleTurns() - 1) * (b.hitEnd - b.hit) : 0;
};

/** the blow's length, Full Circle's growing with each extra turn */
export const blowLength = (blow: ChainBlow): number => CHAIN_BLOWS[blow].dur + extraTurns(blow);

/** the moment a press already made carries on out of the blow's follow-through */
const linkAt = (blow: ChainBlow): number => (CHAIN_BLOWS[blow].link ?? CHAIN_BLOWS[blow].dur) + extraTurns(blow);

/** the brass smear the blow leaves on its hit frame */
function smear(blow: ChainBlow): void {
  const b = CHAIN_BLOWS[blow];
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
  orrin.current = CHAIN_STRING[index];
  orrin.queued = false;
  orrin.struck = false;
  orrin.swept = 0;
  orrin.link = 0;
  hero.chain = Math.min(progress.comboLimit, index + 1);
  hero.vx = 0;
  newSwing();
  setState("lash");
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
  const whoosh = b.hit - WHOOSH_LEAD;
  if (h.st - dt * progress.stats.aspd < whoosh && h.st >= whoosh) sfx.swing(b.feel.pitch * 1.05);
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
  const next = orrin.blow < CHAIN_STRING.length - 1 ? orrin.blow + 1 : -1;
  // a press already made carries on from the follow-through: the next blow, or after the last a new string
  if (orrin.queued && orrin.swept >= turns - 1e-6 && h.st >= linkAt(blow)) return startBlow(Math.max(0, next));
  if (h.st < blowLength(blow)) return;
  settle();
  orrin.blow = next >= 0 ? next : 0;
  orrin.link = next >= 0 ? CHAIN_LINK : 0;
}
