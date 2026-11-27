import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { skillValues } from "../../../../../game/skills/query";
import { rng } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { sendWraith } from "../../summons/wraith";
import { fighterAt } from "../strike";

const ID = "za_wraith";
const wraith = { readyIn: 0 };
rememberPerSeat(hostMemory(wraith));

export const SAND_WRAITH_DRILL: ZafirDrillSkill = {
  id: ID,
  tick(dt) {
    wraith.readyIn = Math.max(0, wraith.readyIn - dt);
  },
  slashed(_strike, landed) {
    const native = skillValues(ID);
    if (!landed || wraith.readyIn > 0 || !rng.chance(native.chance)) {
      return;
    }
    wraith.readyIn = native.cooldown;
    const { x, y, face } = fighterAt();
    sendWraith(x + face * 8, y, face);
    if (native.pair) {
      sendWraith(x - face * 8, y, -face);
    }
  },
};
