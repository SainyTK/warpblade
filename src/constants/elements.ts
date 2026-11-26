import type { ElementId } from "../types/campaign";

export interface ElementDef {
  id: ElementId;
  name: string;
  color: string;
  dark: string;
}

export const ELEMENTS: Readonly<Record<ElementId, ElementDef>> = {
  blaze: { id: "blaze", name: "Blaze", color: "#ff8a2a", dark: "#3a1a0c" },
  frost: { id: "frost", name: "Frost", color: "#8fd3f2", dark: "#102a48" },
  storm: { id: "storm", name: "Storm", color: "#ffe066", dark: "#3a3010" },
  venom: { id: "venom", name: "Venom", color: "#9fe05a", dark: "#1c3410" },
  void: { id: "void", name: "Void", color: "#b4a8ff", dark: "#241a52" },
};

export const ELEMENT_ORDER: readonly ElementId[] = ["blaze", "frost", "storm", "venom", "void"];
