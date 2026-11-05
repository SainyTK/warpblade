import { PATCH_KIND_LABELS } from "../../constants/patchSections";
import type { Patch } from "../../types/patch";
import { el } from "../dom";
import { patchHref } from "./archiveList";

export interface ArchiveSelect {
  element: HTMLElement;
  setCurrent(version: string): void;
}

/** the patch list as one compact picker on phones */
export function archiveSelect(patches: readonly Patch[]): ArchiveSelect {
  const element = el("div", "patch-picker");
  const label = el("label", "field-label", "All patches");
  label.htmlFor = "patch-picker";
  const select = el("select", "select");
  select.id = "patch-picker";
  for (const patch of patches) {
    const option = el("option", undefined, `${patch.version}: ${patch.title} (${PATCH_KIND_LABELS[patch.kind]})`);
    option.value = patch.version;
    select.append(option);
  }
  select.addEventListener("change", () => {
    window.location.hash = patchHref(select.value);
  });
  element.append(label, select);
  return {
    element,
    setCurrent(version) {
      select.value = version;
    },
  };
}
