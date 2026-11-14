import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `tick` ability power per second, `life` seconds charged, `bolt` and `arc` ability power of the lightning a
 *  sword blow calls (once per 2 s per foe), `arcs`, `contagion` the charge jumps to foes touching, `death` a dying
 *  charged foe arcs, `perfect` a perfect dodge charges foes near */
const LEVELS = levelRows([
  { text: "Foes the dodge passes through are charged and crackle.", values: { tick: 0.2, life: 3 } },
  { text: "Charge lasts 3 to 5 s.", values: { life: 5 } },
  { text: "New: a sword blow on a charged foe calls lightning.", values: { bolt: 1.5, arc: 1, arcs: 1 } },
  { text: "Charged foes crackle 0.2 to 0.5 a second.", values: { tick: 0.5 } },
  { text: "New: the charge jumps to foes touching a charged one.", values: { contagion: 1 } },
  { text: "New: a charged foe that dies arcs to foes near it.", values: { death: 1, bolt: 2 } },
  { text: "New: a perfect dodge charges every foe near.", values: { perfect: 1 } },
  { text: "Charged foes crackle harder; lightning arcs to 3.", values: { tick: 1.2, arcs: 3 } },
]);

export const STATIC_CHARGE: SkillDef = {
  id: "k_static",
  name: "Static Charge",
  kind: "dot",
  risk: "timed",
  button: "auto",
  text: "Dodge through foes to charge them; they crackle, and your sword sets them off.",
  levels: LEVELS,
  evolution: {
    partner: "k_passing",
    name: "Overload",
    text: "Charge never runs out, and each dodge strikes up to 8 charged foes with lightning.",
    row: evolvedRow(LEVELS[7], "Every dodge strikes the charged foes.", {
      overload: 3,
      overloadArcs: 2,
      most: 8,
      every: 1.5,
    }),
  },
};
