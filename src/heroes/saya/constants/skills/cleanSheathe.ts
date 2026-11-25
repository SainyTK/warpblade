import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
import { SKILL } from "./ids";

/** values: `bonus` added to a clean sheathe's release on the first foe it reaches, `window` seconds after the return
 *  cut lands that J is clean, `mark` the damage-taken mark a clean release leaves for `markTime` s, `reset` it gives
 *  the abilities back, `warp` it gives the warp back, `breaths` it gives, `twice` share of a second release a beat later */
const LEVELS = levelRows([
  { text: "A clean sheathe's release deals +100% on the first foe.", values: { bonus: 1 } },
  { text: "Clean window 0.10 to 0.15 s.", values: { window: 0.15 } },
  { text: "New: a clean release marks its foes: +20% damage taken for 3 s.", values: { mark: 0.2, markTime: 3 } },
  { text: "Clean bonus +100% to +250%.", values: { bonus: 2.5 } },
  { text: "New: a clean sheathe gives Brushline and Moonrise back at once.", values: { reset: 1 } },
  { text: "New: a clean sheathe gives the warp back; mark +20% to +35%.", values: { warp: 1, mark: 0.35 } },
  { text: "New: a clean sheathe gives two breaths.", values: { breaths: 2 } },
  { text: "Clean bonus +250% to +700%; window 0.2 s.", values: { bonus: 7, window: 0.2 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "The sheathe deals +50% and its release +20%.", drill: { finisher: 0.5, release: 0.2 } },
  { text: "New: the sheathe's release is a sure critical hit.", drill: { crit: 1 } },
  { text: "Sheathe +50% to +90%; release +20% to +40%.", drill: { finisher: 0.9, release: 0.4 } },
  { text: "New: the release staggers every foe it strikes.", drill: { stagger: 0.4 } },
  { text: "New: the release restores 4 MP per foe.", drill: { mp: 4 } },
  { text: "Sheathe +90% to +150%; release +40% to +70%.", drill: { finisher: 1.5, release: 0.7 } },
  { text: "New: a second release follows at 40%.", drill: { echo: 0.4 } },
  { text: "Sheathe +150% to +300%; release +70% to +120%.", drill: { finisher: 3, release: 1.2 } },
]);

export const CLEAN_SHEATHE: SkillDef = {
  id: SKILL.clean,
  name: "Clean Sheathe",
  kind: "attack",
  element: "frost",
  risk: "precise",
  button: "J",
  text: "The sheathe, the last of the chain, hits harder and its release pays more.",
  levels: DRILL,
  evolution: {
    partner: SKILL.edge,
    name: "Perfect Stillness",
    text: "Every sheathe releases twice in full.",
    row: evolvedRow(DRILL[7], "Every sheathe releases twice in full.", {
      ...drillValues({ echo: 1 }),
      twice: 1,
    }),
  },
};
