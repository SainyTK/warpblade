import { beginFrame, composite, setShake } from "../engine/frame";
import { drawChests } from "../game/build/chests";
import { coop, eachHero } from "../game/coopHooks";
import { drawSkills, drawSkillsBack } from "../game/skills/runtime";
import { SKY_FLASH } from "../game/spells/lightning";
import { game, hero, lights, particles, rng } from "../game/state";
import { settings } from "../store/settings";
import { drawEnemies, drawHeroLayer, drawPickups } from "./drawActors";
import { drawAmbientLight, drawAnchors, drawMist, drawWarpAim, drawWeather, sceneFlash } from "./drawAmbience";
import { drawCoins } from "./drawCoins";
import { drawNumbers } from "./drawNumbers";
import { drawXpOrbs } from "./drawXpOrbs";
import { sceneBackground } from "./scenery";

const SHAKE_FULL = 0.25;
const FLASH_STRENGTH = 70;

/** draw one frame back to front into RGBA bytes */
export function renderScene(out: Uint8ClampedArray): void {
  const s = game.shake > 0 && settings.shake ? game.shake / SHAKE_FULL : 0;
  setShake(Math.round(rng.range(-game.amp, game.amp) * s), Math.round(rng.range(-game.amp, game.amp) * s));
  if (game.shake <= 0) game.amp = 0;
  beginFrame(sceneBackground());
  drawAmbientLight();
  drawAnchors();
  eachHero(drawWarpAim);
  const room = coop();
  for (const f of game.fx) {
    room?.owner(f);
    f.drawBack?.();
  }
  particles.draw("back");
  drawSkillsBack();
  drawChests();
  drawEnemies();
  room?.drawUnderlay();
  eachHero(drawHeroLayer);
  for (const f of game.fx) {
    room?.owner(f);
    f.draw();
  }
  drawSkills();
  eachHero(() => hero.sword?.draw());
  particles.draw("front");
  drawPickups();
  drawCoins();
  drawXpOrbs();
  drawWeather();
  drawMist();
  lights.draw();
  drawNumbers();
  room?.drawOverlay();
  const bolt = game.flash > 0 ? game.flash / SKY_FLASH : 0;
  composite(out, Math.min(1, bolt + sceneFlash()) * FLASH_STRENGTH);
}
