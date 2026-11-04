import "./fonts";
import "./styles.css";
import { CHARACTERS } from "./constants/characters";
import { H, MAX_FRAME, STEP, W } from "./constants/stage";
import { game, setCharacter } from "./game/state";
import { update, updateAmbience } from "./game/update";
import { renderScene } from "./scene/renderScene";
import { loadBest } from "./services/bestScore";
import { loadHeroChoice } from "./services/heroChoice";
import { bindKeyboard } from "./ui/bindKeyboard";
import { bindPauseButton } from "./ui/bindPauseButton";
import { byId } from "./ui/dom";
import { fitStage } from "./ui/fitStage";
import { updateHud } from "./ui/hud";
import { bindMenu } from "./ui/menu/bindMenu";
import { isMenuOpen, menuContext, openMenu } from "./ui/menu/menuState";
import { preventZoom } from "./ui/preventZoom";
import { bindPickDialog, syncPickDialog } from "./ui/skills/pickDialog";
import { bindTouch, syncTouch } from "./ui/touch/bindTouch";

const canvas = byId<HTMLCanvasElement>("game");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("This browser cannot draw to a 2D canvas.");
const image = ctx.createImageData(W, H);

game.best = loadBest();
setCharacter(CHARACTERS.find((c) => c.id === loadHeroChoice()) ?? CHARACTERS[0]);
preventZoom();
fitStage();
bindKeyboard();
bindTouch();
bindPauseButton();
bindPickDialog();
bindMenu();
openMenu("title");

/** let a screen shake run out while everything else stands still */
function settleShake(rate: number): void {
  game.shake = Math.max(0, game.shake - STEP * rate);
}

/** one fixed 120 Hz step: only the scenery moves behind the start menu, a skill pick and hit-stop freeze all but the shake */
function step(): void {
  if (menuContext() === "title") {
    updateAmbience(STEP);
    return;
  }
  if (game.mode === "pick") {
    settleShake(1);
    return;
  }
  if (game.freeze > 0) {
    game.freeze -= STEP;
    settleShake(0.5);
    return;
  }
  update(STEP);
}

// the pause menu stops time and the picture outright, so nothing piles up to catch up on when the game resumes
let last = performance.now();
let acc = 0;
function frame(now: number): void {
  acc = menuContext() === "pause" ? 0 : acc + Math.min(MAX_FRAME, (now - last) / 1000);
  last = now;
  while (acc >= STEP) {
    acc -= STEP;
    step();
  }
  if (menuContext() !== "pause") {
    renderScene(image.data);
    ctx?.putImageData(image, 0, 0);
  }
  updateHud();
  syncPickDialog();
  syncTouch(!isMenuOpen() && game.mode === "play");
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
