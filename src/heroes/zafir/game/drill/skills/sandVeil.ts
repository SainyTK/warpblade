import type { ZafirDrillSkill } from "../../../types/drillSkill";

export const SAND_VEIL_DRILL: ZafirDrillSkill = {
  id: "za_veil",
  modify(m, { values }) {
    m.parryWindow *= 1 + (values.parry ?? 0);
  },
};
