import { beginFrame, composite, setShake } from "../engine/frame";
import { SKY_FLASH } from "../game/spells/bolt";
import { game, hero, lights, particles, rng } from "../game/state";
import { settings } from "../store/settings";
import { drawEnemies, drawHeroLayer, drawPickups } from "./drawActors";
import { drawAmbientLight, drawAnchors, drawMist } from "./drawAmbience";
import { drawCoins } from "./drawCoins";
import { drawNumbers } from "./drawNumbers";

const SHAKE_FULL = 0.25;
const FLASH_STRENGTH = 70;

/** draw one frame back to front into RGBA bytes */
export function renderScene(background: Uint32Array, out: Uint8ClampedArray): void {
  const s = game.shake > 0 && settings.shake ? game.shake / SHAKE_FULL : 0;
  setShake(Math.round(rng.range(-game.amp, game.amp) * s), Math.round(rng.range(-game.amp, game.amp) * s));
  if (game.shake <= 0) game.amp = 0;
  beginFrame(background);
  drawAmbientLight();
  drawAnchors();
  for (const f of game.fx) f.drawBack?.();
  particles.draw("back");
  drawEnemies();
  drawHeroLayer();
  for (const f of game.fx) f.draw();
  hero.sword?.draw();
  particles.draw("front");
  drawPickups();
  drawCoins();
  drawMist();
  lights.draw();
  drawNumbers();
  composite(out, game.flash > 0 ? (game.flash / SKY_FLASH) * FLASH_STRENGTH : 0);
}
