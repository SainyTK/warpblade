import type { CharacterDef } from "../../types/character";
import { stubCharacter } from "../stub";

/** Saya: a stand-in until this folder holds the hero's own module (docs/hero-module.md) */
export const SAYA: CharacterDef = stubCharacter({ id: "saya", name: "Saya", accent: "#ff6a6a", price: 550 });
