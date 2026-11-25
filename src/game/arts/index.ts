import { ARTS } from "../../stages/arts";
import type { ArtId } from "../../types/campaign";
import type { DrillProfile, DrillSpell } from "../../types/drill";
import { character, progress } from "../state";
import { artSpell } from "./spell";

export const ART_MAX_LEVEL = 5;

export function earnArt(id: ArtId): void {
  progress.build.arts[id] = Math.max(1, progress.build.arts[id] ?? 0);
}

export const artLevel = (id: ArtId): number => progress.build.arts[id] ?? 0;

export function raiseArt(id: ArtId): void {
  progress.build.arts[id] = Math.min(ART_MAX_LEVEL, artLevel(id) + 1);
}

export const heldArts = (): ArtId[] => (Object.keys(progress.build.arts) as ArtId[]).filter((id) => artLevel(id) > 0);

export function artSpells(profile: DrillProfile): DrillSpell[] {
  return heldArts().map((id) => artSpell(ARTS[id], artLevel(id), profile.attack, character.id));
}

export function knownSpells(profile: DrillProfile): readonly DrillSpell[] {
  const arts = artSpells(profile);
  return arts.length ? [...profile.known(), ...arts] : profile.known();
}

export const isArtSpell = (spell: DrillSpell): boolean => spell.id in ARTS;
