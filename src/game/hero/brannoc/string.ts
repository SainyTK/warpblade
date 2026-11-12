import {
  AXE_BLOWS,
  AXE_LINK,
  AXE_STRING,
  type AxeBlowSpec,
  CLEAVE_CRACK,
  HATCHET_FALL,
  KNOCKDOWN,
  REAP_TURN,
  REAVE_SWEEP,
} from "../../../constants/brannoc/axe";
import { RAGE_RAMP } from "../../../constants/characters/brannoc/look";
import { COMBO } from "../../../constants/combat";
import { frame } from "../../../constants/hero";
import { sfx } from "../../../services/audio";
import type { AxeBlow } from "../../../types/brannoc";
import type { Enemy } from "../../../types/enemy";
import type { Box } from "../../../types/world";
import { dealDamage } from "../../damage";
import { createFloorCrack } from "../../effects/floorCrack";
import { createQuakeLine } from "../../effects/quakeLine";
import { enemyBox } from "../../enemies/enemy";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { boxHit, dust, markStruck, newSwing, shake, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { bloodRing } from "./bloodRing";
import { rendPast, rendReach } from "./blowSkills";
import { attackRate, isBloodied } from "./fury";
import { brannoc, brannocHost } from "./memory";
import { smear } from "./smear";
import { type AxeStrike, axeBox, strikeAxe } from "./strike";

/** the clock of a blow beyond the shared one: attack speed and Fury */
const blowRate = (): number => progress.stats.aspd * attackRate() - 1;

/** the spec of the blow under way: the Bloodied Cleave has its own */
const specOf = (blow: AxeBlow): AxeBlowSpec =>
  blow === "cleave" && brannoc.double ? AXE_BLOWS.bloodiedCleave : AXE_BLOWS[blow];

/** the blow under way's spec */
export const currentSpec = (): AxeBlowSpec => specOf(brannoc.current);

/** Heavy Hew breaks a guard once its level says so */
const heavyOf = (blow: AxeBlow, spec: AxeBlowSpec): boolean =>
  !!spec.heavy || (blow === "hew" && !!skillValues("b_heavyHew").guard);

/** the strike of the blow under way, its `hit`-th hit */
function strikeOf(blow: AxeBlow, hit: number): AxeStrike {
  const spec = specOf(blow);
  const i = Math.min(hit, spec.power.length - 1);
  return {
    blow,
    hit,
    power: spec.power[i],
    kx: spec.kx[i],
    heavy: heavyOf(blow, spec),
    launch: hit === 0 ? spec.launch : undefined,
    stagger: COMBO.stagger,
    feel: spec.feel[i],
    bloodied: isBloodied(),
  };
}

/** the world box of a blow: Reaver lets Reave reach further behind him */
function boxOf(blow: AxeBlow): Box {
  const b = AXE_BLOWS[blow].box;
  const near = blow === "reave" ? -Math.max(-b.near, skillValues("b_reaver").behind ?? 0) : b.near;
  return axeBox(near, b.far, b.low, b.high);
}

/** Spinning Reap's turns after the Cleave's own: its level's turns, or Red Tempest's whirl */
function reapTurns(): number {
  const v = skillValues("b_spinningReap");
  if (v.tempest) return Math.round(v.tempest / REAP_TURN);
  return v.spins ?? 0;
}

function startBlow(index: number): void {
  brannoc.blow = index;
  brannoc.current = AXE_STRING[index];
  brannoc.double = brannoc.current === "cleave" && isBloodied();
  brannoc.reapLeft = brannoc.current === "cleave" ? reapTurns() : 0;
  brannoc.reapT = 0;
  brannoc.cracked = false;
  brannoc.queued = false;
  brannoc.hits = 0;
  brannoc.link = 0;
  brannocHost.spun = [];
  hero.chain = Math.min(progress.comboLimit, index + 1);
  hero.vx = 0;
  newSwing();
  setState("axe");
  sfx.swing(currentSpec().feel[0].pitch);
}

/** Earthsplitter throws a minion up this fast */
const SPLIT_LAUNCH = -200;

/** Heavy Hew's floor crack: it runs ahead from the bitten floor and strikes every foe on the floor it passes */
function hewCrack(): void {
  const v = skillValues("b_heavyHew");
  if (!v.crack) return;
  const x = hero.x + hero.face * 22;
  const end = x + hero.face * withCharms("area", v.crack);
  game.fx.push(
    createQuakeLine({
      x,
      floor: hero.y,
      ends: [end],
      ramp: RAGE_RAMP,
      delay: 0,
      slam() {},
      strike(e: Enemy) {
        if (e.hp <= 0) return;
        // Earthsplitter's spikes throw the minions they erupt under
        dealDamage(e, progress.stats.ad * (v.crackPower ?? 0) * (v.split ? 1.5 : 1), {
          fromX: x,
          kx: hero.face * 20,
          stagger: v.crackStagger ? COMBO.stagger : undefined,
          launch: v.split && e.rank === "minion" ? SPLIT_LAUNCH : undefined,
        });
      },
    }),
  );
}

/** Reaver's second sweep and Reaping Hook's drag, on Reave's hit frame */
function reaveExtras(): void {
  const v = skillValues("b_reaver");
  if (!v.hook) return;
  const r = withCharms("area", v.hook);
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.rank === "boss" || e.rank === "mini" || e.air) continue;
    const gap = e.x - hero.x;
    if (Math.abs(gap) > r || Math.abs(gap) < 14) continue;
    e.x = hero.x + Math.sign(gap) * 14;
  }
}

