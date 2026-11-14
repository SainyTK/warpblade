import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `window` seconds added to the quick reload window, `ring` attack damage of the ring the cylinder throws as it closes within `reach` pixels, `mp` MP a quick reload gives back, `rate` the reload's clock runs this much faster, `push` the ring throws foes away, `burst` attack damage of a hot blast round you on a quick reload, `auto` every reload is quick, `pull` the ring draws foes in */
const LEVELS = levelRows([
  { text: "Quick reload window +50%.", values: { window: 0.07 } },
  { text: "New: the closing cylinder throws a cutting ring.", values: { ring: 0.8, reach: 26 } },
  { text: "Window +85%; ring +50%.", values: { window: 0.12, ring: 1.2 } },
  { text: "New: a quick reload gives back 12 MP.", values: { mp: 12 } },
  { text: "Reload 30% faster; ring 1.2 to 2.", values: { rate: 0.3, ring: 2 } },
  { text: "New: the ring throws foes away and staggers them.", values: { push: 1 } },
  { text: "New: a quick reload sets off a hot blast round you.", values: { burst: 2.5 } },
  { text: "Ring 2 to 9; blast 2.5 to 10.", values: { ring: 9, burst: 10 } },
]);

export const SPEED_LOADER: SkillDef = {
  id: "ca_speedload",
  name: "Speed Loader",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Reload faster, and the closing cylinder throws a cutting ring.",
  levels: LEVELS,
  evolution: {
    partner: "ca_drum",
    name: "Spin Cycle",
    text: "Every reload is quick, and the ring draws foes in before it cuts.",
    row: evolvedRow(LEVELS[7], "Every reload is quick; the ring draws foes in.", { auto: 1, pull: 1, ring: 14 }),
  },
};
