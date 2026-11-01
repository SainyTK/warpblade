import { MAX_HP, MAX_MP } from "../constants/combat";
import { game, hero } from "../game/state";
import { byId } from "./dom";

const hp = byId("hpFill");
const mp = byId("mpFill");
const score = byId("score");
const banner = byId("banner");
const elements = [byId("elFire"), byId("elIce"), byId("elVolt")];
let last = "";

/** sync the HTML overlay with the game, touching the DOM only when something shown has changed */
export function updateHud(): void {
  const key = [
    Math.round(hero.hp),
    Math.round(hero.mp),
    game.spell,
    game.wave,
    game.kills,
    game.best,
    game.banner.text,
    game.banner.time > 0,
  ].join();
  if (key === last) return;
  last = key;
  hp.style.width = `${(hero.hp / MAX_HP) * 100}%`;
  mp.style.width = `${(hero.mp / MAX_MP) * 100}%`;
  elements.forEach((el, i) => {
    el.classList.toggle("on", i === game.spell);
  });
  score.textContent = `WAVE ${game.wave} · ${game.kills} DOWN${game.best ? ` · BEST ${game.best}` : ""}`;
  banner.textContent = game.banner.text;
  banner.classList.toggle("show", game.banner.time > 0);
}
