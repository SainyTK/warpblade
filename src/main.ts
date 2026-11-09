// the heroes' kits load first: Ysra's kit reads its parts as it loads, and the combo engine those parts use reaches
// back to the kits, so a part reached first by another path would not be ready yet
import "./game/hero/kits";
import { CHARACTERS } from "./constants/characters";
import { MAX_FRAME, STEP } from "./constants/stage";
import { frameDriver } from "./game/frameDriver";
import { chooseCharacter, game } from "./game/state";
import { stepGame } from "./game/step";
import { startAnalytics } from "./services/analytics";
import { loadBest } from "./services/bestScore";
import { loadHeroChoice } from "./services/heroChoice";
import { heroUnlocked } from "./store/meta";
import { bindAchievementToasts } from "./ui/achievements/achievementToast";
import { bindKeyboard } from "./ui/bindKeyboard";
import { bindPauseButton } from "./ui/bindPauseButton";
import { bindChestDialog, syncChestDialog } from "./ui/chest/chestDialog";
import { drawDangerGlow } from "./ui/dangerGlow";
import { fitStage } from "./ui/fitStage";
import { paintScene } from "./ui/gameCanvas";
import { updateHud } from "./ui/hud";
import { bindMenu } from "./ui/menu/bindMenu";
import { joinFromInvite } from "./ui/menu/joinFromInvite";
import { isMenuOpen, menuContext, openMenu } from "./ui/menu/menuState";
import { preventZoom } from "./ui/preventZoom";
import { bindPickDialog, syncPickDialog } from "./ui/skills/pickDialog";
import { bindTouch, syncTouch } from "./ui/touch/bindTouch";
import { bindDiscoveryToasts } from "./ui/unlocks/discoveryToast";

startAnalytics();
game.best = loadBest();
chooseCharacter(CHARACTERS.find((c) => c.id === loadHeroChoice() && heroUnlocked(c.id)) ?? CHARACTERS[0]);
preventZoom();
fitStage();
bindKeyboard();
bindTouch();
bindPauseButton();
bindPickDialog();
bindChestDialog();
bindMenu();
bindAchievementToasts();
bindDiscoveryToasts();
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
  if (menuContext() !== "pause") {
    paintScene();
    drawDangerGlow(menuContext() !== "title");
  }
  updateHud();
  syncPickDialog();
  syncChestDialog();
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
