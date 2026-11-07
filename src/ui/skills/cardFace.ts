import { BOONS } from "../../constants/boons";
import { CHARMS } from "../../constants/charms";
import { SKILL_MAX_LEVEL } from "../../constants/growth";
import { BOON_KIND, CHARM_KIND, KIND_LABEL, RISK_LABEL } from "../../constants/skillLabels";
import { knowsRecipe } from "../../store/unlocks";
import type { Build, Card, CharmId } from "../../types/build";
import type { CharacterDef } from "../../types/character";
import type { SkillDef } from "../../types/skill";
import { skillOf } from "../../utils/skills";
import { skillIcon } from "./icons/iconImage";

/** a line under a card's text: an evolution whose partner the hero holds (gold), or one still to find */
export interface CardNote {
  text: string;
  tone: "recipe" | "partner";
}

/** what a card shows, whatever it offers */
export interface CardFace {
  /** the colour family: a skill kind, `charm` or `boon` */
  branch: string;
  /** the skill kind, for skills */
  kind?: string;
  path: string;
  icon: string;
  name: string;
  /** the level the card reaches */
  line?: string;
  /** level pips: how many in all and how many are held before this card */
  pips?: { total: number; had: number };
  text: string;
  notes: CardNote[];
  isNew: boolean;
}

/** the level line of a charm card */
const charmLine = (level: number, top: number): string => (level === 1 ? "New charm" : `Level ${level} of ${top}`);

/** the level line of a skill card: new, or the step it takes */
const skillLine = (level: number): string => (level === 1 ? "New skill" : `Level ${level - 1} to ${level}`);

/** the evolution a skill leads to, with its partner once that evolution was made before */
export function evolutionNote(c: CharacterDef, def: SkillDef, build: Build): CardNote {
  const evo = def.evolution;
  if (!knowsRecipe(def.id)) return { text: `${evo.name}: evolves with ???`, tone: "partner" };
  const partner = skillOf(c, evo.partner)?.name ?? "???";
  return { text: `${evo.name}: evolves with ${partner}`, tone: build.skills[evo.partner] ? "recipe" : "partner" };
}

function skillFace(c: CharacterDef, id: string, level: number, build: Build): CardFace {
  const def = skillOf(c, id);
  if (!def) throw new Error(`No skill ${id} for ${c.name}`);
  return {
    branch: def.kind,
    kind: def.kind,
    path: `${KIND_LABEL[def.kind]}, ${RISK_LABEL[def.risk].toLowerCase()}`,
    icon: skillIcon(id, false),
    name: def.name,
    line: skillLine(level),
    pips: { total: SKILL_MAX_LEVEL, had: level - 1 },
    text: level === 1 ? def.text : def.levels[level - 1].text,
    notes: [evolutionNote(c, def, build)],
    isNew: level === 1,
  };
}

function charmFace(id: CharmId, level: number): CardFace {
  const def = CHARMS[id];
  return {
    branch: "charm",
    path: CHARM_KIND,
    icon: `charm_${id}`,
    name: def.name,
    line: charmLine(level, def.maxLevel),
    pips: def.maxLevel > 1 ? { total: def.maxLevel, had: level - 1 } : undefined,
    text: def.text,
    notes: [],
    isNew: level === 1,
  };
}

/** what one card shows, from the hero's skills and build */
export function cardFace(c: CharacterDef, card: Card, build: Build): CardFace {
  if (card.type === "skill") return skillFace(c, card.id, card.level, build);
  if (card.type === "charm") return charmFace(card.id, card.level);
  const boon = BOONS.find((b) => b.id === card.id) ?? BOONS[0];
  return { branch: "boon", path: BOON_KIND, icon: boon.id, name: boon.name, text: boon.text, notes: [], isNew: false };
}
