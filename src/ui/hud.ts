import { STAMINA } from "../constants/combat";
import { ENEMIES } from "../constants/enemies";
import { ULT_LABEL } from "../constants/skillLabels";
import { ULT_LEVELS } from "../constants/ultimate";
import { STAGE_WAVES } from "../constants/waves";
import { canAffordUlt, ultRecharge } from "../game/hero/ultimate";
import { game, hero, progress } from "../game/state";
import { xpToNext } from "../utils/progression";
import { updateAbilityTabs } from "./abilityTabs";
import { updateBuildStrip } from "./buildStrip";
import { updateCoinCount } from "./coinCount";
import { updateDebtBar } from "./debtBar";
import { byId } from "./dom";
import { updateFlowBar } from "./flowBar";
import { updateGloamBar } from "./gloamBar";
import { updateGritBar } from "./gritBar";
import { updateGrooveBar } from "./grooveBar";
import { updateHeatBar } from "./heatBar";
import { updateHitCounter } from "./hitCounter";
import { updateMomentumBar } from "./momentumBar";
import { updateQuiverBar } from "./quiverBar";
import { createRechargeTab } from "./rechargeTab";
import { updateSandBar } from "./sandBar";
import { updateTallisTabs } from "./tallisTabs";
import { updateWarpTab } from "./warpTab";
import { updateWaxBar } from "./waxBar";
import { updateWennaTabs } from "./wennaTabs";

const hp = byId("hpFill");
const mp = byId("mpFill");
const mpBar = byId("mpBar");
const stamina = byId("stFill");
const staminaBar = byId("stBar");
const xp = byId("xpFill");
const level = byId("level");
const chain = byId("chain");
const wave = byId("wave");
const score = byId("score");
const ultRow = byId("ultName").parentElement as HTMLElement;
const ultTab = createRechargeTab(ultRow);
let ultDenied = 0;
const ultName = byId("ultName");
const ultPips = byId("ultPips");
const boss = byId("boss");
const bossName = byId("bossName");
const bossFill = byId("bossFill");
const banner = byId("banner");
let last = "";

const pips = (n: number, lit: (i: number) => boolean): string =>
  Array.from({ length: n }, (_, i) => `<i class="${lit(i) ? "on" : ""}"></i>`).join("");

/** sync the HTML overlay with the game, touching the DOM only when something shown has changed */
export function updateHud(): void {
  updateAbilityTabs();
  updateWennaTabs();
  updateTallisTabs();
  updateDebtBar();
  updateHeatBar();
  updateGritBar();
  updateQuiverBar();
  updateMomentumBar();
  updateSandBar();
  updateWaxBar();
  updateGloamBar();
  updateGrooveBar();
  updateFlowBar();
  updateHitCounter();
  updateBuildStrip();
  updateWarpTab();
  updateCoinCount();
  ultTab.update(ultRecharge());
  if (hero.denied.ult > ultDenied) ultTab.jolt();
  ultDenied = hero.denied.ult;
  const leader = game.enemies.find((e) => e.rank !== "minion");
  const affordable = hero.ultCd > 0 ? 0 : ULT_LEVELS.filter((_, i) => canAffordUlt(i + 1)).length;
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
    progress.comboLimit,
    hero.chain,
    progress.ultimate,
    affordable,
    game.wave,
    game.kills,
    game.best,
    leader ? Math.ceil(leader.hp) : -1,
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
  chain.innerHTML = pips(progress.comboLimit, (i) => i < hero.chain);
  wave.textContent = `STAGE ${game.stage}  WAVE ${game.wave}/${STAGE_WAVES}`;
  score.textContent = `${game.kills} DOWN${game.best ? `  BEST WAVE ${game.best}` : ""}`;
  ultName.textContent = ULT_LABEL[progress.ultimate];
  ultPips.innerHTML = pips(ULT_LEVELS.length, (i) => i < affordable);
  boss.hidden = !leader;
  if (leader) {
    bossName.textContent = ENEMIES[leader.type].name.toUpperCase();
    bossFill.style.width = `${(Math.max(0, leader.hp) / leader.max) * 100}%`;
  }
  banner.textContent = game.banner.text;
  banner.classList.toggle("show", game.banner.time > 0);
}
