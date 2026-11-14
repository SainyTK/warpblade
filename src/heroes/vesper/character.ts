import type { CharacterDef } from "../../types/character";
import { stubCharacter } from "../stub";

/** Vesper: a stand-in until this folder holds the hero's own module (docs/hero-module.md) */
export const VESPER: CharacterDef = stubCharacter({ id: "vesper", name: "Vesper", accent: "#b8a0ff", price: 400 });
