import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { withDrill } from "./drillLevels";

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

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "A warp arrival loads the selected shell into the blade for 1 hit.", drill: { infuse: 1 } },
  { text: "New: shells load 15% faster.", drill: { prep: 0.15 } },
  { text: "New: an arrival cuts 1 s off a loading shell.", drill: { shorten: 1 } },
  { text: "Shells load 30% faster.", drill: { prep: 0.3 } },
  { text: "New: loaded blades last one more hit.", drill: { hits: 1 } },
  { text: "Shells load 40% faster.", drill: { prep: 0.4 } },
  { text: "New: the arrival fires a round into foes round it.", drill: { burst: 1 } },
  { text: "Shells load 50% faster; two more hits.", drill: { prep: 0.5, hits: 2 } },
]);

export const SPEED_LOADER: SkillDef = {
  id: "ca_speedload",
  name: "Speed Loader",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "A warp arrival loads the selected shell into the blade.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_drum",
    name: "Spin Cycle",
    text: "Every warp arrival readies the selected shell at once.",
    row: evolvedRow(DRILL_LEVELS[7], "Every arrival readies the shell.", {
      auto: 1,
      pull: 1,
      ring: 14,
    }),
  },
};
