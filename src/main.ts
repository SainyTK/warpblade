import { CHARACTERS } from "./constants/characters";
import { MAX_FRAME, STEP } from "./constants/stage";
import { frameDriver } from "./game/frameDriver";
import { game, setCharacter } from "./game/state";
import { stepGame } from "./game/step";
import { loadBest } from "./services/bestScore";
import { loadHeroChoice } from "./services/heroChoice";
import { bindKeyboard } from "./ui/bindKeyboard";
import { bindPauseButton } from "./ui/bindPauseButton";
import { fitStage } from "./ui/fitStage";
import { paintScene } from "./ui/gameCanvas";
import { updateHud } from "./ui/hud";
import { bindMenu } from "./ui/menu/bindMenu";
import { joinFromInvite } from "./ui/menu/joinFromInvite";
import { isMenuOpen, menuContext, openMenu } from "./ui/menu/menuState";
import { preventZoom } from "./ui/preventZoom";
import { bindPickDialog, syncPickDialog } from "./ui/skills/pickDialog";
import { bindTouch, syncTouch } from "./ui/touch/bindTouch";

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
joinFromInvite();

// the pause menu stops time and the picture outright, so nothing piles up to catch up on when the game resumes
let last = performance.now();
let acc = 0;
function soloFrame(now: number): void {
  acc = menuContext() === "pause" ? 0 : acc + Math.min(MAX_FRAME, (now - last) / 1000);
  last = now;
  while (acc >= STEP) {
    acc -= STEP;
    stepGame();
  }
  if (menuContext() !== "pause") paintScene();
  updateHud();
  syncPickDialog();
  syncTouch(!isMenuOpen() && game.mode === "play");
}

/** a co-op room runs its own frames while it is open; solo play picks up with a fresh clock when it closes */
function frame(now: number): void {
  const driver = frameDriver();
  if (driver) {
    driver(now);
    last = now;
    acc = 0;
  } else soloFrame(now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
