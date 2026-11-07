import type { SkillBehavior } from "../../../types/skillBehavior";
import { barbedJaws } from "./barbedJaws";
import { huntingHawk } from "./huntingHawk";
import { lodgedBolts } from "./lodgedBolts";
import { shadeArcher } from "./shadeArcher";
import { snareHound } from "./snareHound";
import { venomTips } from "./venom";

/** the code of each of Sable's skills that acts on its own or answers events, by skill id; the rest lives in her kit */
export const SABLE_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  s_venom: venomTips,
  s_barbed: barbedJaws,
  s_lodged: lodgedBolts,
  s_hawk: huntingHawk,
  s_hound: snareHound,
  s_shade: shadeArcher,
};
