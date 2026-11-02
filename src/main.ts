import "@fontsource/silkscreen/400.css";
import "@fontsource/pixelify-sans/400.css";
import "@fontsource/pixelify-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles.css";
import { H, MAX_FRAME, STEP, W } from "./constants/stage";
import { game } from "./game/state";
import { update, updateAmbience } from "./game/update";
import { buildBackground } from "./scene/background";
import { renderScene } from "./scene/renderScene";
import { loadBest } from "./services/bestScore";
import { bindKeyboard } from "./ui/bindKeyboard";
import { bindPauseButton } from "./ui/bindPauseButton";
import { bindTouch } from "./ui/bindTouch";
import { byId } from "./ui/dom";
import { fitStage } from "./ui/fitStage";
import { updateHud } from "./ui/hud";
import { bindMenu } from "./ui/menu/bindMenu";
import { menuContext, openMenu } from "./ui/menu/menuState";
import { bindPickDialog, syncPickDialog } from "./ui/skills/pickDialog";

const canvas = byId<HTMLCanvasElement>("game");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("This browser cannot draw to a 2D canvas.");
const image = ctx.createImageData(W, H);
const background = buildBackground();

game.best = loadBest();
fitStage();
bindKeyboard();
bindTouch();
bindPauseButton();
bindPickDialog();
bindMenu();
openMenu("title");

/** one fixed 120 Hz step: only the scenery moves behind the start menu, a level-up pick pauses everything, hit-stop freezes all but the shake */
function step(): void {
  if (menuContext() === "title") {
    updateAmbience(STEP);
    return;
  }
  if (game.mode === "pick") return;
  if (game.freeze > 0) {
    game.freeze -= STEP;
    game.shake = Math.max(0, game.shake - STEP * 0.5);
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
    renderScene(background, image.data);
    ctx?.putImageData(image, 0, 0);
  }
  updateHud();
  syncPickDialog();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
