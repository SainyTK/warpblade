import { STAMINA } from "../constants/combat";
import { ENEMIES } from "../constants/enemies";
import { ULT_LEVELS } from "../constants/ultimate";
import { STAGE_WAVES } from "../constants/waves";
import { canPayTier, drillSession, payableTier, rechargeLeft, usesDrill } from "../drill";
import { isAdventure, stageStatus as stageLine } from "../game/adventure";
import { bossBarView } from "../game/bossFight";
import { canAffordUlt, ultRecharge } from "../game/hero/ultimate";
import { character, game, hero, progress } from "../game/state";
import { isTraining } from "../game/training";
import { inRoom } from "../store/coop";
import { bestRun } from "../store/records";
import { xpToNext } from "../utils/progression";
import { clearText } from "../utils/records";
import { minutesSeconds } from "../utils/runReport";
import { updateAbilityTabs } from "./abilityTabs";
import { updateBossCard } from "./bossCard";
import { updateBuildStrip } from "./buildStrip";
import { updateCoinCount } from "./coinCount";
import { byId } from "./dom";
import { updateFlowBar } from "./flowBar";
import { updateHeroMeter } from "./heroMeter";
import { updateHitCounter } from "./hitCounter";
import { createRechargeTab } from "./rechargeTab";
import { updateVitalBars } from "./vitalBars";
import { updateWarpTab } from "./warpTab";

const hp = byId("hpFill");
const mp = byId("mpFill");
const mpBar = byId("mpBar");
const stamina = byId("stFill");
const staminaBar = byId("stBar");
const xp = byId("xpFill");
const level = byId("level");
const chain = byId("chain");
const stageStatus = byId("wave");
const downCount = byId("downCount");
const bestRecord = byId("bestRun");
const ultRow = byId("ultName").parentElement as HTMLElement;
const ultTab = createRechargeTab(ultRow);
let ultDenied = 0;
const ultName = byId("ultName");
const ultPips = byId("ultPips");
const boss = byId("boss");
const bossName = byId("bossName");
const bossFill = byId("bossFill");
const bossMarks = byId("bossMarks");
const banner = byId("banner");
let last = "";

const pips = (n: number, lit: (i: number) => boolean): string =>
  Array.from({ length: n }, (_, i) => `<i class="${lit(i) ? "on" : ""}"></i>`).join("");

/** sync the HTML overlay with the game, touching the DOM only when something shown has changed */
export function updateHud(): void {
  updateAbilityTabs();
  updateHeroMeter();
  updateFlowBar();
  updateHitCounter();
  updateBuildStrip();
  updateWarpTab();
  updateCoinCount();
  updateVitalBars();
  updateBossCard();
  const session = usesDrill() ? drillSession() : undefined;
  const drill = session !== undefined;
  const fighter = session?.fighter;
  const tier = session && (fighter?.skillCast?.tier ?? payableTier(session.profile, fighter?.chargeHeldFor ?? 0));
  const ultimateName = drill ? (tier?.name ?? "Charged skill") : character.special.name;
  ultTab.update(fighter ? rechargeLeft(fighter.chargeRecharge) : ultRecharge());
  if (hero.denied.ult > ultDenied) ultTab.jolt();
  ultDenied = hero.denied.ult;
  const leader = game.enemies.find((e) => e.rank !== "minion");
  const bar = leader ? bossBarView(leader) : null;
  const room = inRoom();
  const waveMode = room || (!isAdventure() && !isTraining() && game.wave > 0);
  const best = room ? bestRun() : null;
  const status = isTraining()
    ? "TRAINING GROUND"
    : waveMode
      ? `STAGE ${game.stage}  WAVE ${game.wave}/${STAGE_WAVES}`
      : stageLine().toUpperCase();
  const time = minutesSeconds(game.clock);
  const affordable = session
    ? (tier?.level ??
      (session.fighter.chargeRecharge.remaining > 0 ? 0 : session.profile.tiers.filter(canPayTier).length))
    : hero.ultCd > 0
      ? 0
      : ULT_LEVELS.filter((_, i) => canAffordUlt(i + 1)).length;
  const comboLimit = session
    ? Object.values(session.profile.strikes).filter((strike) => strike.next !== null).length + 1
    : progress.comboLimit;
  const key = [
    Math.round(hero.hp),
    Math.round(hero.mp),
    progress.stats.hp,
    progress.stats.mp,
    hero.denied.mp > 0,
    Math.round(hero.stamina),
    progress.stats.stamina,
    hero.staminaFlash > 0,
    progress.level,
    progress.xp,
    comboLimit,
    hero.chain,
    ultimateName,
    affordable,
    status,
    game.kills,
    time,
    best?.waves,
    best?.seconds,
    leader?.type,
    leader ? Math.ceil(leader.hp) : -1,
    bar?.marks.join(":"),
    bar?.phase,
    bar?.shielded,
    game.banner.text,
    game.banner.time > 0,
  ].join();
  if (key === last) return;
  last = key;
  hp.style.width = `${(hero.hp / progress.stats.hp) * 100}%`;
  mp.style.width = `${(hero.mp / progress.stats.mp) * 100}%`;
  mpBar.classList.toggle("empty", hero.denied.mp > 0);
  stamina.style.width = `${(hero.stamina / progress.stats.stamina) * 100}%`;
  staminaBar.classList.toggle("empty", hero.staminaFlash > 0);
  staminaBar.style.setProperty("--dash-share", `${(STAMINA.dashCost / progress.stats.stamina) * 100}%`);
  const need = xpToNext(progress.level);
  xp.style.width = need ? `${(progress.xp / need) * 100}%` : "100%";
  level.textContent = `LV ${progress.level}`;
  chain.innerHTML = pips(comboLimit, (i) => i < hero.chain);
  stageStatus.textContent = `${status}  ${time}`;
  downCount.textContent = `${game.kills} DOWN`;
  bestRecord.textContent = best ? `  BEST ${clearText(best).toUpperCase()}` : "";
  ultName.textContent = ultimateName.toUpperCase();
  ultPips.innerHTML = pips(session ? session.profile.tiers.length : ULT_LEVELS.length, (i) => i < affordable);
  boss.hidden = !leader;
  if (leader) {
    bossName.textContent = ENEMIES[leader.type].name.toUpperCase();
    bossFill.style.width = `${(Math.max(0, leader.hp) / leader.max) * 100}%`;
  }
  boss.classList.toggle("enraged", (bar?.phase ?? 1) > 1);
  boss.classList.toggle("shielded", !!bar?.shielded);
  bossMarks.innerHTML = (bar?.marks ?? []).map((m) => `<i style="left:${m * 100}%"></i>`).join("");
  banner.textContent = game.banner.text;
  banner.classList.toggle("show", game.banner.time > 0);
}
