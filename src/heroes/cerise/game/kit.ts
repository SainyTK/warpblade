import { ACTION_CLIPS } from "../../../constants/clips";
import { STRIDE } from "../../../constants/motion";
import { isFree } from "../../../game/hero/actions";
import { blowsDone } from "../../../game/hero/combo";
import { resetMotion } from "../../../game/hero/motion";
import { castLanded } from "../../../game/hero/sharedCut";
import { hero } from "../../../game/state";
import type { HeroKit } from "../../../types/kit";
import { CERISE_SLOTS, rechargeAbilities } from "./abilities";
import { runFlurry } from "./abilities/flurry";
import { runLineCast } from "./abilities/roseLine";
import { releaseSpell } from "./abilities/spells";
import { afterStrike } from "./afterStrike";
import { hitBonus, takenBonus } from "./bonus";
import { chooseMove } from "./chooseMove";
import { resetFeint, tickFeint } from "./feint";
import { CERISE_GUARD } from "./guardStyle";
import { keenWindow } from "./keen";
import { landed } from "./landed";
import { poiseScale } from "./lunge";
import { drawMarks, resetMarks, tickMarks } from "./mark";
import { dodgeHooks } from "./passingTouch";
import { cerisePose } from "./pose";
import { readActions } from "./readActions";
import { endRiposte, runRiposte } from "./riposte";
import { shapeHit } from "./shapeHit";
import { absorbHurt, drawStance } from "./stance";
import { cerise, resetCeriseState, tickCeriseState } from "./state";
import { runTempest, tempestDrives } from "./tempest";
import { CERISE_WARP } from "./warpStyle";

/** her own state may be cut by a shared action now: a link once it has struck, a cast (hers or the shared one) once it
 *  has let go */
function ownCut(): boolean {
  switch (hero.state) {
    case "riposte":
    case "lineCast":
      return hero.hitDone;
    case "cast":
      return castLanded();
    case "flurry":
      return cerise.flurryDone >= cerise.flurryCount;
    case "tempest":
      return false;
    default:
      return isFree() || blowsDone();
  }
}

/** her own states, run by the kit; the shared cast lets a spell loose on its release and the shared runner ends it */
function runState(): boolean {
  switch (hero.state) {
    case "riposte":
      runRiposte();
      return true;
    case "flurry":
      runFlurry();
      return true;
    case "lineCast":
      runLineCast();
      return true;
    case "tempest":
      runTempest();
      return true;
    case "cast":
      if (!hero.hitDone && hero.st >= ACTION_CLIPS.cast.hit) {
        hero.hitDone = true;
        releaseSpell();
      }
      return false;
    default:
      return false;
  }
}

/**
 * Cerise: a five-blow string of thrusts on a thin line that pays Points for Keen timing and spends them on the lunge, a
 * weak block and a parry that opens a riposte chain kept going on the beat, a warp that marks the foe, Flurry and Rose
 * Line on I, and Rose Tempest on U.
 */
export const CERISE_KIT: HeroKit = {
  tick: (dt) => {
    rechargeAbilities(dt);
    tickCeriseState(dt);
    tickMarks(dt);
    tickFeint(dt);
  },
  readActions,
  warp: CERISE_WARP,
  guard: CERISE_GUARD,
  abilities: CERISE_SLOTS,
  chooseMove,
  runState,
  pose: cerisePose,
  afterStrike: (id, hits) => afterStrike(id as Parameters<typeof afterStrike>[0], hits),
  shapeHit: (id, hit) => shapeHit(id as Parameters<typeof shapeHit>[0], hit),
  keenWindow,
  mayAct: ownCut,
  cutForAction: endRiposte,
  absorbHurt,
  hitBonus,
  damageScale: poiseScale,
  takenBonus,
  landed,
  dodge: dodgeHooks,
  draw: () => {
    drawMarks();
    drawStance();
  },
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: () => 1,
  drivesMotion: tempestDrives,
  gravityScale: () => 1,
  reset: () => {
    resetMotion();
    resetCeriseState();
    resetMarks();
    resetFeint();
  },
};
