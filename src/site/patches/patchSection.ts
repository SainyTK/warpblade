import type { PatchSectionInfo } from "../../constants/patchSections";
import type { PatchSection } from "../../types/patch";
import { el, setAccent } from "../dom";
import { patchEntry } from "./patchEntry";

/** one section, such as Heroes, with its entries */
export function patchSection(info: PatchSectionInfo, section: PatchSection, version: string): HTMLElement {
  const node = el("section", "patch-section");
  node.id = info.id;
  setAccent(node, info.accent);
  node.append(el("h2", "section-title", info.title), ...section.entries.map((entry) => patchEntry(entry, version)));
  return node;
}
