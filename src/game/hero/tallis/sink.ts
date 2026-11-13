import { PAL } from "../../../constants/palette";
import { GROUND, PLATFORMS } from "../../../constants/stage";
import { SINK } from "../../../constants/tallis/sink";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { enemyBox } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, particles, progress, rng } from "../../state";
import { isFree, setState } from "../actions";
import { rewardPerfectDodge } from "../perfectDodge";
import { cutForSharedAction, maySharedAct } from "../sharedCut";
import { travelEnded } from "../travelEnd";
import { openRiseAmbush } from "./ambush";
import { tallis, tallisHost } from "./memory";
import { startRisingCut } from "./string";

/** stamina a Sink spends to start, and a second: Deep Shadow and Endurance's stamina lower it */
const cheaper = (): number => 1 - (skillValues("t_sink").cheaper ?? 0);
export const sinkCost = (): number => SINK.start * cheaper();

/** Sinks before the wait: Deep Shadow gives two */
const sinksMax = (): number => skillValues("t_sink").sinks || 1;

/** seconds before a Sink can start again, 0 while one is left */
export const sinkWait = (): number => (tallis.sinks > 0 ? 0 : tallis.sinkCd);

/** the platform he stands on, or null on the floor */
const platformUnder = () =>
  hero.y < GROUND
    ? (PLATFORMS.find((p) => hero.x >= p.x0 - 3 && hero.x <= p.x1 + 3 && Math.abs(p.y - hero.y) < 1) ?? null)
    : null;

/** a Sink may start on landing from a plunge: ready and paid for */
const canSink = (): boolean => tallis.sinks > 0 && tallis.sinkCd <= 0 && hero.stamina >= sinkCost();

/** he pours down into the pool: the held form stays under while I is held, the dip glides on its own a moment */
function startSink(held: boolean): void {
  const h = hero;
  h.stamina -= sinkCost();
  h.staminaWait = 0.5;
  tallis.sinkT = 0;
  tallis.sinkMax = SINK.max + (skillValues("t_sink").longer ?? 0);
  tallis.sinkFrom = h.x;
  tallis.sinkHeld = held;
  tallis.sinkDodged = false;
  tallis.sinkLetGo = false;
  tallis.risingQueued = false;
  tallisHost.passed = [];
  h.vx = 0;
  setState("sink");
  sfx.dodge();
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.EMBER,
      h.x + rng.range(-6, 6),
      h.y - rng.range(0, 3),
      rng.range(-20, 20),
      -rng.range(4, 14),
      0.35,
      {
        sparks: [PAL.gloam[4], PAL.gloam[3], PAL.gloam[2], PAL.gloam[1]],
      },
    );
}

/**
 * I on Sink: tapped, a dip that glides under the foe ahead and rises behind it; held (`held`), he stays under while I is
 * held. In the air he drops straight down and sinks on landing. False while he cannot act yet.
 */
export function pressSink(held: boolean): boolean {
  if (tallis.plummet || !maySharedAct()) return false;
  cutForSharedAction();
  if (!hero.ground) {
    tallis.plummet = true;
    tallis.plummetHeld = held;
    return true;
  }
  startSink(held);
  return true;
}

/** Sink pressed in the air: straight down, then into the pool on landing, held while I still is */
export function stepPlummet(): void {
  if (!tallis.plummet) return;
  const h = hero;
  if (!isFree()) {
    tallis.plummet = false;
    return;
  }
  if (!h.ground) {
    h.vx = 0;
    h.vy = SINK.plummet;
    return;
  }
  tallis.plummet = false;
  if (canSink()) startSink(tallis.plummetHeld && isHeld("cast"));
}

