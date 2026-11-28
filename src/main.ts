import "./heroes";
import { MAX_FRAME, STEP } from "./constants/stage";
import { preloadFoeArt } from "./foeArt";
import { frameDriver } from "./game/frameDriver";
import { musicTrack } from "./game/musicTrack";
import { chooseCharacter, game } from "./game/state";
import { stepGame } from "./game/step";
import { preloadGeneratedRoster } from "./generatedHeroArt";
import { CHARACTERS } from "./heroes/roster";
import { preloadMentorArt } from "./mentorArt";
import { startAnalytics } from "./services/analytics";
import { playMusic } from "./services/audio";
import { loadHeroChoice } from "./services/heroChoice";
import { paintsStage, readTrainingHero } from "./services/playtestStart";
import { preloadSkillArt } from "./skillArt";
import { chosenJob } from "./store/jobs";
import { heroUnlocked } from "./store/unlocks";
import { bindAchievementToasts } from "./ui/achievements/achievementToast";
import { bindKeyboard } from "./ui/bindKeyboard";
import { bindPauseButton } from "./ui/bindPauseButton";
import { bindChestDialog, syncChestDialog } from "./ui/chest/chestDialog";
import { drawDangerGlow } from "./ui/dangerGlow";
import { fitStage } from "./ui/fitStage";
import { paintScene } from "./ui/gameCanvas";
import { updateHud } from "./ui/hud";
import { bindMentorPrompt, syncMentorPrompt } from "./ui/mentorPrompt";
import { bindMenu } from "./ui/menu/bindMenu";
import { bindRoomLook } from "./ui/menu/bindRoomLook";
import { joinFromInvite } from "./ui/menu/joinFromInvite";
import { startGame } from "./ui/menu/menuActions";
import { isMenuOpen, menuContext, openMenu } from "./ui/menu/menuState";
import { preventZoom } from "./ui/preventZoom";
import { bindPickDialog, syncPickDialog } from "./ui/skills/pickDialog";
import { bindTouch, syncTouch } from "./ui/touch/bindTouch";
import { bindDiscoveryToasts } from "./ui/unlocks/discoveryToast";

await Promise.all([preloadGeneratedRoster(CHARACTERS), preloadFoeArt(), preloadMentorArt(), preloadSkillArt()]);
startAnalytics();
const trainingHero = CHARACTERS.find((c) => c.id === readTrainingHero());
const firstHero =
  trainingHero ?? CHARACTERS.find((c) => c.id === loadHeroChoice() && heroUnlocked(c.id)) ?? CHARACTERS[0];
chooseCharacter(firstHero, trainingHero ? null : chosenJob(firstHero.id));
preventZoom();
fitStage();
bindKeyboard();
bindTouch();
bindPauseButton();
bindMentorPrompt();
bindPickDialog();
bindChestDialog();
bindRoomLook();
bindMenu();
bindAchievementToasts();
bindDiscoveryToasts();
if (trainingHero) startGame();
else openMenu("title");
joinFromInvite();

const painting = paintsStage();

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
  if (painting && menuContext() !== "pause") {
    paintScene();
    drawDangerGlow(menuContext() !== "title");
  }
  updateHud();
  syncPickDialog();
  syncChestDialog();
  syncTouch(!isMenuOpen() && game.mode === "play");
  playMusic(musicTrack(menuContext() === "title"));
}

/** a co-op room runs its own frames while it is open; solo play picks up with a fresh clock when it closes */
function frame(now: number): void {
  const driver = frameDriver();
  if (driver) {
    driver(now);
    last = now;
    acc = 0;
  } else soloFrame(now);
  syncMentorPrompt();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
