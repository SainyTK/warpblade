import { ENEMIES } from "../constants/enemies";
import { ULT_LABEL } from "../constants/skillLabels";
import { ULT_LEVELS } from "../constants/ultimate";
import { STAGE_WAVES } from "../constants/waves";
import { canAffordUlt } from "../game/hero/ultimate";
import { game, hero, progress } from "../game/state";
import { xpToNext } from "../utils/progression";
import { byId } from "./dom";

const hp = byId("hpFill");
const mp = byId("mpFill");
const xp = byId("xpFill");
const level = byId("level");
const chain = byId("chain");
const points = byId("points");
const wave = byId("wave");
const score = byId("score");
const ultName = byId("ultName");
const ultPips = byId("ultPips");
const boss = byId("boss");
const bossName = byId("bossName");
const bossFill = byId("bossFill");
const banner = byId("banner");
const elements = [byId("elFire"), byId("elIce"), byId("elVolt")];
let last = "";

const pips = (n: number, lit: (i: number) => boolean): string =>
  Array.from({ length: n }, (_, i) => `<i class="${lit(i) ? "on" : ""}"></i>`).join("");

/** sync the HTML overlay with the game, touching the DOM only when something shown has changed */
export function updateHud(): void {
  const leader = game.enemies.find((e) => e.rank !== "minion");
  const affordable = ULT_LEVELS.filter((_, i) => canAffordUlt(i + 1)).length;
  const key = [
    Math.round(hero.hp),
    Math.round(hero.mp),
    progress.stats.hp,
    progress.stats.mp,
    progress.level,
    progress.xp,
    progress.points,
    progress.comboLimit,
    hero.chain,
    progress.ultimate,
    affordable,
    game.spell,
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
  const need = xpToNext(progress.level);
  xp.style.width = need ? `${(progress.xp / need) * 100}%` : "100%";
  level.textContent = `LV ${progress.level}`;
  chain.innerHTML = pips(progress.comboLimit, (i) => i < hero.chain);
  points.textContent = progress.points ? `${progress.points} SP` : "";
  elements.forEach((el, i) => {
    el.classList.toggle("on", i === game.spell);
  });
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
