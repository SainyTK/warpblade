import { BACKLINE } from "../../../constants/orrin/backline";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { createTripLine } from "../../effects/orrin/tripLine";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { dust } from "../../world";
import { isFree, setState, settle } from "../actions";
import { refuseDash } from "../stamina";
import { travelEnded } from "../travelEnd";
import { orrin } from "./memory";
import { inRecovery } from "./string";

const UNDERTOW = "o_undertow";
const BOOST_TIME = 0.3;

/** how far Backline yanks him: Undertow stretches it */
const backlineDistance = (): number => skillValues(UNDERTOW).distance ?? BACKLINE.distance;

/** the foes ahead within reach, nearest first */
function foesAhead(reach: number): Enemy[] {
  return game.enemies
    .filter((e) => e.hp > 0 && !e.air && Math.sign(e.x - hero.x) === hero.face && Math.abs(e.x - hero.x) < reach)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
}

/** L on the floor: the hook bites the floor behind him and yanks him back, facing forward, paid with stamina */
export function pressBackline(): boolean {
  const h = hero;
  if ((!isFree() && !inRecovery()) || !h.ground || orrin.backlineCd > 0) return false;
  if (h.stamina < BACKLINE.cost) {
    refuseDash();
    return true;
  }
  h.stamina -= BACKLINE.cost;
  h.staminaWait = 0.5;
  h.running = false;
  h.perfectUsed = false;
  orrin.backFrom = h.x;
  orrin.backlineCd = BACKLINE.cooldown + BACKLINE.time;
  setState("backline");
  dust(h.x, h.y, 3, h.face);
  sfx.clink();
  const v = skillValues(UNDERTOW);
  if (v.riptide) {
    for (const e of foesAhead(withCharms("area", v.riptide))) e.pinned = Math.max(e.pinned, 1);
  }
  return true;
}

/** the floor point the hook bit, behind where he started */
export const backlinePoint = (): number => orrin.backFrom - hero.face * BACKLINE.bite;

/** the yank back over its time, his feet low; Undertow drags foes after him and leaves a chain line that trips */
export function runBackline(dt: number): void {
  const h = hero;
  const v = skillValues(UNDERTOW);
  const speed = (backlineDistance() / BACKLINE.time) * progress.stats.move;
  h.vx = -h.face * speed;
  const dragged = v.riptide ? foesAhead(withCharms("area", v.riptide) + 24) : v.drag ? foesAhead(40).slice(0, 1) : [];
  const pull = v.riptide ? speed : v.drag / BACKLINE.time;
  for (const e of dragged) e.x -= h.face * pull * dt;
  if (h.st < BACKLINE.time) return;
  h.vx = 0;
  if (v.trip) game.fx.push(createTripLine(orrin.backFrom, h.x, h.y, v.trip, v.power));
  if (v.boost) {
    orrin.flingBoost = v.boost;
    orrin.boostLeft = BOOST_TIME;
  }
  emitSkillEvent({ type: "dash", dir: -h.face, foes: [] });
  travelEnded();
  settle();
}

/** Undertow: a blow early in a Backline is a Slip */
export const backlineSlip = (): boolean => hero.state === "backline" && hero.st < (skillValues(UNDERTOW).slip ?? 0);
