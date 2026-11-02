import "@fontsource/silkscreen/400.css";
import "@fontsource/pixelify-sans/400.css";
import "@fontsource/pixelify-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles.css";
import { H, MAX_FRAME, STEP, W } from "./constants/stage";
import { game, showBanner } from "./game/state";
import { update } from "./game/update";
import { buildBackground } from "./scene/background";
import { renderScene } from "./scene/renderScene";
import { loadBest } from "./services/bestScore";
import { bindKeyboard } from "./ui/bindKeyboard";
import { bindTouch } from "./ui/bindTouch";
import { byId } from "./ui/dom";
import { fitStage } from "./ui/fitStage";
import { updateHud } from "./ui/hud";
import { bindSkillDialog, syncSkillDialog } from "./ui/skills/skillDialog";
import { bindSoundButton } from "./ui/soundButton";

const canvas = byId<HTMLCanvasElement>("game");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("This browser cannot draw to a 2D canvas.");
const image = ctx.createImageData(W, H);
const background = buildBackground();

game.best = loadBest();
bindKeyboard();
bindTouch();
bindSoundButton();
bindSkillDialog();
fitStage();
showBanner(matchMedia("(pointer: coarse)").matches ? "Tap a button to start" : "Press any key", 2.5);

// fixed 120 Hz steps; hit-stop freezes the simulation but frames keep drawing; the skill tree pauses everything
let last = performance.now();
let acc = 0;
function frame(now: number): void {
  acc += Math.min(MAX_FRAME, (now - last) / 1000);
  last = now;
  while (acc >= STEP) {
    acc -= STEP;
    if (game.mode === "skills") continue;
    if (game.freeze > 0) {
      game.freeze -= STEP;
      game.shake = Math.max(0, game.shake - STEP * 0.5);
      continue;
    }
    update(STEP);
  }
  renderScene(background, image.data);
  ctx?.putImageData(image, 0, 0);
  updateHud();
  syncSkillDialog();
  requestAnimationFrame(frame);
}
canvas.focus({ preventScroll: true });
requestAnimationFrame(frame);