/** Deep Shadow: each ground foe the pool passes under takes a cut, once a Sink */
function cutPassing(): void {
  const pass = skillValues("t_sink").pass ?? 0;
  if (!pass) return;
  const power = pass * (1 + (skillValues("t_sink").power ?? 0));
  for (const e of game.enemies) {
    if (e.hp <= 0 || kindOf(e.type).flies || tallisHost.passed.includes(e)) continue;
    const [x0, , x1, y1] = enemyBox(e);
    if (hero.x < x0 || hero.x > x1 || Math.abs(y1 - hero.y) > 6) continue;
    tallisHost.passed.push(e);
    dealDamage(e, progress.stats.ad * power, { fromX: e.x - e.face * 6, melee: true });
  }
}

/** the side he glides to: A or D, or for a dip with neither held, the way he faces */
function glideSide(): number {
  const dir = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
  return dir || (tallis.sinkHeld ? 0 : hero.face);
}

/** the Sink is over: a held one let go of (after its least), a dip's glide done, its time or his stamina run out */
function sinkDone(): boolean {
  const t = tallis.sinkT;
  if (t >= tallis.sinkMax || hero.stamina <= 0 || tallis.risingQueued) return true;
  return tallis.sinkHeld ? tallis.sinkLetGo && t >= SINK.least : t >= SINK.dip;
}

/** in the pool: steered with A and D, never past its platform's edge, until it is done; then he rises with Rising Cut */
export function runSink(dt: number): void {
  const h = hero;
  tallis.sinkT += dt;
  h.stamina = Math.max(0, h.stamina - SINK.drain * cheaper() * dt);
  h.staminaWait = 0.5;
  const dir = glideSide();
  if (dir) h.face = dir;
  h.vx = tallis.sinkT < SINK.pour ? 0 : dir * SINK.glide * progress.stats.move;
  const p = platformUnder();
  if (p && ((h.x <= p.x0 && h.vx < 0) || (h.x >= p.x1 && h.vx > 0))) h.vx = 0;
  if (!isHeld("cast")) tallis.sinkLetGo = true;
  cutPassing();
  if (sinkDone()) rise();
}

/** he rises out of the pool with Rising Cut: an Ambush opens behind a foe, Shadow Tide drags that foe down, and the
 *  travel ends */
function rise(): void {
  const h = hero;
  h.vx = 0;
  tallis.sinceRise = 0;
  tallis.leapOpen = skillValues("t_nightLeap").window ?? 0;
  tallis.sinks--;
  if (tallis.sinks <= 0) tallis.sinkCd = SINK.wait;
  // rising behind a foe he comes up facing its back, the knife ready
  const foe = openRiseAmbush();
  if (foe) h.face = Math.sign(foe.x - h.x) || h.face;
  if (foe && skillValues("t_sink").tide) foe.stun = Math.max(foe.stun, 1);
  travelEnded();
  emitSkillEvent({ type: "dash", dir: Math.sign(h.x - tallis.sinkFrom) || h.face, foes: tallisHost.passed });
  emitSkillEvent({ type: "sink", from: tallis.sinkFrom, to: h.x });
  startRisingCut();
}

/** J in the pool: he rises at once */
export function riseNow(): boolean {
  if (hero.state !== "sink") return false;
  tallis.risingQueued = true;
  return true;
}

/** a blow meets him in the pool: nothing touches him, and in its first moment it is a perfect dodge */
export function poolDodge(): boolean {
  if (hero.state !== "sink") return false;
  if (!tallis.sinkDodged && tallis.sinkT <= SINK.perfect) {
    tallis.sinkDodged = true;
    rewardPerfectDodge();
  }
  return true;
}

/** the wait after a Sink runs down, and the Sinks come back */
export function tickSink(dt: number): void {
  tallis.sinceRise += dt;
  tallis.leapOpen = Math.max(0, tallis.leapOpen - dt);
  if (tallis.sinkCd > 0) {
    tallis.sinkCd = Math.max(0, tallis.sinkCd - dt);
    if (tallis.sinkCd <= 0) tallis.sinks = sinksMax();
  } else if (hero.state !== "sink" && tallis.sinks < sinksMax() && tallis.sinceRise > SINK.wait)
    tallis.sinks = sinksMax();
}
