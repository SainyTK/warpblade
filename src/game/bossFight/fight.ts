import {
  BOSS_ARENA,
  BOSS_ENTRANCE,
  BOSS_FINALE,
  BOSS_FRENZY,
  BOSS_HASTE,
  BOSS_PHASES,
  BOSS_SHIFT,
  ENRAGE_AFTER,
} from "../../constants/bossFight";
import { BIG_FOE_POWER } from "../../constants/stageArc";
import { sfx } from "../../services/audio";
import type { BossCard, BossMoment, BossProfile } from "../../types/bossFight";
import type { Enemy, EnemyState } from "../../types/enemy";
import { enemyCenter } from "../enemies/enemy";
import { game, rng, showBanner } from "../state";
import { type ControlMemory, forgetControl, resistControl } from "./control";
import { burst, callAdds, deflect, finaleFlash, roar, shiftBlast, telegraph } from "./moments";
import { freshPoise, type Poise, updatePoise } from "./poise";

const DEFLECT_EVERY = 0.12;
const FIRST_SIGNATURE = 0.6;

export type FightKind = "mini" | "boss";

export interface BossFight {
  profile: BossProfile;
  kind: FightKind;
  boss: Enemy | null;
  moment: BossMoment;
  t: number;
  dark: number;
  rage: number;
  phase: number;
  clock: number;
  enraged: boolean;
  last: EnemyState | null;
  at: readonly [number, number];
  card: BossCard | null;
  cardLeft: number;
  finaleCard: BossCard;
  deflectedAt: number;
  signatureIn: number;
  charging: number;
  signatures: number;
  poise: Poise;
  control: ControlMemory;
}

let fight: BossFight | null = null;

export const currentBossFight = (): BossFight | null => fight;

export function resetBossFight(): void {
  fight = null;
}

export function openBossFight(profile: BossProfile | null, kind: FightKind, finaleCard: BossCard): boolean {
  if (!profile) {
    fight = null;
    return false;
  }
  fight = {
    profile,
    kind,
    boss: null,
    moment: "gather",
    t: 0,
    dark: 0,
    rage: 0,
    phase: 1,
    clock: 0,
    enraged: false,
    last: null,
    at: [0, 0],
    card: null,
    cardLeft: 0,
    finaleCard,
    deflectedAt: 0,
    signatureIn: (profile.signature?.every[0] ?? 0) * FIRST_SIGNATURE,
    charging: 0,
    signatures: 0,
    poise: freshPoise(),
    control: forgetControl(),
  };
  return true;
}

export function bossArrived(boss: Enemy, name: string, hp: number): void {
  if (!fight) return;
  boss.max = hp;
  boss.hp = hp;
  boss.power *= fight.profile.power * BIG_FOE_POWER;
  boss.title = name;
  Object.assign(fight, { boss, moment: "entrance", t: 0, last: boss.state, at: enemyCenter(boss) });
  showCard(fight, { label: "", name, sub: fight.profile.epithet, tone: "boss" }, BOSS_ENTRANCE.card);
}

function showCard(f: BossFight, card: BossCard, seconds: number): void {
  f.card = card;
  f.cardLeft = seconds;
}

function enter(f: BossFight, moment: BossMoment): void {
  f.moment = moment;
  f.t = 0;
}

function darkness(f: BossFight): number {
  if (f.moment === "gather" || f.moment === "entrance") return BOSS_ARENA.gather;
  if (f.moment === "finale") return BOSS_ARENA.finale;
  if (f.moment === "over") return 0;
  return f.phase > 1 ? BOSS_ARENA.rage : BOSS_ARENA.fight;
}

function crossed(f: BossFight, at: number, dt: number): boolean {
  return f.t >= at && f.t - dt < at;
}

function haste(f: BossFight): number {
  if (f.enraged) return BOSS_FRENZY.enraged;
  if (f.phase >= 3) return BOSS_FRENZY.haste;
  return f.phase > 1 ? BOSS_HASTE.enraged : BOSS_HASTE.calm;
}

function press(f: BossFight, boss: Enemy, dt: number): void {
  boss.cd -= dt * (haste(f) - 1);
  const combo = f.profile.combo;
  if (!combo) return;
  const entered = boss.state !== f.last && combo.states.includes(boss.state);
  const chance = f.phase > 1 ? combo.chance : combo.chance * BOSS_HASTE.calmCombo;
  if (entered && boss.stun <= 0 && rng.chance(chance)) combo.cast(boss);
  f.last = boss.state;
}

