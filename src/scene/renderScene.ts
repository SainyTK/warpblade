import { SKY_FLASH } from "../constants/effectLook";
import { drawDrillOver } from "../drill";
import { beginFrame, composite, setCameraX, setShake } from "../engine/frame";
import { drawStageHazardBack, drawStageHazardFront, stageCameraX } from "../game/adventure";
import { drawBossArenaBack, drawBossArenaFront } from "../game/bossFight";
import { drawChests } from "../game/build/chests";
import { coop, eachHero } from "../game/coopHooks";
import { shownKit } from "../game/hero/kits";
import { drawSkills, drawSkillsBack } from "../game/skills/runtime";
import { fxRng, game, hero, lights, particles } from "../game/state";
import { settings } from "../store/settings";
import { adventureBackdrop } from "./adventureBackdrop";
import { drawAdventureTerrain } from "./adventureTerrain";
import { drawEnemies, drawHeroLayer, drawPickups } from "./drawActors";
import { drawAmbientLight, drawMist, drawWeather, sceneFlash } from "./drawAmbience";
import { drawCoins } from "./drawCoins";
import { drawMentor } from "./drawMentor";
import { drawNumbers } from "./drawNumbers";
import { drawShadows } from "./drawShadows";
import { drawShards } from "./drawShards";
import { drawSpikes } from "./drawSpikes";
import { drawXpOrbs } from "./drawXpOrbs";
import { paletteAt } from "./eras/sceneDef";
import { scene, sceneBackground } from "./scenery";

const SHAKE_FULL = 0.25;
const FLASH_STRENGTH = 70;

/** draw one frame back to front into RGBA bytes */
export function renderScene(out: Uint8ClampedArray): void {
  const s = game.shake > 0 && settings.shake ? game.shake / SHAKE_FULL : 0;
  setShake(Math.round(fxRng.range(-game.amp, game.amp) * s), Math.round(fxRng.range(-game.amp, game.amp) * s));
  if (game.shake <= 0) game.amp = 0;
  setCameraX(0);
  const { def, k, arena } = scene();
  const cameraX = arena ? 0 : stageCameraX();
  const palette = paletteAt(def, k);
  const background = sceneBackground();
  beginFrame(arena ? background : adventureBackdrop(background, cameraX, palette));
  drawAmbientLight();
  setCameraX(cameraX);
  if (!arena) {
    drawAdventureTerrain(cameraX, game.t, palette);
    drawSpikes(cameraX, game.t);
    drawStageHazardBack(cameraX, game.t);
    drawBossArenaBack();
  }
  const room = coop();
  for (const f of game.fx) {
    room?.owner(f);
    f.drawBack?.();
  }
  particles.draw("back");
  drawSkillsBack();
  drawChests();
  drawShadows();
  if (!arena) drawMentor(cameraX, game.t);
  eachHero(() => shownKit().drawFloor?.());
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
  drawShards();
  if (!arena) drawStageHazardFront(cameraX, game.t);
  setCameraX(0);
  drawWeather();
  drawMist();
  setCameraX(cameraX);
  lights.draw();
  if (!arena) drawBossArenaFront();
  drawNumbers();
  drawDrillOver(cameraX);
  eachHero(() => shownKit().drawOver?.());
  room?.drawOverlay();
  setCameraX(0);
  const bolt = game.flash > 0 ? game.flash / SKY_FLASH : 0;
  composite(out, Math.min(1, bolt + sceneFlash()) * FLASH_STRENGTH);
}
