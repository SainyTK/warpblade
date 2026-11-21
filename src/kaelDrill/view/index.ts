import { place } from "../../engine/frame";
import type { Pose } from "../../types/pose";
import type { Vec } from "../../types/rig";
import type { SpriteImage } from "../../types/sprite";
import type { Session } from "../simulation";
import { drawEnhancedGuard } from "./chainEffects";
import { createDashTrail } from "./dashTrail";
import { drawDefenseCue } from "./defenseCue";
import { createFighterMotion } from "./fighterMotion";
import { drawSkillCharge } from "./skillCharge";
import { drawSkillDarkness, drawSkillImpact } from "./skillImpact";
import { createSkillPortrait } from "./skillPortrait";
import { createSlashView } from "./slash";
import { drawElementImpact, drawElementProjectile } from "./spellEffects";
import { drawReadySpell } from "./spellHand";
import { drawSpellPreparation } from "./spellPreparation";
import { drawInfusedBlade } from "./swordEffects";
import { drawFlyingSword, drawWarpGhosts, drawWarpTrace } from "./warpEffects";

export function createDrillView() {
  const portrait = createSkillPortrait();
  const motion = createFighterMotion();
  const slashes = createSlashView();
  const trail = createDashTrail();
  let current: Session | undefined;
  let stamp = false;

  return {
    step(session: Session, pose: Pose, dt: number) {
      current = session;
      slashes.step(session.releasedStrike, dt);
      stamp = trail.step(session.fighter.dashTime > 0, dt) || stamp;
      return motion(session.fighter, pose, dt);
    },
    drawBack(cameraX: number): void {
      if (!current) {
        return;
      }
      drawSkillDarkness(current.fighter.skillCast, cameraX);
      drawSkillCharge(current.fighter);
      trail.draw();
      if (current.warpTrace) {
        drawWarpTrace(current.warpTrace);
      }
    },
    drawPortrait(ctx: CanvasRenderingContext2D): void {
      portrait(ctx, current?.fighter.skillCast ?? null);
    },
    drawFront(sprite: SpriteImage, pose: Pose, hand: Vec, reach: number, cameraX: number): void {
      if (!current) {
        return;
      }
      const { fighter, defenseCue, elementImpacts, elementProjectiles, warpTrace } = current;
      if (stamp) {
        trail.stamp(fighter, sprite);
        stamp = false;
      }
      if (warpTrace) {
        drawWarpGhosts(warpTrace, sprite);
      }
      if (fighter.warp?.phase === "flight") {
        drawFlyingSword(fighter.warp.weapon, true);
      } else {
        drawInfusedBlade(fighter, pose, hand, reach, null);
      }
      drawReadySpell(fighter, pose);
      drawEnhancedGuard(fighter);
      slashes.draw();
      for (const bolt of elementProjectiles) {
        drawElementProjectile(bolt);
      }
      for (const impact of elementImpacts) {
        drawElementImpact(impact);
      }
      drawSkillImpact(fighter.skillCast);
      drawDefenseCue(defenseCue);
      drawSpellPreparation(fighter, cameraX);
      place();
    },
  };
}
