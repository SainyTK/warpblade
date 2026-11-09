import type { SkillBehavior } from "../../../types/skillBehavior";
import { entropy } from "./entropy";
import { grindingSand } from "./grindingSand";
import { orrery } from "./orrery";
import { pastSelf } from "./pastSelf";
import { suspended } from "./suspended";
import { clockworkWren } from "./wren";

/** the code of each of Mirel's skills that acts on its own or answers events, by skill id; the rest live in her kit */
export const MIREL_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  m_wren: clockworkWren,
  m_orrery: orrery,
  m_pastself: pastSelf,
  m_sandstorm: grindingSand,
  m_entropy: entropy,
  m_suspend: suspended,
};
