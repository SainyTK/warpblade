import { BOONS } from "../../constants/boons";
import { ELEMENTS } from "../../constants/elements";
import { ATTUNEMENT, CHARGE_RANK, MASTERY, SKILL_MAX_LEVEL } from "../../constants/growth";
import { HONING } from "../../constants/honing";
import { FUSION_RANK, FUSIONS } from "../../constants/resonance";
import {
  ART_KIND,
  ATTUNEMENT_KIND,
  BOON_KIND,
  CHARGE_KIND,
  HONING_KIND,
  KIND_LABEL,
  MASTERY_KIND,
  RISK_LABEL,
} from "../../constants/skillLabels";
import { ARTS } from "../../stages/arts";
import { knowsFusion, knowsRecipe } from "../../store/unlocks";
import type { Build, Card, HoningId } from "../../types/build";
import type { ArtId, ElementId } from "../../types/campaign";
import type { CharacterDef } from "../../types/character";
import type { SkillDef } from "../../types/skill";
import { pactAt, rateFigure } from "../../utils/pacts";
import { type Ranks, resonanceRanks } from "../../utils/resonance";
import { skillOf } from "../../utils/skills";
import { skillIcon } from "./icons/iconImage";

/** a line under a card's text: an evolution whose partner the hero holds (gold), or one still to find */
export interface CardNote {
  text: string;
  tone: "recipe" | "partner" | "resonance" | "fusion" | "drain" | "regen" | "power";
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

const ART_MAX_LEVEL = 5;

const artLine = (level: number): string => `Level ${level - 1} to ${level}`;

function resonanceNotes(element: ElementId, gain: number, ranks: Ranks): CardNote[] {
  const before = ranks[element];
  const after = before + gain;
  const notes: CardNote[] = [{ text: `${ELEMENTS[element].name} ${before} to ${after}`, tone: "resonance" }];
  for (const fusion of FUSIONS) {
    if (!fusion.pair.includes(element)) continue;
    const other = fusion.pair[0] === element ? fusion.pair[1] : fusion.pair[0];
    if (before >= FUSION_RANK || after < FUSION_RANK || ranks[other] < FUSION_RANK) continue;
    notes.push({ text: `Fusion: ${knowsFusion(fusion.id) ? fusion.name : "???"}`, tone: "fusion" });
  }
  return notes;
}

const stepText = (from: string, to: string): string => (from === to ? to : `${from} to ${to}`);

function rateNote(label: string, before: number, after: number): CardNote | null {
  if (!after) return null;
  const from = before && Math.sign(before) === Math.sign(after) ? rateFigure(before) : "";
  const verb = after < 0 ? "Drains" : "Regains";
  const amount = from ? stepText(from, rateFigure(after)) : rateFigure(after);
  return { text: `${verb} ${amount} ${label}/s`, tone: after < 0 ? "drain" : "regen" };
}

const percent = (share: number): string => `${share > 0 ? "+" : "-"}${Math.round(Math.abs(share) * 100)}%`;

function powerNote(before: number, after: number): CardNote | null {
  if (!after) return null;
  const amount =
    before && Math.sign(before) === Math.sign(after) ? stepText(percent(before), percent(after)) : percent(after);
  return { text: `${amount} power`, tone: after > 0 ? "power" : "drain" };
}

function pactNotes(def: SkillDef, level: number): CardNote[] {
  const before = pactAt(def.pact, level - 1);
  const after = pactAt(def.pact, level);
  return [
    powerNote(before.power, after.power),
    rateNote("HP", before.hp, after.hp),
    rateNote("MP", before.mp, after.mp),
  ].filter((note): note is CardNote => note !== null);
}

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
  const ranks = resonanceRanks(build, c, ARTS);
  return {
    branch: def.element,
    kind: def.kind,
    path: `${ELEMENTS[def.element].name} ${KIND_LABEL[def.kind].toLowerCase()}, ${RISK_LABEL[def.risk].toLowerCase()}`,
    icon: skillIcon(id, false),
    name: def.name,
    line: skillLine(level),
    pips: { total: SKILL_MAX_LEVEL, had: level - 1 },
    text: level === 1 ? def.text : def.levels[level - 1].text,
    notes: [...pactNotes(def, level), ...resonanceNotes(def.element, 1, ranks), evolutionNote(c, def, build)],
    isNew: level === 1,
  };
}

