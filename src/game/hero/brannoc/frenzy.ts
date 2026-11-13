import { FRENZY, FRENZY_CAST } from "../../../constants/brannoc/moves";
import { SPARKS } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import { emitSkillEvent } from "../../skills/events";
import { hero, particles, rng } from "../../state";
import { isFree, setState, settle } from "../actions";
import { deny } from "../deny";
import { spendHp } from "./debt";
import { brannoc } from "./memory";
import { inRecovery } from "./string";

/** where the far forearm is when the edge is drawn across it, from his feet facing right */
const FOREARM = { x: 6, y: -19 } as const;

/** K: Frenzy, paid in HP; refused while one runs or in the wait after it, and when he cannot pay */
export function pressFrenzy(): boolean {
  if (!isFree() && !inRecovery()) return false;
  if (brannoc.frenzyT > 0 || brannoc.frenzyWait > 0) {
    deny("cast");
    return true;
  }
  if (!spendHp(FRENZY.cost)) return true;
  if (hero.ground) hero.vx = 0;
  setState("frenzy");
  return true;
}

/** the cut across the forearm: a crimson burst from the arm and a short roar, and the Frenzy begins */
function cut(): void {
  const x = hero.x + hero.face * FOREARM.x;
  const y = hero.y + FOREARM.y;
  for (let i = 0; i < FRENZY.sparks; i++)
    particles.spawn(PK.SPARK, x, y, hero.face * rng.range(-20, 90), rng.range(-90, 20), rng.range(0.15, 0.3), {
      sparks: SPARKS.rage,
    });
  sfx.tone(90, 220, 0.09, "sawtooth", 0.05);
  brannoc.frenzyT = FRENZY.time;
  emitSkillEvent({ type: "frenzy", on: true });
}

/** the activation: the edge drawn across the forearm on its hit frame, then the roar; works on the floor and in the air */
export function runFrenzy(): void {
  const h = hero;
  if (h.ground) h.vx = 0;
  if (!h.hitDone && h.st >= FRENZY_CAST.hit) {
    h.hitDone = true;
    cut();
  }
  if (h.st >= FRENZY_CAST.dur) settle();
}

/** the Frenzy runs down, then K waits; red steam leaves his mouth while it runs */
export function tickFrenzy(dt: number): void {
  if (brannoc.frenzyT > 0) {
    brannoc.frenzyT -= dt;
    if (brannoc.frenzyT <= 0) {
      brannoc.frenzyT = 0;
      brannoc.frenzyWait = FRENZY.wait;
      emitSkillEvent({ type: "frenzy", on: false });
    }
    return;
  }
  brannoc.frenzyWait = Math.max(0, brannoc.frenzyWait - dt);
}

/** a blow takes its HP but no knockback, flinch or combo reset in Frenzy and Berserk */
export const steadfast = (): boolean => brannoc.frenzyT > 0 || brannoc.berserkT > 0;