/** Rend's wider reach: foes past the Cleave's arc but inside Rend's still take its stacks */
function rendWide(s: AxeStrike): void {
  if (!skillValues("b_rend").wide) return;
  const box = axeBox(-rendReach(), rendReach(), 0, 36);
  for (const e of game.enemies) if (e.hp > 0 && !struckThisSwing(e) && boxHit(box, enemyBox(e))) rendPast(e, s);
}

/** one hit frame of the blow under way */
function strikeNow(): void {
  const blow = brannoc.current;
  const s = strikeOf(blow, brannoc.hits);
  smear(blow, s.bloodied);
  // the Bloodied Cleave's second spin strikes everyone the first did again, and anyone new
  if (brannoc.hits > 0) newSwing();
  const landed = strikeAxe(s, boxOf(blow), struckThisSwing, markStruck, blow === "reave" ? REAVE_SWEEP : 0);
  brannoc.hits++;
  if (blow === "hew") hewCrack();
  if (blow === "reave") reaveExtras();
  if (blow === "cleave") {
    rendWide(s);
    dust(hero.x + hero.face * 14, hero.y, 3);
    dust(hero.x - hero.face * 14, hero.y, 3);
    emitSkillEvent({ type: "cleave", foes: landed, bloodied: brannoc.double });
  }
}

/** Reaver's second sweep, a few frames after Reave's own */
const SECOND_SWEEP = frame(3);

/** one of Spinning Reap's turns: a fresh swing round him, a drift forward (steered in Red Tempest), a pull */
function reapTurn(): void {
  const v = skillValues("b_spinningReap");
  newSwing();
  const s: AxeStrike = { ...strikeOf("cleave", 0), power: v.power ?? 0.6, kx: 20, launch: undefined };
  smear("cleave", s.bloodied);
  strikeAxe(s, boxOf("cleave"), struckThisSwing, markStruck);
  if (v.pull)
    for (const e of game.enemies) {
      if (e.hp <= 0 || e.rank === "boss" || Math.abs(e.x - hero.x) > 60) continue;
      e.x += Math.sign(hero.x - e.x) * Math.min(v.pull, Math.max(0, Math.abs(e.x - hero.x) - 10));
    }
  brannoc.reapLeft--;
  if (brannoc.reapLeft === 0 && v.wind)
    bloodRing(hero.x, hero.y, withCharms("area", v.wind), {
      damage: progress.stats.ad * 0.6,
      stagger: true,
      source: "b_spinningReap",
    });
}

/** Spinning Reap's drift over the turns: forward, or where A or D steers Red Tempest's whirl */
function reapDrift(): number {
  const v = skillValues("b_spinningReap");
  if (v.tempest) {
    const dir = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
    return dir * 70;
  }
  return v.drift ? (hero.face * v.drift) / Math.max(REAP_TURN, REAP_TURN * reapTurns()) : 0;
}

/** the point in the Cleave's clip the turns hold at: just after its last spin, before the slam */
const reapHoldAt = (): number => {
  const hits = currentSpec().hits;
  return hits[hits.length - 1] + frame(2);
};

/** Spinning Reap's turns are under way: the pose shows the turn cycle */
export const reaping = (): boolean => hero.state === "axe" && brannoc.reapLeft > 0 && hero.st >= reapHoldAt();

/** the share of the turn under way, for the pose */
export const reapShare = (): number => Math.min(1, brannoc.reapT / REAP_TURN);

