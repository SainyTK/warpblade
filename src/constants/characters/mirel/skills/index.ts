import type { SkillDef } from "../../../../types/skill";
import { BACKSWING } from "./backswing";
import { CLOCKWORK_WREN } from "./clockworkWren";
import { ENTROPY } from "./entropy";
import { FALLING_HOUR } from "./fallingHour";
import { FORETELL } from "./foretell";
import { GREAT_TOLL } from "./greatToll";
import { GRINDING_SAND } from "./grindingSand";
import { HOUR_HAND } from "./hourHand";
import { HOUR_OF_STILLNESS } from "./hourOfStillness";
import { LONG_ECHO } from "./longEcho";
import { LONG_REWIND } from "./longRewind";
import { ORRERY } from "./orrery";
import { PAST_SELF } from "./pastSelf";
import { PATIENCE } from "./patience";
import { QUICKENED } from "./quickened";
import { STEADY_PACE } from "./steadyPace";
import { STILL_POINT } from "./stillPoint";
import { SUNDIAL } from "./sundial";
import { SUSPENDED } from "./suspended";
import { WITHER } from "./wither";

/** Mirel's 20 skills, in the order the Codex lists them. Design: docs/skills/mirel.md */
export const MIREL_SKILL_DEFS: readonly SkillDef[] = [
  LONG_ECHO,
  GREAT_TOLL,
  STILL_POINT,
  FALLING_HOUR,
  BACKSWING,
  SUSPENDED,
  LONG_REWIND,
  QUICKENED,
  STEADY_PACE,
  SUNDIAL,
  FORETELL,
  HOUR_HAND,
  WITHER,
  GRINDING_SAND,
  ENTROPY,
  PAST_SELF,
  CLOCKWORK_WREN,
  ORRERY,
  PATIENCE,
  HOUR_OF_STILLNESS,
];
