import { place } from "../../engine/frame";
import type { DrillProfile, Session } from "../../types/drill";
import type { Pose } from "../../types/pose";
import type { Vec } from "../../types/rig";
import type { SpriteImage } from "../../types/sprite";
import { drillMotion } from "../constants";
import { drawEnhancedGuard } from "./chainEffects";
import { drillClips } from "./clips";
import { drawCutIn, loadPortrait } from "./cutIn";
import { createDashTrail } from "./dashTrail";
import { drawDefenseCue } from "./defenseCue";
import { drawBoltArt, drawImpactArt } from "./effectArt";
import { createFighterMotion } from "./fighterMotion";
import { drawSkillCharge } from "./skillCharge";
import { drawSkillDarkness, drawSkillImpact } from "./skillImpact";
import { createSlashView } from "./slash";
import { drawElementImpact, drawElementProjectile } from "./spellEffects";
import { drawReadySpell } from "./spellHand";
import { drawSpellPreparation } from "./spellPreparation";
import { drawInfusedBlade } from "./swordEffects";
import { drawFlyingSword, drawWarpGhosts, drawWarpTrace } from "./warpEffects";

export function createDrillView(profile: DrillProfile) {
  const portrait = loadPortrait(profile);
  const motion = createFighterMotion(drillClips(profile, drillMotion(profile)));
  const slashes = createSlashView();
  const trail = createDashTrail();
  let current: Session | undefined;
  let stamp = false;

  return {
    step(session: Session, pose: Pose, dt: number) {
      current = session;
      slashes.step(session, dt);
      stamp = trail.step(session.fighter.dashTime > 0, dt) || stamp;
      return motion(session, pose, dt);
    },
    drawBack(cameraX: number): void {
      if (!current) {
        return;
      }
      drawSkillDarkness(current.fighter.skillCast, cameraX);
      drawSkillCharge(current);
      current.profile.hooks?.drawBack?.();
      trail.draw();
      if (current.warpTrace) {
        drawWarpTrace(current.warpTrace);
      }
    },
    drawPortrait(ctx: CanvasRenderingContext2D): void {
      const cast = current?.fighter.skillCast;
      if (current && cast) {
        (current.profile.drawCutIn ?? drawCutIn)(ctx, cast, portrait);
      }
    },
    drawFront(sprite: SpriteImage, pose: Pose, hand: Vec, reach: number, cameraX: number): void {
      if (!current) {
        return;
      }
      const { fighter, defenseCue, elementImpacts, elementProjectiles, warpTrace, profile } = current;
      if (stamp) {
        trail.stamp(fighter, sprite);
        stamp = false;
      }
      if (warpTrace) {
        drawWarpGhosts(warpTrace, sprite);
      }
      if (fighter.warp?.phase === "flight") {
        drawFlyingSword(profile, fighter.warp.weapon, true);
      } else {
        drawInfusedBlade(profile, fighter, pose, hand, reach, null);
      }
      drawReadySpell(fighter, pose);
      drawEnhancedGuard(current);
      slashes.draw();
      for (const bolt of elementProjectiles) {
        drawBoltArt(profile, bolt);
        drawElementProjectile(bolt);
      }
      for (const impact of elementImpacts) {
        drawImpactArt(profile, impact);
        drawElementImpact(impact);
      }
      drawSkillImpact(profile, fighter.skillCast);
      drawDefenseCue(defenseCue);
      drawSpellPreparation(fighter, cameraX);
      profile.hooks?.draw?.();
      place();
    },
  };
}
