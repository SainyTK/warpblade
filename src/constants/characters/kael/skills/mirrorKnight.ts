import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `strike` attack power of the knight's warp strike, `riposte` times Kael's next blows deal, `ripTime` and
 *  `ripBlows`, `targets` foes the knight warps through, `stun`, `stay` seconds it fights beside Kael, `copy` share of
 *  Kael's blows it repeats, `cooldown` */
const LEVELS = levelRows([
  {
    text: "A perfect dodge calls a mirror knight that warp-strikes a foe.",
    values: { strike: 6, targets: 1, cooldown: 1 },
  },
  {
    text: "New: Riposte: the next blow after a perfect dodge deals triple.",
    values: { riposte: 3, ripTime: 1.5, ripBlows: 1 },
  },
  { text: "Knight strike 6 to 12.", values: { strike: 12 } },
  { text: "New: the knight warps through up to 2 foes.", values: { targets: 2 } },
  {
    text: "New: the knight stuns what it strikes; Riposte covers 2 blows.",
    values: { stun: 0.8, ripTime: 2.5, ripBlows: 2 },
  },
  { text: "New: the knight stays and copies your blows.", values: { stay: 4, copy: 0.5 } },
  { text: "Knight strike 12 to 30; copies at 80%.", values: { strike: 30, copy: 0.8 } },
  {
    text: "Knight strike 30 to 70; Riposte quadruple; stays 6 s.",
    values: { strike: 70, riposte: 4, copy: 1, stay: 6 },
  },
]);

export const MIRROR_KNIGHT: SkillDef = {
  id: "k_mirror",
  name: "Mirror Knight",
  kind: "summon",
  risk: "precise",
  button: "auto",
  text: "A perfect dodge calls a mirror knight that warp-strikes the nearest foe.",
  levels: LEVELS,
  evolution: {
    partner: "k_keen",
    name: "Perfect Reflection",
    text: "A perfect dodge stops time while Kael and the knight strike the attacker and every foe near.",
    row: evolvedRow(LEVELS[7], "Time stops; the attacker and all near are struck.", {
      reflect: 150,
      reflectArea: 15,
      reflectReach: 120,
      stay: 8,
    }),
  },
};
