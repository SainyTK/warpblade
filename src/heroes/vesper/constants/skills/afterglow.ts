import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `damage` attack damage a stack deals each tick (every 0.5 s), `max` stacks, `from` Tempo stacks from which it
 *  is laid (the top when unset), `burst` a fallen foe's burst in attack damage, `topRing` pixels round her that reaching
 *  the top lays it; evolved, it flares every second at the top */
const LEVELS = levelRows([
  { text: "At the top of Tempo your blows leave an afterglow that burns.", values: { damage: 0.1, max: 3 } },
  { text: "Afterglow 0.1 to 0.15.", values: { damage: 0.15 } },
  { text: "New: afterglow is laid from 7 Tempo.", values: { from: 7 } },
  { text: "Up to 5 on a foe.", values: { max: 5 } },
  { text: "New: a foe that falls with afterglow bursts on foes near it.", values: { burst: 1 } },
  { text: "Afterglow 0.15 to 0.24; laid from 5 Tempo.", values: { damage: 0.24, from: 5 } },
  { text: "New: reaching the top of Tempo lays it on every foe near you.", values: { topRing: 60 } },
  { text: "Afterglow 0.24 to 0.34; burst 1 to 1.6.", values: { damage: 0.34, burst: 1.6 } },
]);

export const AFTERGLOW: SkillDef = {
  id: "ve_glow",
  name: "Afterglow",
  kind: "dot",
  risk: "timed",
  button: "auto",
  text: "High Tempo makes your blows leave a violet afterglow that burns on.",
  levels: LEVELS,
  evolution: {
    partner: "ve_edge",
    name: "Dusk Fire",
    text: "Every second you hold the top of Tempo, all afterglow on screen flares for three ticks at once.",
    row: evolvedRow(LEVELS[7], "Afterglow flares each second at the top.", {}),
  },
};