/** J on the floor: the next blow of the string, or keep the press during one */
export function pressString(): boolean {
  if (hero.state === "axe") {
    brannoc.queued = true;
    return true;
  }
  if (!isFree() || !hero.ground) return false;
  startBlow(brannoc.link > 0 ? brannoc.blow : 0);
  return true;
}

/** the blow under way: it strikes on its hit frames, Spinning Reap's turns hold it, and a kept press carries on */
export function runString(dt: number): void {
  const h = hero;
  h.vx = 0;
  if (reaping()) {
    h.st = reapHoldAt();
    h.vx = reapDrift();
    brannoc.reapT += dt * (1 + blowRate());
    if (brannoc.reapT >= REAP_TURN) {
      brannoc.reapT = 0;
      reapTurn();
    }
    return;
  }
  h.st += dt * blowRate();
  const spec = currentSpec();
  if (brannoc.hits < spec.hits.length && h.st >= spec.hits[brannoc.hits]) strikeNow();
  const second = skillValues("b_reaver").second ?? 0;
  if (brannoc.current === "reave" && second && brannoc.hits === 1 && h.st >= spec.hits[0] + SECOND_SWEEP) {
    brannoc.hits++;
    newSwing();
    strikeAxe({ ...strikeOf("reave", 0), power: second }, boxOf("reave"), struckThisSwing, markStruck);
    smear("reave", isBloodied());
  }
  if (brannoc.current === "cleave" && h.st >= spec.hits[spec.hits.length - 1] + frame(3) && !brannoc.cracked) slam();
  const next = brannoc.blow < AXE_STRING.length - 1 ? brannoc.blow + 1 : 0;
  if (brannoc.queued && brannoc.hits >= spec.hits.length && h.st >= spec.next) return startBlow(next);
  if (h.st < spec.dur) return;
  settle();
  brannoc.blow = next;
  brannoc.link = next > 0 ? AXE_LINK : 0;
}

/** the Cleave's slam into the floor ahead: a crack decal, six dust motes and a hard shake */
function slam(): void {
  brannoc.cracked = true;
  const x = hero.x + hero.face * 20;
  game.fx.push(createFloorCrack(x - CLEAVE_CRACK.width / 2, x + CLEAVE_CRACK.width / 2, hero.y, 400, RAGE_RAMP));
  dust(x, hero.y, 6);
  shake(0.12, 2);
}

/** a blow's recovery after it struck can be cut short by a jump, a Hunt or Frenzy */
export const inRecovery = (): boolean =>
  hero.state === "axe" && brannoc.hits >= currentSpec().hits.length && brannoc.reapLeft <= 0;

/** the link runs down while he is out of the string; once it lapses the next J starts a new string */
export function tickLink(dt: number): void {
  brannoc.glint = Math.max(0, brannoc.glint - dt);
  if (hero.state === "axe") return;
  brannoc.link = Math.max(0, brannoc.link - dt);
  if (brannoc.link <= 0 && hero.state !== "hatchet") hero.chain = 0;
}

/** J in the air: Hatchet Drop, once per airtime */
export function pressHatchet(): boolean {
  if (hero.ground || brannoc.hatchets <= 0 || !isFree()) return false;
  brannoc.hatchets--;
  brannoc.current = "hatchet";
  brannoc.hits = 0;
  newSwing();
  setState("hatchet");
  sfx.swing(AXE_BLOWS.hatchet.feel[0].pitch);
  return true;
}

/** Hatchet Drop: a tuck with the axe overhead that hangs at the top, then a straight chop down held to the landing */
export function runHatchet(dt: number): void {
  const h = hero;
  h.st += dt * blowRate();
  const spec = AXE_BLOWS.hatchet;
  if (brannoc.hits === 0) {
    h.vx *= 0.9;
    if (h.st < spec.hits[0]) {
      h.vy = Math.min(h.vy, 0);
      return;
    }
    brannoc.hits = 1;
    smear("hatchet", isBloodied());
    h.vy = HATCHET_FALL;
  }
  const b = spec.box;
  strikeAxe(strikeOf("hatchet", 0), axeBox(b.near, b.far, b.low, b.high), struckThisSwing, markStruck);
  if (h.ground) {
    dust(h.x + h.face * 10, h.y, 5);
    shake(0.1, 1.5);
    settle();
    return;
  }
  if (h.st >= spec.dur + 0.4) settle();
}

/** a landing gives the airtime's Hatchet Drop and Headlong back */
export function landed(): void {
  brannoc.hatchets = 1;
  brannoc.headlongs = 1;
}

/** the knockdown the Hunt Chop throws with Long Hunt's launch */
export const CHOP_LAUNCH = KNOCKDOWN * 1.5;