function sign(f: BossFight, boss: Enemy, dt: number): void {
  const signature = f.profile.signature;
  if (!signature || boss.stun > 0) return;
  if (f.charging > 0) {
    f.charging -= dt;
    if (f.charging > 0) return;
    signature.cast(boss, f.signatures++);
    const every = signature.every[f.phase > 1 ? 1 : 0];
    f.signatureIn = f.phase >= 3 || f.enraged ? every / BOSS_FRENZY.haste : every;
    return;
  }
  f.signatureIn -= dt;
  if (f.signatureIn > 0) return;
  f.charging = signature.telegraph;
  telegraph(f, boss, signature.telegraph);
}

function phaseNow(f: BossFight, boss: Enemy): number {
  const share = boss.hp / boss.max;
  if (share <= BOSS_PHASES.third) return 3;
  if (f.profile.drivesPhase && share <= BOSS_PHASES.second) boss.phase = Math.max(boss.phase, 2);
  return Math.max(f.phase, boss.phase > 1 ? 2 : 1);
}

function enrage(f: BossFight, boss: Enemy): void {
  const limit = ENRAGE_AFTER[f.kind];
  if (f.enraged || limit === null || f.clock < limit) return;
  f.enraged = true;
  boss.power *= BOSS_FRENZY.enragedPower;
  showBanner(`${boss.title ?? ""} is enraged`, 2);
  sfx.bossRoar();
}

function follow(f: BossFight, boss: Enemy, dt: number): void {
  if (boss.hp <= 0) {
    enter(f, "finale");
    return;
  }
  f.at = enemyCenter(boss);
  f.clock += dt;
  enrage(f, boss);
  resistControl(f.control, boss, dt);
  updatePoise(f.poise, boss, dt);
  const phase = phaseNow(f, boss);
  if (phase > f.phase) {
    f.phase = phase;
    f.charging = 0;
    enter(f, "shift");
    shiftBlast(f, boss);
    return;
  }
  press(f, boss, dt);
  sign(f, boss, dt);
}

function stepFinale(f: BossFight, dt: number): void {
  if (f.t - dt <= 0) burst(f, true);
  const shown = Math.floor(f.t / BOSS_FINALE.every);
  const before = Math.floor((f.t - dt) / BOSS_FINALE.every);
  if (shown !== before && shown < BOSS_FINALE.bursts) burst(f, false);
  if (crossed(f, BOSS_FINALE.flashAt, dt)) {
    finaleFlash(f);
    showCard(f, f.finaleCard, BOSS_FINALE.card);
  }
  if (f.t >= BOSS_FINALE.done) enter(f, "over");
}

export function updateBossFight(dt: number): void {
  const f = fight;
  if (!f) return;
  f.t += dt;
  f.cardLeft = Math.max(0, f.cardLeft - dt);
  f.dark += (darkness(f) - f.dark) * (1 - Math.exp(-BOSS_ARENA.ease * dt));
  f.rage += ((f.phase > 1 && f.moment !== "over" ? 1 : 0) - f.rage) * (1 - Math.exp(-BOSS_ARENA.ease * dt));
  const boss = f.boss;
  if (f.moment === "entrance" && boss) {
    if (crossed(f, BOSS_ENTRANCE.roarAt, dt)) roar(f, boss);
    if (f.t >= BOSS_ENTRANCE.hold) enter(f, "fight");
  } else if (f.moment === "fight" && boss) follow(f, boss, dt);
  else if (f.moment === "shift" && boss) {
    if (crossed(f, BOSS_SHIFT.addsAt, dt)) callAdds(f);
    if (boss.hp <= 0) enter(f, "finale");
    else if (f.t >= BOSS_SHIFT.untouchable) {
      f.last = boss.state;
      enter(f, "fight");
    }
  } else if (f.moment === "finale") stepFinale(f, dt);
}

export const bossHeld = (e: Enemy): boolean => fight?.boss === e && fight.moment === "entrance";

export const bossUntouchable = (e: Enemy): boolean =>
  fight?.boss === e && (fight.moment === "entrance" || fight.moment === "shift");

export const bossCharging = (e: Enemy): number =>
  fight?.boss === e && fight.charging > 0 && fight.profile.signature
    ? 1 - fight.charging / fight.profile.signature.telegraph
    : 0;

export function bossDeflects(e: Enemy): boolean {
  if (!fight || !bossUntouchable(e)) return false;
  if (game.t - fight.deflectedAt >= DEFLECT_EVERY) {
    fight.deflectedAt = game.t;
    deflect(fight, e);
  }
  return true;
}

export function bossTook(e: Enemy, amount: number): void {
  if (fight?.boss !== e || fight.moment !== "fight") return;
  fight.poise.taken += amount;
}

export const bossFightSettled = (): boolean => !fight || fight.moment === "over";