function artFace(c: CharacterDef, id: ArtId, level: number, build: Build): CardFace {
  const art = ARTS[id];
  return {
    branch: art.element,
    path: `${ELEMENTS[art.element].name} ${ART_KIND.toLowerCase()}`,
    icon: `art_${id}`,
    name: art.name,
    line: artLine(level),
    pips: { total: ART_MAX_LEVEL, had: level - 1 },
    text: art.levels[level - 1].cardText,
    notes: resonanceNotes(art.element, 2, resonanceRanks(build, c, ARTS)),
    isNew: false,
  };
}

const stepLine = (label: string, level: number): string =>
  level === 1 ? `${label} 1` : `${label} ${level - 1} to ${level}`;

const percentOf = (share: number): string => `${Math.round(share * 100)}%`;

function masteryFace(c: CharacterDef, id: string, level: number, build: Build): CardFace {
  const def = skillOf(c, id);
  if (!def) throw new Error(`No skill ${id} for ${c.name}`);
  const evolved = build.evolved.includes(id);
  const element = ELEMENTS[def.element].name;
  return {
    branch: def.element,
    path: `${element} ${MASTERY_KIND.toLowerCase()}`,
    icon: skillIcon(id, evolved),
    name: evolved ? def.evolution.name : def.name,
    line: stepLine(MASTERY_KIND, level),
    pips: { total: MASTERY.levels, had: level - 1 },
    text: `Attack and ability power +${percentOf(MASTERY.power)}, ${element} resonance +${MASTERY.resonance}.`,
    notes: resonanceNotes(def.element, MASTERY.resonance, resonanceRanks(build, c, ARTS)),
    isNew: false,
  };
}

function chargeFace(c: CharacterDef, level: number): CardFace {
  const ultimate = c.skills.find((s) => s.kind === "ultimate");
  return {
    branch: ultimate?.element ?? "boon",
    path: CHARGE_KIND,
    icon: ultimate ? skillIcon(ultimate.id, false) : BOONS[0].id,
    name: "Deeper Charge",
    line: stepLine("Rank", level),
    pips: { total: CHARGE_RANK.ranks, had: level - 1 },
    text: `Charged skills deal +${percentOf(CHARGE_RANK.damage)} and charge ${percentOf(CHARGE_RANK.chargeRate)} faster.`,
    notes: [],
    isNew: false,
  };
}

function attunementFace(c: CharacterDef, element: ElementId, level: number, build: Build): CardFace {
  const name = ELEMENTS[element].name;
  return {
    branch: element,
    path: ATTUNEMENT_KIND,
    icon: `el_${element}`,
    name: `${name} ${ATTUNEMENT_KIND}`,
    line: stepLine("Level", level),
    pips: { total: ATTUNEMENT.levels, had: level - 1 },
    text: `${name} resonance +${ATTUNEMENT.resonance}.`,
    notes: resonanceNotes(element, ATTUNEMENT.resonance, resonanceRanks(build, c, ARTS)),
    isNew: false,
  };
}

function honingFace(id: HoningId, level: number): CardFace {
  const def = HONING[id];
  return {
    branch: "honing",
    path: HONING_KIND,
    icon: def.icon,
    name: def.name,
    line: stepLine("Rank", level),
    text: def.text,
    notes: [],
    isNew: false,
  };
}

/** what one card shows, from the hero's skills and build */
export function cardFace(c: CharacterDef, card: Card, build: Build): CardFace {
  if (card.type === "skill") return skillFace(c, card.id, card.level, build);
  if (card.type === "art") return artFace(c, card.id, card.level, build);
  if (card.type === "mastery") return masteryFace(c, card.id, card.level, build);
  if (card.type === "charge") return chargeFace(c, card.level);
  if (card.type === "attunement") return attunementFace(c, card.id, card.level, build);
  if (card.type === "honing") return honingFace(card.id, card.level);
  const boon = BOONS.find((b) => b.id === card.id) ?? BOONS[0];
  return { branch: "boon", path: BOON_KIND, icon: boon.id, name: boon.name, text: boon.text, notes: [], isNew: false };
}
