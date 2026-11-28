import { BIG_FOE_CALLS, BIG_FOE_XP_SECONDS, type BigFoeCall } from "../../constants/defense";
import { ENEMIES } from "../../constants/enemies";
import { sfx } from "../../services/audio";
import { ARTS } from "../../stages/arts";
import type { BossCard } from "../../types/bossFight";
import type { EnemyType } from "../../types/enemy";
import { levelAtSecond } from "../../utils/defenseClock";
import { xpToReach } from "../../utils/progression";
import { bigFoeHp } from "../../utils/stageArc";
import { bossArrived, bossFightSettled, bossProfile, openBossFight } from "../bossFight";
import { coop } from "../coopHooks";
import { createRift } from "../effects/rift";
import { kindOf } from "../enemies/kinds";
import { feat } from "../feat";
import { miniProfile } from "../miniBoss";
import { openPicks } from "../progress";
import { character, game, showBanner } from "../state";
import type { BigFoeOnField, Defense } from "./defense";
import { claimFoe, stageFoe } from "./foes";
import { ladderFoeFor } from "./spawner";

const BANNER = 2.2;

function bigFoeType(run: Defense, call: BigFoeCall, level: number): EnemyType {
  if (call.kind === "boss") return run.stage.boss;
  if (call.kind === "mini") return run.stage.mini.base;
  return ladderFoeFor(run, level, false);
}

function bigFoeName(run: Defense, call: BigFoeCall, type: EnemyType): string {
  return call.kind === "mini" ? run.stage.mini.name : ENEMIES[type].name;
}

function finaleCard(run: Defense, call: BigFoeCall, name: string): BossCard {
  const art = run.stage.grantsArt;
  if (call.kind === "boss" && art) return { label: "Rift Art", name: ARTS[art].name, sub: "", tone: "art" };
  return { label: "", name, sub: "Vanquished", tone: "fallen" };
}

function openFight(run: Defense, call: BigFoeCall, type: EnemyType, name: string): boolean {
  if (call.kind === "elite") return false;
  const profile = call.kind === "mini" ? miniProfile(run.stage.mini) : bossProfile(type);
  return openBossFight(profile, call.kind, finaleCard(run, call, name));
}

function callBigFoe(run: Defense, call: BigFoeCall): void {
  const level = levelAtSecond(run.elapsed);
  const type = bigFoeType(run, call, level);
  const name = bigFoeName(run, call, type);
  const epic = openFight(run, call, type, name);
  if (!epic) showBanner(call.kind === "elite" ? `Elite ${name}` : name, BANNER);
  const xp = xpToReach(levelAtSecond(run.elapsed + BIG_FOE_XP_SECONDS[call.kind])) - xpToReach(level);
  const way = run.fronts.open.includes("east") && !run.fronts.open.includes("west") ? 1 : -1;
  const x = run.field.center + way * call.distance;
  const rift = kindOf(type).rift;
  const y = rift.y();
  run.foesSpawned++;
  run.bigFoeArriving = true;
  game.fx.push(
    createRift(x, rift.riftY(y), rift.height, 0, () => {
      const elite = call.kind === "elite";
      const foe = claimFoe(stageFoe(type, x, y, level, Math.max(0, xp), elite));
      run.bigFoeArriving = false;
      run.bigFoes.push({ foe, kind: call.kind });
      if (call.kind === "mini") foe.rank = "mini";
      const soloHp = bigFoeHp(level, call.kind, run.mods);
      const hp = coop()?.scaleFoeHp(foe.rank, soloHp) ?? soloHp;
      if (epic) bossArrived(foe, name, hp);
      else Object.assign(foe, { max: hp, hp, title: name });
      sfx.bossRoar();
    }),
  );
}

function bigFoeDown(run: Defense, fallen: BigFoeOnField): void {
  run.bigFoes = run.bigFoes.filter((entry) => entry !== fallen);
  run.bigFoesDefeated++;
  if (fallen.kind === "mini") run.miniDefeated = true;
  game.cleared++;
  game.clearedAt = game.clock;
  feat({ kind: "waveCleared", wave: game.wave, hero: character.id });
  openPicks();
  sfx.gate();
}

const settled = (entry: BigFoeOnField): boolean => entry.foe.hp <= 0 && (entry.kind === "elite" || bossFightSettled());

export const callsBefore = (seconds: number): number => BIG_FOE_CALLS.filter((call) => call.at < seconds).length;

export function updateBigFoes(run: Defense): void {
  for (const entry of run.bigFoes.filter(settled)) bigFoeDown(run, entry);
  const next = BIG_FOE_CALLS[run.bigFoeCall];
  if (!next || run.bigFoeArriving || run.elapsed < next.at) return;
  if (next.kind !== "elite" && !bossFightSettled()) return;
  run.bigFoeCall++;
  callBigFoe(run, next);
}
