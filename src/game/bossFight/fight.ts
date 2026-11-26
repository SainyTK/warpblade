import { BOSS_ARENA, BOSS_ENTRANCE, BOSS_FINALE, BOSS_HASTE, BOSS_SHIFT } from "../../constants/bossFight";
import type { BossCard, BossMoment, BossProfile } from "../../types/bossFight";
import type { Enemy, EnemyState, EnemyType } from "../../types/enemy";
import { enemyCenter } from "../enemies/enemy";
import { game, rng } from "../state";
import { burst, callAdds, deflect, finaleFlash, roar, shiftBlast } from "./moments";

const DEFLECT_EVERY = 0.12;

import { bossProfile } from "./profiles";

export interface BossFight {
  type: EnemyType;
  profile: BossProfile;
  boss: Enemy | null;
  moment: BossMoment;
  t: number;
  dark: number;
  rage: number;
  phase: number;
  last: EnemyState | null;
  at: readonly [number, number];
  done: number;
  card: BossCard | null;
  cardLeft: number;
  finaleCard: BossCard;
  deflectedAt: number;
}

let fight: BossFight | null = null;

export const currentBossFight = (): BossFight | null => fight;

export function resetBossFight(): void {
  fight = null;
}

export function openBossFight(type: EnemyType, finaleCard: BossCard): boolean {
  const profile = bossProfile(type);
  if (!profile) {
    fight = null;
    return false;
  }
  fight = {
    type,
    profile,
    boss: null,
    moment: "gather",
    t: 0,
    dark: 0,
    rage: 0,
    phase: 1,
    last: null,
    at: [0, 0],
    done: 0,
    card: null,
    cardLeft: 0,
    finaleCard,
    deflectedAt: 0,
  };
  return true;
}

export function bossArrived(boss: Enemy, name: string): void {
  if (!fight) return;
  boss.max = Math.round(boss.max * fight.profile.hp);
  boss.hp = boss.max;
  boss.power *= fight.profile.power;
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

function press(f: BossFight, boss: Enemy, dt: number): void {
  const haste = boss.phase > 1 ? BOSS_HASTE.enraged : BOSS_HASTE.calm;
  boss.cd -= dt * (haste - 1);
  const combo = f.profile.combo;
  const entered = boss.state !== f.last && combo.states.includes(boss.state);
  if (entered && boss.phase > 1 && boss.stun <= 0 && rng.chance(combo.chance)) combo.cast(boss);
  f.last = boss.state;
}

function follow(f: BossFight, boss: Enemy, dt: number): void {
  if (boss.hp <= 0) {
    enter(f, "finale");
    return;
  }
  f.at = enemyCenter(boss);
  if (boss.phase > f.phase) {
    f.phase = boss.phase;
    enter(f, "shift");
    shiftBlast(f, boss);
    return;
  }
  press(f, boss, dt);
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

export function bossDeflects(e: Enemy): boolean {
  if (!fight || !bossUntouchable(e)) return false;
  if (game.t - fight.deflectedAt >= DEFLECT_EVERY) {
    fight.deflectedAt = game.t;
    deflect(fight, e);
  }
  return true;
}

export const bossFightSettled = (): boolean => !fight || fight.moment === "over";
